package com.vcube.paymentservice.service;

import java.math.BigDecimal;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.vcube.paymentservice.client.OrderClient;
import com.vcube.paymentservice.dto.CreatePaymentRequest;
import com.vcube.paymentservice.dto.OrderResponse;
import com.vcube.paymentservice.dto.PaymentInitiationResponse;
import com.vcube.paymentservice.model.Payment;
import com.vcube.paymentservice.model.PaymentMethod;
import com.vcube.paymentservice.model.PaymentStatus;
import com.vcube.paymentservice.repo.PaymentRepository;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderClient orderClient;

    public PaymentService(
            PaymentRepository paymentRepository,
            OrderClient orderClient) {

        this.paymentRepository = paymentRepository;
        this.orderClient = orderClient;
    }

    public PaymentInitiationResponse createPayment(
            CreatePaymentRequest request) {

        if (request == null
                || request.getOrderId() == null
                || request.getPaymentMethod() == null) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Order ID and payment method are required");
        }

        if (request.getPaymentMethod() != PaymentMethod.COD) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Only Cash on Delivery is currently supported");
        }

        final OrderResponse order;

        try {
            order = orderClient.getOrderById(request.getOrderId());
        } catch (Exception ex) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Unable to retrieve order from Order Service",
                    ex);
        }

        if (order == null
                || order.getId() == null
                || order.getTotalAmount() == null
                || order.getTotalAmount()
                        .compareTo(BigDecimal.ZERO) <= 0) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Order not found or order amount is invalid");
        }

        Payment payment = new Payment();

        payment.setOrderId(order.getId());
        payment.setAmount(order.getTotalAmount());
        payment.setPaymentMethod(PaymentMethod.COD);
        payment.setPaymentStatus(PaymentStatus.PENDING);

        Payment savedPayment = paymentRepository.save(payment);

        return toResponse(savedPayment);
    }

    // Fetch the latest payment record for an order.
    public PaymentInitiationResponse getPaymentByOrderId(Long orderId) {

        if (orderId == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Order ID is required");
        }

        Payment payment = paymentRepository
                .findFirstByOrderIdOrderByCreatedAtDesc(orderId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Payment not found for order: " + orderId));

        return toResponse(payment);
    }

    // Mark a COD payment as collected.
    public PaymentInitiationResponse markCodPaymentAsPaid(Long paymentId) {

        if (paymentId == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Payment ID is required");
        }

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Payment not found: " + paymentId));

        if (payment.getPaymentMethod() != PaymentMethod.COD) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "This operation is only for COD payments");
        }

        if (payment.getPaymentStatus() == PaymentStatus.PAID) {
            return toResponse(payment);
        }

        if (payment.getPaymentStatus() != PaymentStatus.PENDING) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Only pending COD payments can be marked as paid");
        }

        payment.setPaymentStatus(PaymentStatus.PAID);

        return toResponse(paymentRepository.save(payment));
    }

    private PaymentInitiationResponse toResponse(Payment payment) {

        return new PaymentInitiationResponse(
                payment.getId(),
                payment.getOrderId(),
                payment.getAmount(),
                payment.getPaymentMethod(),
                payment.getPaymentStatus(),
                payment.getCreatedAt());
    }
}