package com.vcube.paymentservice.dto;

import com.vcube.paymentservice.model.PaymentMethod;

public class CreatePaymentRequest {

	private Long orderId;
	private PaymentMethod paymentMethod;

	public Long getOrderId() {
		return orderId;
	}

	public void setOrderId(Long orderId) {
		this.orderId = orderId;
	}

	public PaymentMethod getPaymentMethod() {
		return paymentMethod;
	}

	public void setPaymentMethod(PaymentMethod paymentMethod) {
		this.paymentMethod = paymentMethod;
	}
}