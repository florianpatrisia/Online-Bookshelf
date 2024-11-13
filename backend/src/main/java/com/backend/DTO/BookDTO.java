package com.backend.DTO;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class BookDTO {

	private String title;

	private String author;

	private String description;

	private Double price;

	private MultipartFile image;

	private Double rating;

	private Integer available_count;

	private String category;

}
