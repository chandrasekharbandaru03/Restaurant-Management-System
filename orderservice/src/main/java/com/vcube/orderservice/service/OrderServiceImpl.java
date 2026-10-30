
package com.vcube.orderservice.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vcube.orderservice.client.RestaurantClient;
import com.vcube.orderservice.model.Order;
import com.vcube.orderservice.model.OrderStatus;
import com.vcube.orderservice.model.RestaurantResponse;
import com.vcube.orderservice.repo.OrderRepository;

@Service
public class OrderServiceImpl implements OrderService {

	@Autowired
	private OrderRepository orderRepository;

	@Autowired
	private RestaurantClient restaurantClient;

	// Place a new order
	@Override
	public Order placeOrder(Order order) {

		// Check whether the restaurant exists
		RestaurantResponse restaurant = restaurantClient.getRestaurantById(order.getRestaurantId());

		if (restaurant == null) {
			throw new RuntimeException("Restaurant not found");
		}

		// Prepare order details
		order.setId(null);
		order.setStatus(OrderStatus.PLACED);
		order.setOrderDate(LocalDateTime.now());

		// Save order in database
		return orderRepository.save(order);
	}

	@Override
	public List<Order> getOrdersByCustomerId(Long customerId) {
		return orderRepository.findByCustomerId(customerId);
	}

	// Get all orders
	@Override
	public List<Order> getAllOrders() {
		return orderRepository.findAll();
	}

	// Get order by ID
	@Override
	public Order getOrderById(Long id) {
		return orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found with ID: " + id));
	}

	// Update order status
	@Override
	public Order updateOrderStatus(Long id, String status) {

		Order order = getOrderById(id);

		order.setStatus(OrderStatus.valueOf(status.toUpperCase()));

		return orderRepository.save(order);
	}
}
