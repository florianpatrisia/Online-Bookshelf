package com.backend.Service;

import com.backend.Repository.UserRepository;
import com.backend.Utils.AESCipher;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import javax.crypto.spec.IvParameterSpec;

@Service
public class UserService {

	private UserRepository userRepository;

	private final SecretKey secretKey;

	private final IvParameterSpec iv;

	public UserService() throws Exception {
		this.secretKey = AESCipher.generateSecretKey();
		this.iv = AESCipher.generateIv();
	}

}
