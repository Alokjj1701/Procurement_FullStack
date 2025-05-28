package com.procurehackathon.controller;

import com.procurehackathon.model.Onboarding;
import com.procurehackathon.service.OnboardingService;
import com.procurehackathon.dto.OnboardingDTO;
import com.procurehackathon.mapper.OnboardingMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/onboarding")
public class OnboardingController {

    private final OnboardingService onboardingService;
    private final OnboardingMapper onboardingMapper;

    @Autowired
    public OnboardingController(OnboardingService onboardingService, OnboardingMapper onboardingMapper) {
        this.onboardingService = onboardingService;
        this.onboardingMapper = onboardingMapper;
    }

    @GetMapping
    public ResponseEntity<List<OnboardingDTO>> getAllOnboardingRequests() {
        List<Onboarding> onboardings = onboardingService.getAllOnboardingRequests();
        List<OnboardingDTO> dtos = onboardings.stream().map(onboardingMapper::toDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{engagementId}")
    public ResponseEntity<OnboardingDTO> getOnboardingRequestById(@PathVariable Long engagementId) {
        Optional<Onboarding> onboarding = onboardingService.getOnboardingRequestById(engagementId);
        return onboarding.map(o -> ResponseEntity.ok(onboardingMapper.toDTO(o)))
                         .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<OnboardingDTO> createOnboardingRequest(@RequestBody OnboardingDTO onboardingDTO) {
        Onboarding onboarding = onboardingMapper.toEntity(onboardingDTO);
        Onboarding savedOnboarding = onboardingService.saveOnboardingRequest(onboarding);
        return new ResponseEntity<>(onboardingMapper.toDTO(savedOnboarding), HttpStatus.CREATED);
    }

    @PutMapping("/{engagementId}")
    public ResponseEntity<OnboardingDTO> updateOnboardingRequest(@PathVariable Long engagementId, @RequestBody OnboardingDTO onboardingDTO) {
        Optional<Onboarding> optionalOnboarding = onboardingService.getOnboardingRequestById(engagementId);
        if (optionalOnboarding.isPresent()) {
            Onboarding existingOnboarding = optionalOnboarding.get();
            Onboarding onboardingToUpdate = onboardingMapper.toEntity(onboardingDTO);
            // Update only the fields that should be updated
            existingOnboarding.setStatus(onboardingToUpdate.getStatus());
            existingOnboarding.setSupplier(onboardingToUpdate.getSupplier());
            existingOnboarding.setDocuments(onboardingToUpdate.getDocuments());
            existingOnboarding.setNotes(onboardingToUpdate.getNotes());
            existingOnboarding.setSubmittedAt(onboardingToUpdate.getSubmittedAt());

            Onboarding updatedOnboarding = onboardingService.saveOnboardingRequest(existingOnboarding);
            return ResponseEntity.ok(onboardingMapper.toDTO(updatedOnboarding));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{engagementId}")
    public ResponseEntity<Void> deleteOnboardingRequest(@PathVariable Long engagementId) {
        if (onboardingService.getOnboardingRequestById(engagementId).isPresent()) {
            onboardingService.deleteOnboardingRequest(engagementId);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Add more controller methods as needed
} 