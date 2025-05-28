package com.procurehackathon.service;

import com.procurehackathon.model.Onboarding;
import com.procurehackathon.repository.OnboardingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OnboardingService {

    @Autowired
    private OnboardingRepository onboardingRepository;

    public List<Onboarding> getAllOnboardingRequests() {
        return onboardingRepository.findAll();
    }

    public Optional<Onboarding> getOnboardingRequestById(Long engagementId) {
        return onboardingRepository.findById(engagementId);
    }

    public Onboarding saveOnboardingRequest(Onboarding onboarding) {
        // Add business logic before saving, e.g., validation, setting default status
        return onboardingRepository.save(onboarding);
    }

    public Onboarding updateOnboardingRequest(Onboarding onboarding) {
        // Add business logic before saving, e.g., status transitions
        return onboardingRepository.save(onboarding);
    }

    public void deleteOnboardingRequest(Long engagementId) {
        onboardingRepository.deleteById(engagementId);
    }

    // Add more onboarding-related business logic methods here
    // e.g., getOnboardingRequestsByStatus, handleApprovalProcess, etc.
}
