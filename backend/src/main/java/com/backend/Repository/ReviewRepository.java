package com.backend.Repository;

import com.backend.Model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

	List<Review> findByBook_BookId(Long bookId);

	List<Review> findByUser_UserId(Long userId);

	@Modifying
	@Transactional
	@Query("delete from Review r where r.book.bookId = :bookId")
	void deleteAllByBookId(@Param("bookId") Long bookId);

}
