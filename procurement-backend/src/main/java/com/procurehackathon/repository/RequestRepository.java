package com.procurehackathon.repository;

import com.procurehackathon.model.Request;
import com.procurehackathon.model.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RequestRepository extends JpaRepository<Request, Long> {
    List<Request> findByStatus(RequestStatus status);
    long countByStatus(RequestStatus status);

    @Query("SELECT r FROM Request r LEFT JOIN FETCH r.product")
    List<Request> findAllWithProduct();

    @Query("SELECT r FROM Request r LEFT JOIN FETCH r.product WHERE r.status = :status")
    List<Request> findByStatusWithProduct(RequestStatus status);

    List<Request> findByRequestedBy(String requestedBy);
} 