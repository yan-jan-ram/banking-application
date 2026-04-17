package com.project.banking.exception;

public class InvalidDataException extends AccountException{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public InvalidDataException(String message) {
		super(message);
	}
}
