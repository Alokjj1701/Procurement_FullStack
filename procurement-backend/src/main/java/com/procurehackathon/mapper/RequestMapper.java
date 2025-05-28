package com.procurehackathon.mapper;

import com.procurehackathon.dto.RequestDTO;
import com.procurehackathon.model.Request;
import com.procurehackathon.model.RequestStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class RequestMapper {
    
    @Autowired
    private ProductMapper productMapper;
    
    public RequestDTO toDTO(Request request) {
        if (request == null) return null;
        
        RequestDTO dto = new RequestDTO();
        dto.setId(request.getId());
        dto.setRequestedBy(request.getRequestedBy());
        dto.setQuantity(request.getQuantity());
        dto.setStatus(request.getStatus());
        dto.setDepartment(request.getDepartment());
        dto.setPriority(request.getPriority());
        dto.setJustification(request.getJustification());
        dto.setCreatedAt(request.getCreatedAt());
        
        if (request.getProduct() != null) {
            dto.setProduct(productMapper.toDTO(request.getProduct()));
        }
        
        return dto;
    }
    
    public Request toEntity(RequestDTO dto) {
        if (dto == null) return null;
        
        Request request = new Request();
        request.setId(dto.getId());
        request.setRequestedBy(dto.getRequestedBy());
        request.setQuantity(dto.getQuantity());
        request.setStatus(dto.getStatus());
        request.setDepartment(dto.getDepartment());
        request.setPriority(dto.getPriority());
        request.setJustification(dto.getJustification());
        request.setCreatedAt(dto.getCreatedAt());
        
        // Note: product relationship should be set separately using productId
        return request;
    }
} 