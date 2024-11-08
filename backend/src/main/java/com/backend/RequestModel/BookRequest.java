package com.backend.RequestModel;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class BookRequest {

	private String title;

	private String author;

	private String description;

	private Double price;

	private MultipartFile image;

	private Double rating;

	private Integer available_count;

	private String category;

}
