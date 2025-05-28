package com.procurehackathon.dto;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class LoginResponse {
    private Long userId;
    private String email;
    private String name;
    private String role;
    private String department;
    private String token; // In a real app, this would be a JWT token
} 