package com.procurehackathon.mapper;

import com.procurehackathon.dto.ProductDTO;
import com.procurehackathon.model.Product;
import org.springframework.stereotype.Component;

@Component
public class ProductMapper {
    
    public ProductDTO toDTO(Product product) {
        if (product == null) return null;
        
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setCategory(product.getCategory());
        dto.setPrice(product.getPrice());
        dto.setSupplier(product.getSupplier() != null ? product.getSupplier().getName() : null);
        
        return dto;
    }
    
    public Product toEntity(ProductDTO dto) {
        if (dto == null) return null;
        
        Product product = new Product();
        product.setId(dto.getId());
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setCategory(dto.getCategory());
        product.setPrice(dto.getPrice());
        // Note: supplier relationship should be set separately using supplierId
        
        return product;
    }
} 