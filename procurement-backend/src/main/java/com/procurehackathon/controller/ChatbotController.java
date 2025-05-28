package com.procurehackathon.controller;

import com.procurehackathon.service.ChatbotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/chatbot")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ChatbotController {

    @Autowired
    private ChatbotService chatbotService;

    @PostMapping("/message")
    public ResponseEntity<Map<String, String>> processMessage(@RequestBody Map<String, String> request) {
        String userId = request.get("userId");
        String message = request.get("message");
        String response = chatbotService.processMessage(userId, message);
        return ResponseEntity.ok(Map.of("message", response));
    }

    @PostMapping("/create")
    public ResponseEntity<Map<String, String>> handleCreateOperation(
            @RequestParam String userId,
            @RequestBody Map<String, Object> data) {
        String response = chatbotService.processMessage(userId, "create " + data.toString());
        return ResponseEntity.ok(Map.of("message", response));
    }

    @PutMapping("/update")
    public ResponseEntity<Map<String, String>> handleUpdateOperation(
            @RequestParam String userId,
            @RequestParam String itemId,
            @RequestBody Map<String, Object> data) {
        String response = chatbotService.processMessage(userId, "update " + itemId + " " + data.toString());
        return ResponseEntity.ok(Map.of("message", response));
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Map<String, String>> handleDeleteOperation(
            @RequestParam String userId,
            @RequestParam String itemId) {
        String response = chatbotService.processMessage(userId, "delete " + itemId);
        return ResponseEntity.ok(Map.of("message", response));
    }

    @GetMapping("/search")
    public ResponseEntity<Map<String, String>> searchItems(
            @RequestParam String userId,
            @RequestParam String query) {
        String response = chatbotService.processMessage(userId, "search " + query);
        return ResponseEntity.ok(Map.of("message", response));
    }
} 