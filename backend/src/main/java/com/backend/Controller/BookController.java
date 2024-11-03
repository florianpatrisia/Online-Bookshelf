package com.backend.Controller;

import com.backend.Model.Book;
import com.backend.Service.BookService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;
import java.util.List;
import java.util.Optional;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api/books")
public class BookController {

	private static final Logger logger = LoggerFactory.getLogger(BookController.class);

	private final BookService bookService;

	@Autowired
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
	public ResponseEntity<Book> createBook(@RequestBody Book book) {
		if (book.getImage() != null) {
			try {
				book.setImage(Base64.getDecoder().decode(new String(book.getImage())));
			} catch (IllegalArgumentException e) {
				logger.error("Invalid Base64 input for image", e);
				return ResponseEntity.badRequest().body(null);
			}
		}
		Book savedBook = bookService.saveBook(book);
		System.out.println(savedBook);
		return ResponseEntity.ok(savedBook);
	}

	@PutMapping("/{id}")
	public ResponseEntity<Book> updateBook(@PathVariable Long id, @RequestBody Book bookDetails) {
		Optional<Book> book = bookService.getBookById(id);
		if (book.isPresent()) {
			Book updatedBook = book.get();
			updatedBook.setTitle(bookDetails.getTitle());
			updatedBook.setAuthor(bookDetails.getAuthor());
			updatedBook.setDescription(bookDetails.getDescription());
			updatedBook.setPrice(bookDetails.getPrice());
			updatedBook.setImage(bookDetails.getImage());
			updatedBook.setRating(bookDetails.getRating());
			updatedBook.setAvailable_count(bookDetails.getAvailable_count());
			updatedBook.setCategory(bookDetails.getCategory());
			return ResponseEntity.ok(bookService.saveBook(updatedBook));
		} else {
			return ResponseEntity.notFound().build();
		}
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
		bookService.deleteBook(id);
		return ResponseEntity.noContent().build();
	}

	@PatchMapping("/{id}")
	public ResponseEntity<Book> partiallyUpdateBook(@PathVariable Long id, @RequestBody Book bookDetails) {
		Optional<Book> book = bookService.getBookById(id);
		if (book.isPresent()) {
			Book existingBook = book.get();
			if (bookDetails.getTitle() != null) {
				existingBook.setTitle(bookDetails.getTitle());
			}
			if (bookDetails.getAuthor() != null) {
				existingBook.setAuthor(bookDetails.getAuthor());
			}
			if (bookDetails.getDescription() != null) {
				existingBook.setDescription(bookDetails.getDescription());
			}
			if (bookDetails.getPrice() != null) {
				existingBook.setPrice(bookDetails.getPrice());
			}
			if (bookDetails.getImage() != null) {
				existingBook.setImage(bookDetails.getImage());
			}
			if (bookDetails.getRating() != null) {
				existingBook.setRating(bookDetails.getRating());
			}
			if (bookDetails.getAvailable_count() != null) {
				existingBook.setAvailable_count(bookDetails.getAvailable_count());
			}
			if (bookDetails.getCategory() != null) {
				existingBook.setCategory(bookDetails.getCategory());
			}
			return ResponseEntity.ok(bookService.saveBook(existingBook));
		} else {
			return ResponseEntity.notFound().build();
		}
	}
}