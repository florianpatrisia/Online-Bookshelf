package com.backend.Controller.Advice;

import com.backend.Exceptions.ReviewException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;

@ControllerAdvice(annotations = RestController.class)
public class GlobalExceptionHandler {

	@ExceptionHandler(ReviewException.class)
	public ResponseEntity<String> handleReviewException(ReviewException ex) {
		return ResponseEntity.status(ex.getErrorCode()).body(ex.getErrorMessage());
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<Object> handleGeneralException(Exception ex) {
		String errorMessage = "A server error occurred: " + ex.getMessage();
		return new ResponseEntity<>(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
	}

}
