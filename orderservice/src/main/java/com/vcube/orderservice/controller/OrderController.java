package com.vcube.orderservice.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.vcube.orderservice.model.Order;
import com.vcube.orderservice.service.OrderService;

@RestController
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", allowCredentials = "true")
@RequestMapping("/api/v1/orders")
public class OrderController {

	private final OrderService orderService;

	public OrderController(OrderService orderService) {
		this.orderService = orderService;
	}

	@PostMapping
	public ResponseEntity<Order> placeOrder(@RequestBody Order order) {
		Order savedOrder = orderService.placeOrder(order);
		return ResponseEntity.status(HttpStatus.CREATED).body(savedOrder);
	}

	@GetMapping
	public ResponseEntity<List<Order>> getAllOrders() {
		return ResponseEntity.ok(orderService.getAllOrders());
	}

	@GetMapping("/{id}")
	public ResponseEntity<Order> getOrderById(@PathVariable("id") Long id) {
		return ResponseEntity.ok(orderService.getOrderById(id));
	}

	@GetMapping("/customer/{customerId}")
	public ResponseEntity<List<Order>> getOrdersByCustomerId(@PathVariable("customerId") Long customerId) {
		return ResponseEntity.ok(orderService.getOrdersByCustomerId(customerId));
	}

	@PutMapping("/{id}/status")
	public ResponseEntity<Order> updateOrderStatus(@PathVariable("id") Long id, @RequestParam("status") String status) {
		return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
	}
}
