package com.procurehackathon.repository;

import com.procurehackathon.model.ProcurementRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProcurementRequestRepository extends JpaRepository<ProcurementRequest, Long> {
    List<ProcurementRequest> findByRequesterId(Long requesterId);
    List<ProcurementRequest> findByStatus(String status);
    List<ProcurementRequest> findByDepartment(String department);
} 