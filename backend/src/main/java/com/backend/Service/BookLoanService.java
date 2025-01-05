package com.backend.Service;

import com.backend.DTO.CurrentLoansResponse;
import com.backend.Model.Book;
import com.backend.Model.BookLoan;
import com.backend.Model.Payment;
import com.backend.Model.User;
import com.backend.Repository.BookLoanRepository;
import com.backend.Repository.BookRepository;
import com.backend.Repository.PaymentRepository;
import com.backend.Repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class BookLoanService {

	private final BookRepository bookRepository;

	private final BookLoanRepository bookLoanRepository;

	private final UserRepository userRepository;

	private final PaymentRepository paymentRepository;

	private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

	public BookLoanService(BookRepository bookRepository, BookLoanRepository bookLoanRepository,
			UserRepository userRepository, PaymentRepository paymentRepository) {
		this.bookRepository = bookRepository;
		this.bookLoanRepository = bookLoanRepository;
		this.userRepository = userRepository;
		this.paymentRepository = paymentRepository;
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

		// Check current loans to see if any book is already overdue
		List<BookLoan> currentBookLoans = bookLoanRepository.findBookLoansByUser_UserId(userId);
		boolean bookNeedsReturned = false;

		for (BookLoan currentLoan : currentBookLoans) {
			LocalDate dueDate = LocalDate.parse(currentLoan.getReturnDate(), formatter);
			LocalDate now = LocalDate.now();

			// How many days until the book is due?
			// Negative => the book is already overdue
			long daysUntilDue = ChronoUnit.DAYS.between(now, dueDate);
			System.out.println("daysUntilDue: " + daysUntilDue);

			if (daysUntilDue < 0) {
				bookNeedsReturned = true;
				break;
			}
		}

		// Check payment status
		Payment userPayment = paymentRepository.findByUserId(userId);

		// If there's an outstanding fee or an overdue book, throw an exception
		if ((userPayment != null && userPayment.getAmount() > 0) || (userPayment != null && bookNeedsReturned)) {
			throw new Exception("Outstanding fees");
		}

		// If the user does not have a payment record, create one
		if (userPayment == null) {
			Payment payment = new Payment();
			payment.setUserId(userId);
			payment.setAmount(0.00);
			paymentRepository.save(payment);
		}

		// Decrement the available count and save the new loan
		Book existingBook = book.get();
		existingBook.setAvailableCount(existingBook.getAvailableCount() - 1);
		bookRepository.save(existingBook);

		String loanDate = LocalDate.now().format(formatter);
		String returnDate = LocalDate.now().plusDays(7).format(formatter);

		BookLoan bookLoan = new BookLoan(existingBook, user.get(), loanDate, returnDate);
		bookLoanRepository.save(bookLoan);

		return existingBook;
	}

	public void returnBook(Long userId, Long bookId) throws Exception {
		Optional<Book> book = bookRepository.findById(bookId);
		BookLoan bookLoan = bookLoanRepository.findByUser_UserIdAndBook_BookId(userId, bookId);

		if (book.isEmpty() || bookLoan == null) {
			throw new Exception("Book does not exist or is not loaned by the user");
		}

		Book existingBook = bookLoan.getBook();
		existingBook.setAvailableCount(existingBook.getAvailableCount() + 1);
		bookRepository.save(existingBook);

		// Calculate overdue days (how many days user is late)
		LocalDate dueDate = LocalDate.parse(bookLoan.getReturnDate(), formatter);
		LocalDate now = LocalDate.now();
		long overdueDays = ChronoUnit.DAYS.between(dueDate, now);

		// If overdueDays > 0, the user kept the book past the due date
		if (overdueDays > 0) {
			Payment payment = paymentRepository.findByUserId(userId);
			payment.setAmount(payment.getAmount() + overdueDays);
			paymentRepository.save(payment);
		}

		bookLoanRepository.delete(bookLoan);
	}

	public void renewLoan(Long userId, Long bookId) throws Exception {
		BookLoan bookLoan = bookLoanRepository.findByUser_UserIdAndBook_BookId(userId, bookId);
		if (bookLoan == null) {
			throw new Exception("Book is not loaned by the user");
		}

		LocalDate returnDate = LocalDate.parse(bookLoan.getReturnDate(), formatter);
		if (returnDate.isBefore(LocalDate.now())) {
			throw new Exception("Cannot renew loan. The return date has already passed.");
		}

		String newReturnDate = LocalDate.now().plusDays(7).format(formatter);
		bookLoan.setReturnDate(newReturnDate);
		bookLoanRepository.save(bookLoan);
	}

	public List<CurrentLoansResponse> currentLoans(Long userId) {
		List<CurrentLoansResponse> currentLoansResponses = new ArrayList<>();
		List<BookLoan> bookLoans = bookLoanRepository.findBookLoansByUser_UserId(userId);

		List<Long> bookIds = bookLoans.stream().map(bl -> bl.getBook().getBookId()).toList();
		List<Book> books = bookRepository.findAllById(bookIds);

		LocalDate today = LocalDate.now();

		for (Book book : books) {
			Optional<BookLoan> bookLoan = bookLoans.stream()
				.filter(bl -> bl.getBook().getBookId().equals(book.getBookId()))
				.findFirst();

			if (bookLoan.isPresent()) {
				LocalDate returnDate = LocalDate.parse(bookLoan.get().getReturnDate(), formatter);
				long daysUntilDue = ChronoUnit.DAYS.between(today, returnDate);

				// If returnDate is in the future or today, then the book is not overdue
				if (!returnDate.isBefore(today)) {
					currentLoansResponses.add(new CurrentLoansResponse(book, Math.toIntExact(daysUntilDue)));
				}
			}
		}

		return currentLoansResponses;
	}

	public int currentLoansCount(Long userId) {
		return bookLoanRepository.findBookLoansByUser_UserId(userId).size();
	}

	public Boolean loanBookByUser(Long userId, Long bookId) {
		BookLoan validateLoan = bookLoanRepository.findByUser_UserIdAndBook_BookId(userId, bookId);
		return validateLoan != null;
	}

}
