package com.procurehackathon.repository;

import com.procurehackathon.model.Onboarding;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OnboardingRepository extends JpaRepository<Onboarding, Long> {
    // Custom query methods can be added here
} 