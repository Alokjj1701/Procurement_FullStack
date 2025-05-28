package com.procurehackathon.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import com.procurehackathon.dto.ProductDTO;
import com.procurehackathon.model.RequestStatus;

@Data
public class RequestDTO {
    private Long id;
    private String requestedBy;
    private Integer quantity;
    private RequestStatus status;
    private ProductDTO product;
    private String department;
    private String priority;
    private String justification;
    private LocalDateTime createdAt;
    private String date; // Formatted date string for frontend
    private Double totalAmount; // Calculated from product price * quantity
    private String supplier; // Will be populated from product supplier if available

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
        if (createdAt != null) {
            this.date = createdAt.format(DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm"));
        }
    }

    public void setProduct(ProductDTO product) {
        this.product = product;
        if (product != null && product.getPrice() != null && quantity != null) {
            this.totalAmount = product.getPrice() * quantity;
        }
        if (product != null) {
            this.supplier = product.getSupplier();
        }
    }
} 