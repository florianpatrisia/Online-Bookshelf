package com.backend.Model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "Books")
@Data
public class Book {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long book_id;

	private String title;

	private String author;

	private String description;

	private Double price;

	private String image;

	private Double rating;

	private Integer available_count;

	private String category;

	@Override
	public String toString() {
		return "Book{" + "title='" + title + '\'' + ", author='" + author + '\'' + ", description='" + description
				+ '\'' + ", price=" + price + ", image='" + image + '\'' + ", rating=" + rating
				+ ", available_count=" + available_count + ", category='" + category + '\'' + '}';
	}

}
