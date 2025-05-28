package com.procurehackathon.service;

import com.procurehackathon.model.Request;
import com.procurehackathon.model.RequestStatus;
import com.procurehackathon.repository.RequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class RequestService {

    @Autowired
    private RequestRepository requestRepository;

    public List<Request> getAllRequests() {
        return requestRepository.findAllWithProduct();
    }

    public List<Request> getRequestsByAssignee(Long assigneeId) {
        return requestRepository.findByStatusWithProduct(RequestStatus.PENDING);
    }

    public Optional<Request> getRequestById(Long id) {
        return requestRepository.findById(id);
    }

    public Request saveRequest(Request request) {
        if (request.getStatus() == null) {
            request.setStatus(RequestStatus.PENDING);
        }
        return requestRepository.save(request);
    }

    public void deleteRequest(Long id) {
        requestRepository.deleteById(id);
    }

    public long countPendingRequests() {
        return requestRepository.countByStatus(RequestStatus.PENDING);
    }

    public List<Request> getRequestsByAssigneeEmail(String email) {
        return requestRepository.findByRequestedBy(email);
    }
}
