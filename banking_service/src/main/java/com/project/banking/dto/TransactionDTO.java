package com.project.banking.dto;

import java.time.LocalDateTime;

import com.project.banking.entity.TransactionEntity;

import lombok.Data;

@Data
public class TransactionDTO {

	private Long transactionId;
	private Long accountId;
	private Double amount;
	private String transactionType;
	private LocalDateTime timestamp;
	
	public static TransactionDTO prepareTransactionDTO(TransactionEntity transactionEntity) {
		TransactionDTO transactionDTO = new TransactionDTO();
		
		transactionDTO.setTransactionId(transactionEntity.getTransactionId());
		transactionDTO.setAccountId(transactionEntity.getAccountId());
		transactionDTO.setAmount(transactionEntity.getAmount());
		transactionDTO.setTransactionType(transactionEntity.getTransactionType());
		transactionDTO.setTimestamp(transactionEntity.getTimestamp());
		
		return transactionDTO;
	}
}
