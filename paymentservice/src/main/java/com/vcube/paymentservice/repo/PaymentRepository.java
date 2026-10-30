package com.vcube.paymentservice.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vcube.paymentservice.model.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findFirstByOrderIdOrderByCreatedAtDesc(Long orderId);
}