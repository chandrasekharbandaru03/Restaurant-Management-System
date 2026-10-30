package com.vcube.restaurantservice.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vcube.restaurantservice.model.Restaurant;

@Repository	
public interface RestaurantRepository  extends JpaRepository<Restaurant,Long>{

}
