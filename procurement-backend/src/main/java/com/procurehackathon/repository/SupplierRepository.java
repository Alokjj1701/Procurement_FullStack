package com.procurehackathon.repository;

import com.procurehackathon.model.Supplier;
import com.procurehackathon.model.SupplierStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    long countByStatus(SupplierStatus status);
    // Custom query methods can be added here
} 