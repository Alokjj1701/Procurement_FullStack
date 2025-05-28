package com.procurehackathon.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class OnboardingDTO {
    private Long id;
    private String documents;
    private String status;
    private LocalDateTime submittedAt;
    private Long supplierId;
    private String supplierName;  // For display purposes
    private String notes;
} 