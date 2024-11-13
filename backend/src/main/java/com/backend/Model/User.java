package com.backend.Model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "Users")
@Data
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "user_id")
	private Long userId;

	private String email;

	private String password;

	private Boolean is_admin;

	private String username;

	@Override
	public String toString() {
		return "User{" + "user_id=" + userId + ", email='" + email + '\'' + ", is_admin=" + is_admin + ", username='"
				+ username + '\'' + '}';
	}

}
