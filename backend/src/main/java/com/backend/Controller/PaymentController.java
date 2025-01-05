package com.backend.Controller;

import com.backend.DTO.PaymentInfoRequest;
import com.backend.Model.Payment;
import com.backend.Service.PaymentService;
import com.backend.Config.ExtractJWT;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/payment")
public class PaymentController {

	private final PaymentService paymentService;

	public PaymentController(PaymentService paymentService) {
		this.paymentService = paymentService;
	}

	@PostMapping("/payment-intent")
	public ResponseEntity<String> createPaymentIntent(@RequestBody PaymentInfoRequest paymentInfoRequest)
			throws StripeException {

		PaymentIntent paymentIntent = paymentService.createPaymentIntent(paymentInfoRequest);
		String paymentStr = paymentIntent.toJson();

		return new ResponseEntity<>(paymentStr, HttpStatus.OK);
	}

	@PutMapping("/payment-complete")
	public ResponseEntity<String> stripePaymentComplete(@RequestHeader(value = "Authorization") String token)
			throws Exception {
		Long userId = ExtractJWT.getUserId(token);

		return paymentService.stripePayment(userId);
	}

	@GetMapping("/find-by-user-id")
	public ResponseEntity<Payment> getPaymentByUserId(@RequestParam Long userId) {
		Payment payment = paymentService.getPaymentByUserId(userId);
		if (payment == null) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<>(payment, HttpStatus.OK);
	}

}
