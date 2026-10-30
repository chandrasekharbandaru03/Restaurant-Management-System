package com.vcube.paymentservice.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vcube.paymentservice.dto.CreatePaymentRequest;
import com.vcube.paymentservice.dto.PaymentInitiationResponse;
import com.vcube.paymentservice.service.PaymentService;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/api/v1/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    // Create a COD payment record.
    @PostMapping
    public ResponseEntity<PaymentInitiationResponse> createPayment(
            @RequestBody CreatePaymentRequest request) {

        PaymentInitiationResponse response =
                paymentService.createPayment(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // Get payment details using the order ID.
    @GetMapping("/order/{orderId}")
    public ResponseEntity<PaymentInitiationResponse> getPaymentByOrderId(
            @PathVariable Long orderId) {

        PaymentInitiationResponse response =
                paymentService.getPaymentByOrderId(orderId);

        return ResponseEntity.ok(response);
    }

    // Mark a COD payment as collected.
    @PutMapping("/{paymentId}/collect")
    public ResponseEntity<PaymentInitiationResponse> markCodPaymentAsPaid(
            @PathVariable Long paymentId) {

        PaymentInitiationResponse response =
                paymentService.markCodPaymentAsPaid(paymentId);

        return ResponseEntity.ok(response);
    }
}
