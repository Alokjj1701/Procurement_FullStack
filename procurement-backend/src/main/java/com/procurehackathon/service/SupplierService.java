package com.procurehackathon.service;

import com.procurehackathon.model.Supplier;
import com.procurehackathon.model.SupplierStatus;
import com.procurehackathon.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SupplierService {

    @Autowired
    private SupplierRepository supplierRepository;

    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    public Optional<Supplier> getSupplierById(Long id) {
        return supplierRepository.findById(id);
    }

    public Supplier saveSupplier(Supplier supplier) {
        return supplierRepository.save(supplier);
    }

    public void deleteSupplier(Long id) {
        supplierRepository.deleteById(id);
    }

    public long countActiveSuppliers() {
        return supplierRepository.countByStatus(SupplierStatus.ACTIVE);
    }

    // Add more supplier-related business logic methods here
    // e.g., createSupplier, updateSupplier, deleteSupplier, etc.
} 