package com.vcube.orderservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.vcube.orderservice.model.RestaurantResponse;

@FeignClient(name = "restaurantservice")
public interface RestaurantClient {

    @GetMapping("/api/v1/{id}")
    RestaurantResponse getRestaurantById(@PathVariable("id") Long id);
}