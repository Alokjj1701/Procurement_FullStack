package com.procurehackathon.mapper;

import com.procurehackathon.dto.OnboardingDTO;
import com.procurehackathon.model.Onboarding;
import org.springframework.stereotype.Component;

@Component
public class OnboardingMapper {
    
    public OnboardingDTO toDTO(Onboarding onboarding) {
        if (onboarding == null) return null;
        
        OnboardingDTO dto = new OnboardingDTO();
        dto.setId(onboarding.getId());
        dto.setDocuments(onboarding.getDocuments());
        dto.setStatus(onboarding.getStatus());
        dto.setSubmittedAt(onboarding.getSubmittedAt());
        dto.setNotes(onboarding.getNotes());
        
        if (onboarding.getSupplier() != null) {
            dto.setSupplierId(onboarding.getSupplier().getId());
            dto.setSupplierName(onboarding.getSupplier().getName());
        }
        
        return dto;
    }
    
    public Onboarding toEntity(OnboardingDTO dto) {
        if (dto == null) return null;
        
        Onboarding onboarding = new Onboarding();
        onboarding.setId(dto.getId());
        onboarding.setDocuments(dto.getDocuments());
        onboarding.setStatus(dto.getStatus());
        onboarding.setSubmittedAt(dto.getSubmittedAt());
        onboarding.setNotes(dto.getNotes());
        
        // Note: supplier relationship should be set separately using supplierId
        return onboarding;
    }
} 