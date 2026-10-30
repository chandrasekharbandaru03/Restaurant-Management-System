package com.vcube.orderservice.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vcube.orderservice.model.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByCustomerId(Long customerId);
}
