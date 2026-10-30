package com.vcube.paymentservice.dto;

import java.math.BigDecimal;

public class OrderResponse {

	private Long id;
	private BigDecimal totalAmount;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public BigDecimal getTotalAmount() {
		return totalAmount;
	}

	public void setTotalAmount(BigDecimal totalAmount) {
		this.totalAmount = totalAmount;
	}
}