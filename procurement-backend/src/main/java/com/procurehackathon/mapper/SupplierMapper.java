package com.procurehackathon.mapper;

import com.procurehackathon.dto.SupplierDTO;
import com.procurehackathon.model.Supplier;
import org.springframework.stereotype.Component;

@Component
public class SupplierMapper {
    public SupplierDTO toDTO(Supplier supplier) {
        if (supplier == null) return null;
        SupplierDTO dto = new SupplierDTO();
        dto.setId(supplier.getId());
        dto.setName(supplier.getName());
        dto.setEmail(supplier.getEmail());
        dto.setPhone(supplier.getPhone());
        dto.setCategory(supplier.getCategory());
        dto.setContactPerson(supplier.getContactPerson());
        dto.setStatus(supplier.getStatus());
        return dto;
    }

    public Supplier toEntity(SupplierDTO dto) {
        if (dto == null) return null;
        Supplier supplier = new Supplier();
        supplier.setId(dto.getId());
        supplier.setName(dto.getName());
        supplier.setEmail(dto.getEmail());
        supplier.setPhone(dto.getPhone());
        supplier.setCategory(dto.getCategory());
        supplier.setContactPerson(dto.getContactPerson());
        supplier.setStatus(dto.getStatus());
        return supplier;
    }
} 