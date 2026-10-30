package com.vcube.paymentservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import com.vcube.paymentservice.dto.OrderResponse;

@FeignClient(name = "orderservice")
public interface OrderClient {

	@GetMapping("/api/v1/orders/{id}")
	OrderResponse getOrderById(@PathVariable("id") Long id);
}