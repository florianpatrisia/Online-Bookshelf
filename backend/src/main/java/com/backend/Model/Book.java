package com.backend.Model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.Arrays;

@Getter
@Setter
@Entity
@Table(name = "Books")
@Data
public class Book {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "book_id")
	private Long book_id;

	@Column(name = "title")
	private String title;

	@Column(name = "author")
	private String author;

	@Column(name = "description")
	private String description;

	@Column(name = "price")
	private Double price;

	@Column(name = "image")
	private byte[] image;

	@Column(name = "rating")
	private Double rating;

	@Column(name = "available_count")
	private Integer available_count;

	@Column(name = "category")
	private String category;

	@Override
	public String toString() {
		return "Book{" + "title='" + title + '\'' + ", author='" + author + '\'' + ", description='" + description
				+ '\'' + ", price=" + price + ", image='" + Arrays.toString(image) + '\'' + ", rating=" + rating
				+ ", available_count=" + available_count + ", category='" + category + '\'' + '}';
	}

}
