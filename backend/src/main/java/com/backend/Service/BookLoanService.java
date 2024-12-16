package com.backend.Service;

import com.backend.DTO.CurrentLoansResponse;
import com.backend.Model.Book;
import com.backend.Model.BookLoan;
import com.backend.Model.User;
import com.backend.Repository.BookLoanRepository;
import com.backend.Repository.BookRepository;
import com.backend.Repository.UserRepository;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
public class BookLoanService {

	private final BookRepository bookRepository;

	private final BookLoanRepository bookLoanRepository;

	private final UserRepository userRepository;

	public BookLoanService(BookRepository bookRepository, BookLoanRepository bookLoanRepository,
			UserRepository userRepository) {
		this.bookRepository = bookRepository;
		this.bookLoanRepository = bookLoanRepository;
		this.userRepository = userRepository;
	}

	public Book loanBook(Long userId, Long bookId) throws Exception {
		Optional<Book> book = bookRepository.findById(bookId);

		BookLoan validateLoan = bookLoanRepository.findByUser_UserIdAndBook_BookId(userId, bookId);

		if (book.isEmpty() || validateLoan != null || book.get().getAvailableCount() <= 0) {
			throw new Exception("Book does not exist or is already loaned by the user");
		}

		Optional<User> user = userRepository.findById(userId);
		if (user.isEmpty()) {
			throw new Exception("User does not exist");
		}

		Book existingBook = book.get();
		existingBook.setAvailableCount(existingBook.getAvailableCount() - 1);
		bookRepository.save(existingBook);

		BookLoan bookLoan = new BookLoan(existingBook, user.get(), LocalDate.now().toString(),
				LocalDate.now().plusDays(7).toString());

		bookLoanRepository.save(bookLoan);

		return existingBook;
	}

	public Boolean loanBookByUser(Long userId, Long bookId) {
		BookLoan validateLoan = bookLoanRepository.findByUser_UserIdAndBook_BookId(userId, bookId);
		return validateLoan != null;
	}

	public void returnBook(Long userId, Long bookId) throws Exception {
		Optional<Book> book = bookRepository.findById(bookId);
		BookLoan bookLoan = bookLoanRepository.findByUser_UserIdAndBook_BookId(userId, bookId);

		if (book.isEmpty() && bookLoan == null) {
			throw new Exception("Book does not exist or is not loaned by the user");
		}

		Optional<User> user = userRepository.findById(userId);
		if (user.isEmpty()) {
			throw new Exception("User does not exist");
		}

		Book existingBook = bookLoan.getBook();
		existingBook.setAvailableCount(existingBook.getAvailableCount() + 1);
		bookRepository.save(existingBook);

		bookLoanRepository.delete(bookLoan);
	}

	public void renewLoan(Long userId, Long bookId) throws Exception {
		BookLoan bookLoan = bookLoanRepository.findByUser_UserIdAndBook_BookId(userId, bookId);

		if (bookLoan == null) {
			throw new Exception("Book is not loaned by the user");
		}

		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

		Date d1 = sdf.parse(bookLoan.getReturnDate());
		Date d2 = sdf.parse(LocalDate.now().toString());

		if (d1.compareTo(d2) > 0 || d1.compareTo(d2) == 0) {
			bookLoan.setReturnDate(LocalDate.now().plusDays(7).toString());
			bookLoanRepository.save(bookLoan);
		}
	}

	public List<CurrentLoansResponse> currentLoans(Long userId) throws Exception {
		List<CurrentLoansResponse> currentLoansResponses = new ArrayList<>();
		List<BookLoan> bookLoans = bookLoanRepository.findBookLoansByUser_UserId(userId);
		List<Long> bookIds = new ArrayList<>();

		for (BookLoan bookLoan : bookLoans) {
			bookIds.add(bookLoan.getBook().getBookId());
		}

		List<Book> books = bookRepository.findAllById(bookIds);

		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

		for (Book book : books) {
			Optional<BookLoan> bookLoan = bookLoans.stream()
				.filter(b -> b.getBook().getBookId().equals(book.getBookId()))
				.findFirst();
			if (bookLoan.isPresent()) {
				Date d1 = sdf.parse(bookLoan.get().getReturnDate());
				Date d2 = sdf.parse(LocalDate.now().toString());

				TimeUnit time = TimeUnit.DAYS;

				long differenceInTime = time.convert(d1.getTime() - d2.getTime(), TimeUnit.MILLISECONDS);

				if (d1.compareTo(d2) > 0 || d1.compareTo(d2) == 0) {
					currentLoansResponses.add(new CurrentLoansResponse(book, Math.toIntExact(differenceInTime)));
				}
			}
		}

		return currentLoansResponses;
	}

}
