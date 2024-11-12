package com.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReviewDTO {
    private Long reviewId;
    private Long bookId;
    private Long userId;
    private String date;
    private Integer rating;
    private String description;

}
