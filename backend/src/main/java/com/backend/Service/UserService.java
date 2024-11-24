package com.backend.Service;

import com.backend.Model.User;
import com.backend.Repository.UserRepository;
import com.backend.Utils.AESCipher;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import javax.crypto.spec.IvParameterSpec;

@Service
public class UserService {

	private final UserRepository userRepository;

	private final PasswordEncoder passwordEncoder;

	private final SecretKey secretKey;

	private final IvParameterSpec iv;

	public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) throws Exception {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.secretKey = AESCipher.generateSecretKey();
		this.iv = AESCipher.generateIv();
	}

	public User saveUser(User user) {
		if (userRepository.findByUsername(user.getUsername()).isPresent()) {
			throw new IllegalArgumentException("Username already exists");
		}
		if (userRepository.findByEmail(user.getEmail()).isPresent()) {
			throw new IllegalArgumentException("Email already exists");
		}

		user.setPassword(passwordEncoder.encode(user.getPassword()));

		return userRepository.save(user);
	}

}
