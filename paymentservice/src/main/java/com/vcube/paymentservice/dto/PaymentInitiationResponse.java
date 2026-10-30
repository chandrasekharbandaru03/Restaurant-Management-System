
package com.vcube.paymentservice.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.vcube.paymentservice.model.PaymentMethod;
import com.vcube.paymentservice.model.PaymentStatus;

public record PaymentInitiationResponse(
        Long paymentId,
        Long orderId,
        BigDecimal amount,
        PaymentMethod paymentMethod,
        PaymentStatus paymentStatus,
        LocalDateTime createdAt) {
}
