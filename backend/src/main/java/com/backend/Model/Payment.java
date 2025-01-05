package com.backend.Model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name="payments")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long paymentId;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "amount")
    private double amount;
}
