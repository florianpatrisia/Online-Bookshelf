package com.backend.Controller;

import com.backend.Model.Book;
import com.backend.RequestModel.BookRequest;
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
	public ResponseEntity<String> createBook(@ModelAttribute BookRequest bookRequest) {
		if (bookRequest.getTitle().isEmpty() || bookRequest.getAuthor().isEmpty()
				|| bookRequest.getDescription().isEmpty() || bookRequest.getPrice() == null
				|| bookRequest.getImage().isEmpty() || bookRequest.getRating() == null
				|| bookRequest.getAvailable_count() == null || bookRequest.getCategory().isEmpty()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Some fields are empty!");
		}

		Book savedBook = new Book();
		savedBook.setTitle(bookRequest.getTitle());
		savedBook.setAuthor(bookRequest.getAuthor());
		savedBook.setDescription(bookRequest.getDescription());
		savedBook.setPrice(bookRequest.getPrice());
		savedBook.setImage(bookService.saveFileToAWSS3Bucket(bookRequest.getImage()));
		savedBook.setRating(bookRequest.getRating());
		savedBook.setAvailable_count(bookRequest.getAvailable_count());
		savedBook.setCategory(bookRequest.getCategory());

		bookService.saveBook(savedBook);
		return ResponseEntity.ok("Book saved successfully");
	}

	@PutMapping("/{id}")
	public ResponseEntity<String> updateBook(@PathVariable Long id, @ModelAttribute BookRequest bookRequest) {
		Optional<Book> existingBook = bookService.getBookById(id);

		if (existingBook.isPresent()) {
			if (bookRequest.getTitle().isEmpty() || bookRequest.getAuthor().isEmpty()
					|| bookRequest.getDescription().isEmpty() || bookRequest.getPrice() == null
					|| bookRequest.getImage().isEmpty() || bookRequest.getRating() == null
					|| bookRequest.getAvailable_count() == null || bookRequest.getCategory().isEmpty()) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Some fields are empty!");
			}

			Book updatedBook = existingBook.get();
			updatedBook.setTitle(bookRequest.getTitle());
			updatedBook.setAuthor(bookRequest.getAuthor());
			updatedBook.setDescription(bookRequest.getDescription());
			updatedBook.setPrice(bookRequest.getPrice());
			updatedBook.setImage(bookService.saveFileToAWSS3Bucket(bookRequest.getImage()));
			updatedBook.setRating(bookRequest.getRating());
			updatedBook.setAvailable_count(bookRequest.getAvailable_count());
			updatedBook.setCategory(bookRequest.getCategory());

			bookService.saveBook(updatedBook);
			return ResponseEntity.ok("Book updated successfully");
		}
		else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Book not found");
		}
	}

	@DeleteMapping("/{id}")
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

	@PatchMapping("/{id}")
	public ResponseEntity<String> partiallyUpdateBook(@PathVariable Long id, @ModelAttribute BookRequest bookRequest) {
		Optional<Book> existingBook = bookService.getBookById(id);

		if (existingBook.isPresent()) {
			Book bookToUpdate = existingBook.get();

			if (bookRequest.getTitle() != null)
				bookToUpdate.setTitle(bookRequest.getTitle());
			if (bookRequest.getAuthor() != null)
				bookToUpdate.setAuthor(bookRequest.getAuthor());
			if (bookRequest.getDescription() != null)
				bookToUpdate.setDescription(bookRequest.getDescription());
			if (bookRequest.getPrice() != null)
				bookToUpdate.setPrice(bookRequest.getPrice());
			if (bookRequest.getRating() != null)
				bookToUpdate.setRating(bookRequest.getRating());
			if (bookRequest.getAvailable_count() != null)
				bookToUpdate.setAvailable_count(bookRequest.getAvailable_count());
			if (bookRequest.getCategory() != null)
				bookToUpdate.setCategory(bookRequest.getCategory());

			if (bookRequest.getImage() != null && !bookRequest.getImage().isEmpty()) {
				String imageUrl = bookService.saveFileToAWSS3Bucket(bookRequest.getImage());
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