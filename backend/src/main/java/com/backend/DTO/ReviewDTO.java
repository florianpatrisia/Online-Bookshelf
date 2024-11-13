package com.backend.DTO;

import lombok.Data;

@Data
public class ReviewDTO {

	private Long reviewId;

	private Long bookId;

	private Long userId;

	private String date;

	private Integer rating;

	private String description;

}
