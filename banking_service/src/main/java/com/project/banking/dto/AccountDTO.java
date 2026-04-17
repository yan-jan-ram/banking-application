package com.project.banking.dto;

import com.project.banking.entity.AccountEntity;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class AccountDTO {

	private Long accountId;
	
	@NotNull(message = "{banking.holder_name.absent}")
	@Pattern(regexp = "([A-Z][a-z]+)+([ ]+[A-Z][a-z]*)*", message = "{banking.holder_name.invalid}")
	private String holderName;
	
	@NotNull(message = "{banking.balance.absent}")
	private Double balance;
	
	public static AccountEntity prepareAccountEntity(AccountDTO accountDto) {
		AccountEntity accountEntity = new AccountEntity();
		
		accountEntity.setHolderName(accountDto.getHolderName());
		accountEntity.setBalance(accountDto.getBalance());
		
		return accountEntity;
	}
	
	public static AccountDTO prepareAccountDTO(AccountEntity accountEntity) {
		AccountDTO accountDto = new AccountDTO();
		
		accountDto.setAccountId(accountEntity.getAccountId());
		accountDto.setHolderName(accountEntity.getHolderName());
		accountDto.setBalance(accountEntity.getBalance());
		
		return accountDto;
	}
}
