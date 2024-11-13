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
	@Column(name = "book_id")
	private Long bookId;

	private String title;

	private String author;

	private String description;

	private Double price;

	private String image;

	private Double rating;

	@Column(name = "available_count")
	private Integer availableCount;

	private String category;

	@Override
	public String toString() {
		return "Book{" + "title='" + title + '\'' + ", author='" + author + '\'' + ", description='" + description
				+ '\'' + ", price=" + price + ", image='" + image + '\'' + ", rating=" + rating + ", available_count="
				+ availableCount + ", category='" + category + '\'' + '}';
	}

}
