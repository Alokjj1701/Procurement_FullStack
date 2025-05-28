package com.procurehackathon.service;

import com.azure.ai.openai.OpenAIClient;
import com.azure.ai.openai.OpenAIClientBuilder;
import com.azure.ai.openai.models.ChatCompletions;
import com.azure.ai.openai.models.ChatCompletionsOptions;
import com.azure.ai.openai.models.ChatMessage;
import com.azure.ai.openai.models.ChatRole;
import com.azure.core.credential.AzureKeyCredential;
import com.procurehackathon.entity.User;
import com.procurehackathon.model.Product;
import com.procurehackathon.model.ProcurementRequest;
import com.procurehackathon.repository.UserRepository;
import com.procurehackathon.repository.ProductRepository;
import com.procurehackathon.repository.ProcurementRequestRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.regex.Pattern;
import java.util.regex.Matcher;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ChatbotService {
    private static final Logger logger = LoggerFactory.getLogger(ChatbotService.class);

    @Value("${azure.openai.endpoint}")
    private String endpoint;

    @Value("${azure.openai.key}")
    private String key;

    @Value("${azure.openai.deployment-name}")
    private String deploymentName;

    @Autowired
    private ProductService productService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProcurementRequestRepository procurementRequestRepository;

    private OpenAIClient client;
    private static final Pattern PRODUCT_SEARCH = Pattern.compile("(?:need|want|looking for|searching for)\\s+([\\w\\s]+?)(?:\\s+in|\\s+at|\\s+for|$)");

    // Conversation state for each user
    private static class ConversationState {
        String operation; // e.g., "create_product", "create_request"
        Map<String, String> data = new HashMap<>();
        String awaitingField; // e.g., "name", "category", etc.
        List<Product> availableProducts; // For request creation flow
    }
    private final Map<String, ConversationState> userStates = new ConcurrentHashMap<>();

    private OpenAIClient getClient() {
        if (client == null) {
            client = new OpenAIClientBuilder()
                .endpoint(endpoint)
                .credential(new AzureKeyCredential(key))
                .buildClient();
        }
        return client;
    }

    public String processMessage(String userId, String message) {
        try {
            logger.info("Processing message for user {}: {}", userId, message);
            User user = userRepository.findById(Long.parseLong(userId))
                .orElseThrow(() -> new RuntimeException("User not found"));

            // Check for ongoing conversation
            ConversationState state = userStates.get(userId);
            if (state != null && state.operation != null) {
                return handleOngoingConversation(userId, message, state);
            }

            // Detect intent
            String lowerMessage = message.toLowerCase();
            if (lowerMessage.startsWith("create product")) {
                ConversationState newState = new ConversationState();
                newState.operation = "create_product";
                newState.awaitingField = "name";
                userStates.put(userId, newState);
                return "What is the product name?";
            } else if (lowerMessage.startsWith("create request") || lowerMessage.startsWith("raise request")) {
                ConversationState newState = new ConversationState();
                newState.operation = "create_request";
                newState.awaitingField = "product_category";
                userStates.put(userId, newState);
                return "What type of product are you looking for? (e.g., Electronics, Office Supplies, etc.)";
            }
            // TODO: Add similar logic for update/delete flows

            // Check for CRUD operations
            if (lowerMessage.startsWith("create")) {
                return handleCreateOperation(userId, message.substring(7).trim());
            } else if (lowerMessage.startsWith("update")) {
                String[] parts = message.substring(7).trim().split("\\s+", 2);
                if (parts.length < 2) {
                    return "Please provide an item ID and update details. Format: update [itemId] [details]";
                }
                return handleUpdateOperation(userId, parts[0], parts[1]);
            } else if (lowerMessage.startsWith("delete")) {
                String itemId = message.substring(7).trim();
                if (itemId.isEmpty()) {
                    return "Please provide an item ID to delete. Format: delete [itemId]";
                }
                return handleDeleteOperation(userId, itemId);
            }

            // Check if this is a product search
            Matcher searchMatcher = PRODUCT_SEARCH.matcher(lowerMessage);
            if (searchMatcher.find()) {
                return handleProductSearch(searchMatcher.group(1).trim());
            }

            // If not a CRUD operation or product search, use AI to generate response
            return getAIResponse(message);

        } catch (Exception e) {
            logger.error("Error processing message: {}", e.getMessage(), e);
            return "I apologize, but I encountered an error. Please try again or contact support if the issue persists.";
        }
    }

    private String handleOngoingConversation(String userId, String message, ConversationState state) {
        if ("create_product".equals(state.operation)) {
            // Collect fields in order: name, category, price, description
            if (state.awaitingField.equals("name")) {
                state.data.put("name", message.trim());
                state.awaitingField = "category";
                return "What is the category?";
            } else if (state.awaitingField.equals("category")) {
                state.data.put("category", message.trim());
                state.awaitingField = "price";
                return "What is the price?";
            } else if (state.awaitingField.equals("price")) {
                state.data.put("price", message.trim());
                state.awaitingField = "description";
                return "What is the description?";
            } else if (state.awaitingField.equals("description")) {
                state.data.put("description", message.trim());
                // Confirm creation
                String summary = String.format(
                    "Product details:\nName: %s\nCategory: %s\nPrice: %s\nDescription: %s\nConfirm creation? (yes/no)",
                    state.data.get("name"),
                    state.data.get("category"),
                    state.data.get("price"),
                    state.data.get("description")
                );
                state.awaitingField = "confirm";
                return summary;
            } else if (state.awaitingField.equals("confirm")) {
                if (message.trim().equalsIgnoreCase("yes")) {
                    // Create product
                    Product product = new Product();
                    product.setName(state.data.get("name"));
                    product.setCategory(state.data.get("category"));
                    try {
                        product.setPrice(Double.parseDouble(state.data.get("price")));
                    } catch (NumberFormatException e) {
                        userStates.remove(userId);
                        return "Invalid price format. Please start again.";
                    }
                    product.setDescription(state.data.get("description"));
                    productRepository.save(product);
                    userStates.remove(userId);
                    return "Product created successfully!";
                } else {
                    userStates.remove(userId);
                    return "Product creation cancelled.";
                }
            }
        } else if ("create_request".equals(state.operation)) {
            if (state.awaitingField.equals("product_category")) {
                // Search for products in the category
                List<Product> products = productRepository.findByCategory(message.trim());
                if (products.isEmpty()) {
                    userStates.remove(userId);
                    return String.format("No products found in category '%s'. Would you like to:\n" +
                        "1. Try a different category\n" +
                        "2. Create a new product in this category", message.trim());
                }
                
                state.availableProducts = products;
                StringBuilder response = new StringBuilder("Here are the available products:\n");
                for (int i = 0; i < products.size(); i++) {
                    Product p = products.get(i);
                    response.append(String.format("%d. %s - $%.2f\n", i + 1, p.getName(), p.getPrice()));
                }
                response.append("\nPlease select a product by number (1-" + products.size() + ")");
                state.awaitingField = "product_selection";
                return response.toString();
            } else if (state.awaitingField.equals("product_selection")) {
                try {
                    int selection = Integer.parseInt(message.trim()) - 1;
                    if (selection < 0 || selection >= state.availableProducts.size()) {
                        return "Invalid selection. Please choose a number between 1 and " + state.availableProducts.size();
                    }
                    Product selectedProduct = state.availableProducts.get(selection);
                    state.data.put("product_id", selectedProduct.getId().toString());
                    state.data.put("product_name", selectedProduct.getName());
                    state.awaitingField = "quantity";
                    return "How many units do you need?";
                } catch (NumberFormatException e) {
                    return "Please enter a valid number.";
                }
            } else if (state.awaitingField.equals("quantity")) {
                try {
                    int quantity = Integer.parseInt(message.trim());
                    if (quantity <= 0) {
                        return "Please enter a positive quantity.";
                    }
                    state.data.put("quantity", String.valueOf(quantity));
                    state.awaitingField = "department";
                    return "Which department is this request for?";
                } catch (NumberFormatException e) {
                    return "Please enter a valid number.";
                }
            } else if (state.awaitingField.equals("department")) {
                state.data.put("department", message.trim());
                state.awaitingField = "priority";
                return "What is the priority level? (High/Medium/Low)";
            } else if (state.awaitingField.equals("priority")) {
                String priority = message.trim().toLowerCase();
                if (!priority.matches("high|medium|low")) {
                    return "Please enter High, Medium, or Low.";
                }
                state.data.put("priority", priority);
                
                // Confirm request
                String summary = String.format(
                    "Request Summary:\n" +
                    "Product: %s\n" +
                    "Quantity: %s\n" +
                    "Department: %s\n" +
                    "Priority: %s\n" +
                    "Confirm request? (yes/no)",
                    state.data.get("product_name"),
                    state.data.get("quantity"),
                    state.data.get("department"),
                    state.data.get("priority")
                );
                state.awaitingField = "confirm";
                return summary;
            } else if (state.awaitingField.equals("confirm")) {
                if (message.trim().equalsIgnoreCase("yes")) {
                    // Create procurement request
                    ProcurementRequest request = new ProcurementRequest();
                    request.setProductId(Long.parseLong(state.data.get("product_id")));
                    request.setQuantity(Integer.parseInt(state.data.get("quantity")));
                    request.setDepartment(state.data.get("department"));
                    request.setPriority(state.data.get("priority"));
                    request.setStatus("PENDING");
                    request.setRequesterId(Long.parseLong(userId));
                    
                    // Save request
                    procurementRequestRepository.save(request);
                    userStates.remove(userId);
                    return "Procurement request created successfully! Your request ID is: " + request.getId();
                } else {
                    userStates.remove(userId);
                    return "Request creation cancelled.";
                }
            }
        }
        // TODO: Add similar logic for update/delete flows
        userStates.remove(userId);
        return "Sorry, I didn't understand. Let's start over.";
    }

    private String handleCreateOperation(String userId, String details) {
        try {
            // Check if this is a follow-up with product details
            if (details.contains("name:") || details.contains("category:") || 
                details.contains("price:") || details.contains("description:")) {
                // Parse the product details
                String[] lines = details.split("\n");
                Map<String, String> productDetails = new HashMap<>();
                
                for (String line : lines) {
                    String[] parts = line.split(":", 2);
                    if (parts.length == 2) {
                        productDetails.put(parts[0].trim().toLowerCase(), parts[1].trim());
                    }
                }
                
                // Validate required fields
                if (!productDetails.containsKey("name") || !productDetails.containsKey("category") ||
                    !productDetails.containsKey("price") || !productDetails.containsKey("description")) {
                    return "Please provide all required details in the format:\n" +
                           "name: [product name]\n" +
                           "category: [category]\n" +
                           "price: [price]\n" +
                           "description: [description]";
                }
                
                // Create the product
                Product product = new Product();
                product.setName(productDetails.get("name"));
                product.setCategory(productDetails.get("category"));
                try {
                    product.setPrice(Double.parseDouble(productDetails.get("price")));
                } catch (NumberFormatException e) {
                    return "Invalid price format. Please provide a valid number.";
                }
                product.setDescription(productDetails.get("description"));
                
                // Save the product
                Product savedProduct = productRepository.save(product);
                return String.format("Successfully created product:\n" +
                                   "Name: %s\n" +
                                   "Category: %s\n" +
                                   "Price: $%.2f\n" +
                                   "Description: %s",
                                   savedProduct.getName(),
                                   savedProduct.getCategory(),
                                   savedProduct.getPrice(),
                                   savedProduct.getDescription());
            }
            
            // Initial prompt for product creation
            if (details.toLowerCase().contains("product")) {
                return "I'll help you create a new product. Please provide the following details in this format:\n" +
                       "name: [product name]\n" +
                       "category: [category]\n" +
                       "price: [price]\n" +
                       "description: [description]";
            } else if (details.toLowerCase().contains("request")) {
                return "I'll help you create a new request. Please provide the following details:\n" +
                       "- Product name\n" +
                       "- Quantity\n" +
                       "- Department\n" +
                       "- Priority";
            }
            return "I can help you create products or requests. Please specify which one you'd like to create.";
        } catch (Exception e) {
            logger.error("Error in create operation: {}", e.getMessage(), e);
            return "I encountered an error while processing your create request. Please try again.";
        }
    }

    private String handleUpdateOperation(String userId, String itemId, String details) {
        try {
            // Parse the details and update appropriate entity
            if (itemId.startsWith("PRD")) {
                // Handle product update
                return String.format("I'll help you update product %s. Current details: %s", itemId, details);
            } else if (itemId.startsWith("REQ")) {
                // Handle request update
                return String.format("I'll help you update request %s. Current details: %s", itemId, details);
            }
            return "I can help you update products or requests. Please provide a valid item ID.";
        } catch (Exception e) {
            logger.error("Error in update operation: {}", e.getMessage(), e);
            return "I encountered an error while processing your update request. Please try again.";
        }
    }

    private String handleDeleteOperation(String userId, String itemId) {
        try {
            // Check if item exists and delete it
            if (itemId.startsWith("PRD")) {
                // Handle product deletion
                return String.format("I'll help you delete product %s. Please confirm the deletion.", itemId);
            } else if (itemId.startsWith("REQ")) {
                // Handle request deletion
                return String.format("I'll help you delete request %s. Please confirm the deletion.", itemId);
            }
            return "I can help you delete products or requests. Please provide a valid item ID.";
        } catch (Exception e) {
            logger.error("Error in delete operation: {}", e.getMessage(), e);
            return "I encountered an error while processing your delete request. Please try again.";
        }
    }

    private String handleProductSearch(String productCategory) {
        try {
            List<Product> availableProducts = productRepository.findByCategory(productCategory);
            
            if (!availableProducts.isEmpty()) {
                StringBuilder response = new StringBuilder("Here are the available products:\n");
                for (Product product : availableProducts) {
                    response.append(String.format("- Name: %s, Model: %s, Price: $%.2f\n", 
                        product.getName(), product.getModelNo(), product.getPrice()));
                }
                response.append("\nWould you like to raise a procurement request for any of these?");
                return response.toString();
            } else {
                return String.format("I couldn't find any %s in our catalog. Would you like to:\n1. Raise an engagement request for a supplier\n2. Try a different product", productCategory);
            }
        } catch (Exception e) {
            logger.error("Error in product search: {}", e.getMessage(), e);
            return "I encountered an error while searching for products. Please try again.";
        }
    }

    private String getAIResponse(String message) {
        try {
            List<ChatMessage> messages = new ArrayList<>();
            messages.add(new ChatMessage(ChatRole.SYSTEM, 
                "You are a helpful procurement assistant. You help users with purchase requests, " +
                "supplier management, and product catalog queries. Keep responses concise and focused " +
                "on procurement-related topics."));
            messages.add(new ChatMessage(ChatRole.USER, message));

            ChatCompletionsOptions options = new ChatCompletionsOptions(messages);
            options.setMaxTokens(150);
            options.setTemperature((double) 0.7f);

            ChatCompletions response = getClient().getChatCompletions(deploymentName, options);
            return response.getChoices().get(0).getMessage().getContent();
        } catch (Exception e) {
            logger.error("Error getting AI response: {}", e.getMessage(), e);
            return "I'm having trouble processing your request. Please try again.";
        }
    }
} 