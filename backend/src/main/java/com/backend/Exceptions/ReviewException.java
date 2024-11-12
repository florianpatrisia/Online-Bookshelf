package com.backend.Exceptions;

import lombok.Getter;
import org.springframework.http.HttpStatusCode;

@Getter
public class ReviewException extends RuntimeException {

    private final String errorMessage;
    private final int errorCode;

    public ReviewException(HttpStatusCode errorCode, String errorMessage) {
        super(errorMessage);
        this.errorMessage = errorMessage;
        this.errorCode = errorCode.value();
    }

    @Override
    public String toString() {
        return "ReviewException{" +
                "errorMessage='" + errorMessage + '\'' +
                ", errorCode=" + errorCode +
                '}';
    }
}
