package com.project.banking.service;

import java.util.List;

import com.project.banking.dto.AccountDTO;
import com.project.banking.dto.TransactionDTO;
import com.project.banking.dto.TransferAmountDTO;
import com.project.banking.exception.AccountException;

public interface AccountService {

	public AccountDTO createAccount(AccountDTO accountDto) throws AccountException;
	public List<AccountDTO> createAccounts(List<AccountDTO> accountDTOs) throws AccountException;
	public AccountDTO getAccountById(Long accountId) throws AccountException;
	public List<AccountDTO> getAllAccounts() throws AccountException;
	public AccountDTO updateAccount(Long accountId, AccountDTO accountDto) throws AccountException;
	public void deleteAccount(Long accountId) throws AccountException;
	public AccountDTO depositAmount(Long accountId, Double amount) throws AccountException;
	public AccountDTO withdrawAmount(Long accountId, Double amount) throws AccountException;
	public List<AccountDTO> transferAmount(TransferAmountDTO transferAmountDTO) throws AccountException;
	public List<TransactionDTO> getTransactionHistory(Long accountId) throws AccountException;
	public List<TransactionDTO> getAllTransactions() throws AccountException;
}
