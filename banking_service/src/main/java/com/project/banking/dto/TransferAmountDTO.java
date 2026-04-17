package com.project.banking.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record TransferAmountDTO(
		@NotNull(message = "{banking.from_account.absent}") 
		@Positive(message = "{banking.from_account.positive}") 
		Long fromAccountId, 
		
		@NotNull(message = "{banking.to_account.absent}") 
		@Positive(message = "{banking.to_account.positive}") 
		Long toAccountId, 
		
		@NotNull(message = "{banking.amount.absent}")  
		@Positive(message = "{banking.amount.positive}") 
		Double transferAmount) {
//Unlike a class, record doesn't need getter-setter methods
}
