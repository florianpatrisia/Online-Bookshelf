package com.backend.Controller;

import com.backend.Service.BookLoanService;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/book-loans")
public class BookLoanController {

	private final BookLoanService bookLoanService;

	public BookLoanController(BookLoanService bookLoanService) {
		this.bookLoanService = bookLoanService;
	}

}
