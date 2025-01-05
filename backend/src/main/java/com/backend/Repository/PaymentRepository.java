package com.backend.Repository;

import com.backend.Model.Payment;
import org.springframework.data.repository.CrudRepository;

public interface PaymentRepository extends CrudRepository<Payment, Long> {
    Payment findByUserId(Long userId);
}
