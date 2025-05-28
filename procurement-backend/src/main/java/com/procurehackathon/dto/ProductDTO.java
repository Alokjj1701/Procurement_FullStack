package com.procurehackathon.dto;

import lombok.Data;

@Data
public class ProductDTO {
    private Long id;
    private String category;
    private String description;
    private String name;
    private Double price;
    private Long supplierId;
    private String supplierName;  // For display purposes
    private String modelNo;
    private String supplier; // Added supplier field
} 