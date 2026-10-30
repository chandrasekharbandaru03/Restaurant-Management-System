package com.vcube.restaurantservice.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<String> handleResourceNotFound(ResourceNotFoundException ex) {

		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());

	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<String> handleValidationException(MethodArgumentNotValidException ex) {

		String message = ex.getBindingResult().getFieldErrors().stream().map(error -> error.getDefaultMessage())
				.findFirst().orElse("Invalid request data");

		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(message);
	}
}