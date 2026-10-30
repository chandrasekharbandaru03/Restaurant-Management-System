
package com.vcube.orderservice.service;

import java.util.List;
import com.vcube.orderservice.model.Order;

public interface OrderService {

    Order placeOrder(Order order);

    List<Order> getAllOrders();

    Order getOrderById(Long id);

    List<Order> getOrdersByCustomerId(Long customerId);

    Order updateOrderStatus(Long id, String status);
}
