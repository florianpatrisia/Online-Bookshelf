package com.backend.Controller;

import com.backend.Model.Book;
import com.backend.Service.BookService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api/books")
public class BookController {

	private static final Logger logger = LoggerFactory.getLogger(BookController.class);

	private final BookService bookService;

	public BookController(BookService bookService) {
		this.bookService = bookService;
	}

	@GetMapping
	public ResponseEntity<List<Book>> getAllBooks() {
		logger.info("Getting all books");
		List<Book> books = bookService.getAllBooks();
		return ResponseEntity.ok(books);
	}

	@GetMapping("/{id}")
	public ResponseEntity<Book> getBookById(@PathVariable Long id) {
		Optional<Book> book = bookService.getBookById(id);
		return book.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
	}

	@PostMapping
	public ResponseEntity<String> createBook(@RequestParam("title") String title,
											 @RequestParam("author") String author,
											 @RequestParam("description") String description,
											 @RequestParam("price") Double price,
											 @RequestParam("image") MultipartFile image,
											 @RequestParam("rating") Double rating,
											 @RequestParam("available_count") Integer availableCount,
											 @RequestParam("category") String category) {

		if (title.isEmpty() || author.isEmpty() || description.isEmpty() || price == null || image.isEmpty() || rating == null || availableCount == null || category.isEmpty()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Some fields are empty!");
		}
		Book savedBook = new Book();
		savedBook.setTitle(title);
		savedBook.setAuthor(author);
		savedBook.setDescription(description);
		savedBook.setPrice(price);
		savedBook.setImage(bookService.saveFileToAWSS3Bucket(image));
		savedBook.setRating(rating);
		savedBook.setAvailable_count(availableCount);
		savedBook.setCategory(category);
		bookService.saveBook(savedBook);
		System.out.println(savedBook);
		return ResponseEntity.ok("Book saved successfully");
	}

	@PutMapping("/{id}")
	public ResponseEntity<String> updateBook(
			@PathVariable Long id,
			@RequestParam("title") String title,
			@RequestParam("author") String author,
			@RequestParam("description") String description,
			@RequestParam("price") Double price,
			@RequestParam("image") MultipartFile image,
			@RequestParam("rating") Double rating,
			@RequestParam("available_count") Integer availableCount,
			@RequestParam("category") String category) {

		Optional<Book> existingBook = bookService.getBookById(id);
		if (existingBook.isPresent()) {
			if (title.isEmpty() || author.isEmpty() || description.isEmpty() || price == null || image.isEmpty() || rating == null || availableCount == null || category.isEmpty()) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Some fields are empty!");
			}

			String imageUrl = image.isEmpty() ? existingBook.get().getImage() : bookService.saveFileToAWSS3Bucket(image);

			Book updatedBook = existingBook.get();
			updatedBook.setTitle(title);
			updatedBook.setAuthor(author);
			updatedBook.setDescription(description);
			updatedBook.setPrice(price);
			updatedBook.setImage(imageUrl);
			updatedBook.setRating(rating);
			updatedBook.setAvailable_count(availableCount);
			updatedBook.setCategory(category);

			bookService.saveBook(updatedBook);
			return ResponseEntity.ok("Book updated successfully");
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Book not found");
		}
	}


	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteBook(@PathVariable Long id) {
		Optional<Book> book = bookService.getBookById(id);
		if (book.isPresent()) {
			bookService.deleteBook(id);
			return ResponseEntity.ok("Book deleted successfully");
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Book not found");
		}
	}


	@PatchMapping("/{id}")
	public ResponseEntity<String> partiallyUpdateBook(
			@PathVariable Long id,
			@RequestParam(value = "title", required = false) String title,
			@RequestParam(value = "author", required = false) String author,
			@RequestParam(value = "description", required = false) String description,
			@RequestParam(value = "price", required = false) Double price,
			@RequestParam(value = "image", required = false) MultipartFile image,
			@RequestParam(value = "rating", required = false) Double rating,
			@RequestParam(value = "available_count", required = false) Integer availableCount,
			@RequestParam(value = "category", required = false) String category) {

		Optional<Book> existingBook = bookService.getBookById(id);
		if (existingBook.isPresent()) {
			Book bookToUpdate = existingBook.get();

			if (title != null) bookToUpdate.setTitle(title);
			if (author != null) bookToUpdate.setAuthor(author);
			if (description != null) bookToUpdate.setDescription(description);
			if (price != null) bookToUpdate.setPrice(price);
			if (rating != null) bookToUpdate.setRating(rating);
			if (availableCount != null) bookToUpdate.setAvailable_count(availableCount);
			if (category != null) bookToUpdate.setCategory(category);

			if (image != null && !image.isEmpty()) {
				String imageUrl = bookService.saveFileToAWSS3Bucket(image);
				bookToUpdate.setImage(imageUrl);
			}

			bookService.saveBook(bookToUpdate);
			return ResponseEntity.ok("Book partially updated successfully");
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Book not found");
		}
	}
}