package com.procurehackathon.repository;

import com.procurehackathon.model.OnboardingRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OnboardingRequestRepository extends JpaRepository<OnboardingRequest, Long> {
    List<OnboardingRequest> findByUserId(String userId);
} 