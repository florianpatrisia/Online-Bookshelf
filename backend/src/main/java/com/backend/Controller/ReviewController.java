package com.backend.Controller;

import com.backend.Exceptions.ReviewException;
import com.backend.Model.Review;
import com.backend.Service.ReviewService;
import com.backend.Coverter.ReviewConverter;
import com.backend.DTO.ReviewDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = { "http://localhost:3000", "https://page-turners-online.netlify.app" })
@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

	private final ReviewService reviewService;

	public ReviewController(ReviewService reviewService) {
		this.reviewService = reviewService;
	}

	@GetMapping
	public ResponseEntity<List<ReviewDTO>> getAllReviews() {
		List<Review> reviews = reviewService.getAllReviews();
		List<ReviewDTO> reviewDTOs = reviews.stream().map(ReviewConverter::to).toList();
		return ResponseEntity.ok(reviewDTOs);
	}

	@GetMapping("/book/{bookId}")
	public ResponseEntity<List<ReviewDTO>> getReviewsByBookId(@PathVariable Long bookId) {
		List<Review> reviews = reviewService.getReviewsByBookId(bookId);
		if (reviews.isEmpty()) {
			return ResponseEntity.noContent().build();
		}
		List<ReviewDTO> reviewDTOs = reviews.stream().map(ReviewConverter::to).toList();
		return ResponseEntity.ok(reviewDTOs);
	}

	@GetMapping("/user/{userId}")
	public ResponseEntity<List<ReviewDTO>> getReviewsByUserId(@PathVariable Long userId) {
		List<Review> reviews = reviewService.getReviewsByUserId(userId);
		if (reviews.isEmpty()) {
			return ResponseEntity.noContent().build();
		}
		List<ReviewDTO> reviewDTOs = reviews.stream().map(ReviewConverter::to).toList();
		return ResponseEntity.ok(reviewDTOs);
	}

	@GetMapping("/{id}")
	public ResponseEntity<ReviewDTO> getReviewById(@PathVariable Long id) {
		Review review = reviewService.getReviewById(id);
		if (review == null) {
			return ResponseEntity.notFound().build();
		}
		ReviewDTO reviewDTO = ReviewConverter.to(review);
		return ResponseEntity.ok(reviewDTO);
	}

	@PostMapping
	public ResponseEntity<ReviewDTO> createReview(@RequestBody ReviewDTO reviewDto) {
		Review review = ReviewConverter.from(reviewDto);
		Review savedReview = reviewService.saveReview(reviewDto.getBookId(), reviewDto.getUserId(), review);
		ReviewDTO reviewDTO = ReviewConverter.to(savedReview);
		return ResponseEntity.status(HttpStatus.CREATED).body(reviewDTO);
	}

	@PutMapping("/{id}")
	public ResponseEntity<ReviewDTO> updateReview(@PathVariable Long id, @RequestBody ReviewDTO reviewDto) {
		if (!id.equals(reviewDto.getReviewId())) {
			throw new ReviewException(HttpStatus.BAD_REQUEST, "Review ID in path and request body do not match");
		}
		Review updatedReview = ReviewConverter.from(reviewDto);
		Review result = reviewService.updateReview(id, reviewDto.getBookId(), reviewDto.getUserId(), updatedReview);
		ReviewDTO reviewDTO = ReviewConverter.to(result);
		return ResponseEntity.ok(reviewDTO);
	}

	@DeleteMapping("/admin/{id}")
	public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
		reviewService.deleteReview(id);
		return ResponseEntity.ok().build();
	}

}
