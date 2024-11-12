package com.backend.converter;


import com.backend.Model.Review;
import com.backend.dto.ReviewDTO;

public class ReviewConverter {

    public ReviewConverter() {
        throw new IllegalArgumentException();
    }

    public static Review from(ReviewDTO reviewRequest) {
        Review review = new Review();
        review.setDate(java.sql.Date.valueOf(reviewRequest.getDate()));
        review.setRating(reviewRequest.getRating());
        review.setDescription(reviewRequest.getDescription());
        return review;
    }

    public static ReviewDTO to(Review review) {
        ReviewDTO reviewDTO = new ReviewDTO();
        reviewDTO.setReviewId(review.getReviewId());
        reviewDTO.setDate(String.valueOf(review.getDate()));
        reviewDTO.setRating(review.getRating());
        reviewDTO.setDescription(review.getDescription());
        reviewDTO.setBookId(review.getBook().getBookId());
        reviewDTO.setUserId(review.getUser().getUserId());
        return reviewDTO;
    }
}
