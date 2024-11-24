package com.backend.Controller;

import com.backend.Model.Book;
import com.backend.DTO.BookDTO;
import com.backend.Service.BookService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api")
public class BookController {

	private static final Logger logger = LoggerFactory.getLogger(BookController.class);

	private final BookService bookService;

	public BookController(BookService bookService) {
		this.bookService = bookService;
	}

	@GetMapping("/user/books")
	public ResponseEntity<List<Book>> getAllBooks() {
		logger.info("Getting all books");
		List<Book> books = bookService.getAllBooks();
		return ResponseEntity.ok(books);
	}

	@GetMapping("/user/{id}")
	public ResponseEntity<Book> getBookById(@PathVariable Long id) {
		Optional<Book> book = bookService.getBookById(id);
		return book.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
	}

	@PostMapping("/admin/books")
	public ResponseEntity<String> createBook(@ModelAttribute BookDTO bookDTO) {
		if (bookDTO.getTitle().isEmpty() || bookDTO.getAuthor().isEmpty() || bookDTO.getDescription().isEmpty()
				|| bookDTO.getPrice() == null || bookDTO.getImage().isEmpty() || bookDTO.getRating() == null
				|| bookDTO.getAvailableCount() == null || bookDTO.getCategory().isEmpty()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Some fields are empty!");
		}

		Book savedBook = new Book();
		savedBook.setTitle(bookDTO.getTitle());
		savedBook.setAuthor(bookDTO.getAuthor());
		savedBook.setDescription(bookDTO.getDescription());
		savedBook.setPrice(bookDTO.getPrice());
		savedBook.setImage(bookService.saveFileToAWSS3Bucket(bookDTO.getImage()));
		savedBook.setRating(bookDTO.getRating());
		savedBook.setAvailableCount(bookDTO.getAvailableCount());
		savedBook.setCategory(bookDTO.getCategory());

		bookService.saveBook(savedBook);
		return ResponseEntity.ok("Book saved successfully");
	}

	@PutMapping("/admin/books/{id}")
	public ResponseEntity<String> updateBook(@PathVariable Long id, @ModelAttribute BookDTO bookDTO) {
		Optional<Book> existingBook = bookService.getBookById(id);

		if (existingBook.isPresent()) {
			if (bookDTO.getTitle().isEmpty() || bookDTO.getAuthor().isEmpty() || bookDTO.getDescription().isEmpty()
					|| bookDTO.getPrice() == null || bookDTO.getImage().isEmpty() || bookDTO.getRating() == null
					|| bookDTO.getAvailableCount() == null || bookDTO.getCategory().isEmpty()) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Some fields are empty!");
			}

			Book updatedBook = existingBook.get();
			updatedBook.setTitle(bookDTO.getTitle());
			updatedBook.setAuthor(bookDTO.getAuthor());
			updatedBook.setDescription(bookDTO.getDescription());
			updatedBook.setPrice(bookDTO.getPrice());
			updatedBook.setImage(bookService.saveFileToAWSS3Bucket(bookDTO.getImage()));
			updatedBook.setRating(bookDTO.getRating());
			updatedBook.setAvailableCount(bookDTO.getAvailableCount());
			updatedBook.setCategory(bookDTO.getCategory());

			bookService.saveBook(updatedBook);
			return ResponseEntity.ok("Book updated successfully");
		}
		else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Book not found");
		}
	}

	@DeleteMapping("/admin/books/{id}")
	public ResponseEntity<String> deleteBook(@PathVariable Long id) {
		Optional<Book> book = bookService.getBookById(id);
		if (book.isPresent()) {
			bookService.deleteBook(id);
			return ResponseEntity.ok("Book deleted successfully");
		}
		else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Book not found");
		}
	}

	@PatchMapping("/admin/books/{id}")
	public ResponseEntity<String> partiallyUpdateBook(@PathVariable Long id, @ModelAttribute BookDTO bookDTO) {
		Optional<Book> existingBook = bookService.getBookById(id);

		if (existingBook.isPresent()) {
			Book bookToUpdate = existingBook.get();

			if (bookDTO.getTitle() != null)
				bookToUpdate.setTitle(bookDTO.getTitle());
			if (bookDTO.getAuthor() != null)
				bookToUpdate.setAuthor(bookDTO.getAuthor());
			if (bookDTO.getDescription() != null)
				bookToUpdate.setDescription(bookDTO.getDescription());
			if (bookDTO.getPrice() != null)
				bookToUpdate.setPrice(bookDTO.getPrice());
			if (bookDTO.getRating() != null)
				bookToUpdate.setRating(bookDTO.getRating());
			if (bookDTO.getAvailableCount() != null)
				bookToUpdate.setAvailableCount(bookDTO.getAvailableCount());
			if (bookDTO.getCategory() != null)
				bookToUpdate.setCategory(bookDTO.getCategory());

			if (bookDTO.getImage() != null && !bookDTO.getImage().isEmpty()) {
				String imageUrl = bookService.saveFileToAWSS3Bucket(bookDTO.getImage());
				bookToUpdate.setImage(imageUrl);
			}

			bookService.saveBook(bookToUpdate);
			return ResponseEntity.ok("Book partially updated successfully");
		}
		else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Book not found");
		}
	}

}