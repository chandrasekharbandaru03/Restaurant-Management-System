package com.vcube.restaurantservice.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vcube.restaurantservice.exception.ResourceNotFoundException;
import com.vcube.restaurantservice.model.FoodItem;
import com.vcube.restaurantservice.model.Restaurant;
import com.vcube.restaurantservice.repo.FoodItemRepository;
import com.vcube.restaurantservice.repo.RestaurantRepository;

import jakarta.validation.Valid;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/api/v1")
public class RestaurantController {

	@Autowired
	private FoodItemRepository foodItemRepository;

	@Autowired
	private RestaurantRepository restaurantRepository;

	@GetMapping("/getAllRest")
	public List<Restaurant> getAllRestaurants() {
		return restaurantRepository.findAll();
	}

	@GetMapping("/{id}/foods")
	public List<FoodItem> getAllFoodItems(@PathVariable("id") Long id) {
		return foodItemRepository.findByRestaurantId(id);
	}

	@PostMapping("/addRes")
	public Restaurant addResturant(@Valid @RequestBody Restaurant rest) {
		return restaurantRepository.save(rest);
	}

	@GetMapping({"/getRestById/{id}", "/{id}"})
	public Restaurant getRestaurantById(@PathVariable("id") Long id) {
		return restaurantRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + id));
	}

	@PostMapping("/restaurants/{restaurantId}/foods")
	public ResponseEntity<FoodItem> addFoodItem(@PathVariable("restaurantId") Long restaurantId, @RequestBody FoodItem foodItem) {

		Restaurant restaurant = restaurantRepository.findById(restaurantId)
				.orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));

		foodItem.setId(null);
		foodItem.setRestaurant(restaurant);

		FoodItem savedFoodItem = foodItemRepository.save(foodItem);

		return ResponseEntity.status(HttpStatus.CREATED).body(savedFoodItem);
	}

	@GetMapping("/foods/{foodId}")
	public ResponseEntity<FoodItem> getFoodItemById(@PathVariable("foodId") Long foodId) {
		FoodItem food = foodItemRepository.findById(foodId)
				.orElseThrow(() -> new ResourceNotFoundException("Food item not found with id: " + foodId));
		return ResponseEntity.ok(food);
	}

	@PutMapping({"/foods/{foodId}", "/restaurants/{restaurantId}/foods/{foodId}"})
	public ResponseEntity<FoodItem> updateFoodItem(
			@PathVariable(value = "restaurantId", required = false) Long restaurantId,
			@PathVariable("foodId") Long foodId,
			@RequestBody FoodItem updatedFood) {

		FoodItem existing = foodItemRepository.findById(foodId)
				.orElseThrow(() -> new ResourceNotFoundException("Food item not found with id: " + foodId));

		if (updatedFood.getName() != null && !updatedFood.getName().trim().isEmpty()) {
			existing.setName(updatedFood.getName());
		}
		if (updatedFood.getPrice() != null) {
			existing.setPrice(updatedFood.getPrice());
		}

		FoodItem saved = foodItemRepository.save(existing);
		return ResponseEntity.ok(saved);
	}

	@DeleteMapping({"/foods/{foodId}", "/restaurants/{restaurantId}/foods/{foodId}"})
	public ResponseEntity<Void> deleteFoodItem(
			@PathVariable(value = "restaurantId", required = false) Long restaurantId,
			@PathVariable("foodId") Long foodId) {

		FoodItem existing = foodItemRepository.findById(foodId)
				.orElseThrow(() -> new ResourceNotFoundException("Food item not found with id: " + foodId));

		foodItemRepository.delete(existing);
		return ResponseEntity.noContent().build();
	}

	@DeleteMapping({"/restaurants/{id}", "/{id}"})
	public ResponseEntity<Void> deleteRestaurant(@PathVariable("id") Long id) {
		Restaurant restaurant = restaurantRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + id));

		List<FoodItem> items = foodItemRepository.findByRestaurantId(id);
		if (items != null && !items.isEmpty()) {
			foodItemRepository.deleteAll(items);
		}

		restaurantRepository.delete(restaurant);
		return ResponseEntity.noContent().build();
	}
}
