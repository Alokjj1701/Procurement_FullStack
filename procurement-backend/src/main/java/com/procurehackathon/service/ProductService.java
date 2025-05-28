package com.procurehackathon.service;

import com.procurehackathon.model.Product;
import com.procurehackathon.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    public long countTotalProducts() {
        return productRepository.count();
    }

    // Add more product-related business logic methods here
    // e.g., createProduct, updateProduct, deleteProduct, etc.
} 