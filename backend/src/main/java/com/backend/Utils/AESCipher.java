package com.backend.Utils;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.IvParameterSpec;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;

public class AESCipher {

	private static final String ALGORITHM = "AES";

	private static final String TRANSFORMATION = "AES/CBC/PKCS5Padding";

	private static final int KEY_SIZE = 256;

	private static final int IV_SIZE = 16;

	public static SecretKey generateSecretKey() throws Exception {
		KeyGenerator keyGen = KeyGenerator.getInstance(ALGORITHM);
		keyGen.init(KEY_SIZE);
		return keyGen.generateKey();
	}

	public static String encrypt(String plainText, SecretKey secretKey, IvParameterSpec iv) throws Exception {
		Cipher cipher = Cipher.getInstance(TRANSFORMATION);
		cipher.init(Cipher.ENCRYPT_MODE, secretKey, iv);
		byte[] encryptedBytes = cipher.doFinal(plainText.getBytes(StandardCharsets.UTF_8));
		return Base64.getEncoder().encodeToString(encryptedBytes);
	}

	public static String decrypt(String cipherText, SecretKey secretKey, IvParameterSpec iv) throws Exception {
		Cipher cipher = Cipher.getInstance(TRANSFORMATION);
		cipher.init(Cipher.DECRYPT_MODE, secretKey, iv);
		byte[] decryptedBytes = cipher.doFinal(Base64.getDecoder().decode(cipherText));
		return new String(decryptedBytes, StandardCharsets.UTF_8);
	}

	public static IvParameterSpec generateIv() {
		byte[] iv = new byte[IV_SIZE];
		new SecureRandom().nextBytes(iv);
		return new IvParameterSpec(iv);
	}

}
