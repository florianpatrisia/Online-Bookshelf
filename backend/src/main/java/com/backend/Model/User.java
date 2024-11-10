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
	private Long user_id;

	private String username;

	private String password;

	private String email;

	private Boolean is_admin;

	@Override
	public String toString() {
		return "User{" + "username='" + username + '\'' + ", password='" + password + '\'' + ", email='" + email + '\''
				+ ", is_admin=" + is_admin + '}';
	}

}
