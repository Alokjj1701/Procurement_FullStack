package com.procurehackathon.controller;

import com.procurehackathon.model.Request;
import com.procurehackathon.service.RequestService;
import com.procurehackathon.dto.RequestDTO;
import com.procurehackathon.mapper.RequestMapper;
import com.procurehackathon.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class RequestController {

    private final RequestService requestService;
    private final RequestMapper requestMapper;

    @Autowired
    public RequestController(RequestService requestService, RequestMapper requestMapper) {
        this.requestService = requestService;
        this.requestMapper = requestMapper;
    }

    @GetMapping
    public ResponseEntity<List<RequestDTO>> getAllRequests(@RequestParam(required = false) String assignedTo, @RequestParam(required = false) Long userId, @RequestParam(required = false) String email) {
        List<Request> requests;
        if (assignedTo != null && assignedTo.equals("me")) {
            if (userId != null) {
                requests = requestService.getRequestsByAssignee(userId);
            } else if (email != null) {
                requests = requestService.getRequestsByAssigneeEmail(email);
            } else {
                return ResponseEntity.badRequest().build();
            }
        } else {
            requests = requestService.getAllRequests();
        }
        List<RequestDTO> dtos = requests.stream()
            .map(requestMapper::toDTO)
            .toList();
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RequestDTO> getRequestById(@PathVariable Long id) {
        Optional<Request> request = requestService.getRequestById(id);
        return request
            .map(requestMapper::toDTO)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<RequestDTO> createRequest(@RequestBody RequestDTO requestDTO, @RequestParam(required = false) Long userId, @RequestParam(required = false) String email) {
        if (userId != null) {
            // Optionally set requestedBy based on userId if needed
        } else if (email != null) {
            requestDTO.setRequestedBy(email);
        }
        Request request = requestMapper.toEntity(requestDTO);
        Request savedRequest = requestService.saveRequest(request);
        return new ResponseEntity<>(requestMapper.toDTO(savedRequest), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RequestDTO> updateRequest(@PathVariable Long id, @RequestBody RequestDTO requestDTO) {
        Optional<Request> optionalRequest = requestService.getRequestById(id);
        if (optionalRequest.isPresent()) {
            Request existingRequest = optionalRequest.get();
            Request requestToUpdate = requestMapper.toEntity(requestDTO);
            
            // Update only the fields that should be updated
            existingRequest.setStatus(requestToUpdate.getStatus());
            existingRequest.setQuantity(requestToUpdate.getQuantity());
            existingRequest.setJustification(requestToUpdate.getJustification());
            existingRequest.setProduct(requestToUpdate.getProduct());
            existingRequest.setDepartment(requestToUpdate.getDepartment());
            existingRequest.setPriority(requestToUpdate.getPriority());
            existingRequest.setCreatedAt(requestToUpdate.getCreatedAt());

            Request updatedRequest = requestService.saveRequest(existingRequest);
            return ResponseEntity.ok(requestMapper.toDTO(updatedRequest));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRequest(@PathVariable Long id) {
        if (requestService.getRequestById(id).isPresent()) {
            requestService.deleteRequest(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Add more controller methods as needed
} 