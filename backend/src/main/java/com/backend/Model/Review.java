package com.backend.Model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@Entity
@Table(name = "Reviews")
@Data
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_id")
    private Long reviewId;

    @ManyToOne
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Temporal(TemporalType.DATE)
    private Date date;

    private Integer rating;

    private String description;

    @Override
    public String toString() {
        return "Review{" +
                "id=" + reviewId +
                ", book=" + book.getTitle() +  // afișăm titlul cărții pentru simplitate
                ", user=" + user.getUsername() +  // afișăm username-ul utilizatorului
                ", date=" + date +
                ", rating=" + rating +
                ", description='" + description + '\'' +
                '}';
    }
}
