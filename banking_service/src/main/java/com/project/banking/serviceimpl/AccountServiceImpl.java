package com.project.banking.serviceimpl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

import com.project.banking.dto.AccountDTO;
import com.project.banking.dto.TransactionDTO;
import com.project.banking.dto.TransactionType;
import com.project.banking.dto.TransferAmountDTO;
import com.project.banking.entity.AccountEntity;
import com.project.banking.entity.TransactionEntity;
import com.project.banking.exception.AccountException;
import com.project.banking.exception.InsufficientBalanceException;
import com.project.banking.exception.InvalidDataException;
import com.project.banking.repository.AccountRepository;
import com.project.banking.repository.TransactionRepository;
import com.project.banking.service.AccountService;

import jakarta.transaction.Transactional;

@Service(value = "accountService")
@Transactional
public class AccountServiceImpl implements AccountService{

	private final AccountRepository accountRepository;
	
	private final TransactionRepository transactionRepository;
	
	public AccountServiceImpl(AccountRepository accountRepository, 
			TransactionRepository transactionRepository) {
		this.accountRepository = accountRepository;
		this.transactionRepository = transactionRepository;
	}

	@Override
	public AccountDTO createAccount(AccountDTO accountDto) throws AccountException{
		// TODO Auto-generated method stub
		AccountEntity accountEntity = AccountDTO.prepareAccountEntity(accountDto);
		AccountEntity savedEntity = accountRepository.save(accountEntity);
		
		return AccountDTO.prepareAccountDTO(savedEntity);
	}
	
	@Override
	public List<AccountDTO> createAccounts(List<AccountDTO> accountDTOs) throws AccountException {
		// TODO Auto-generated method stub
		List<AccountEntity> accountEntities = accountDTOs
	            .stream()
	            .map((account) -> AccountDTO.prepareAccountEntity(account))
	            .collect(Collectors.toList());
	    
	    List<AccountEntity> savedEntities = accountRepository.saveAll(accountEntities);
	    
	    return savedEntities
	    		.stream()
	            .map(AccountDTO::prepareAccountDTO)
	            .collect(Collectors.toList());
	}

	@Override
	public AccountDTO getAccountById(Long accountId) throws AccountException{
		// TODO Auto-generated method stub
		AccountEntity accountEntity = accountRepository
				.findById(accountId)
				.orElseThrow(() -> new AccountException("service.ACCOUNT_NOT_FOUND"));
		
		return AccountDTO.prepareAccountDTO(accountEntity);
	}
	
	@Override
	public List<AccountDTO> getAllAccounts() throws AccountException {
		// TODO Auto-generated method stub
		List<AccountEntity> accounts = accountRepository.findAll();
		
		if (accounts.isEmpty()) {
			throw new AccountException("service.NO_ACCOUNTS_FOUND");
		}
		List<AccountDTO> accountsList = accounts
				.stream()
				.map((account) -> AccountDTO.prepareAccountDTO(account))
				.collect(Collectors.toList());
		
		return accountsList;
	}
	
	@Override
	public AccountDTO updateAccount(Long accountId, AccountDTO accountDto) throws AccountException {
		// TODO Auto-generated method stub
		AccountEntity accountEntity = accountRepository
				.findById(accountId)
				.orElseThrow(() -> new AccountException("service.ACCOUNT_NOT_FOUND"));
		accountEntity.setHolderName(accountDto.getHolderName());
		accountEntity.setBalance(accountDto.getBalance());
		
		AccountEntity savedEntity = accountRepository.save(accountEntity);
		
		return AccountDTO.prepareAccountDTO(savedEntity);
	}
	
	@Override
	public void deleteAccount(Long accountId) throws AccountException {
		// TODO Auto-generated method stub
		accountRepository
				.findById(accountId)
				.orElseThrow(() -> new AccountException("service.ACCOUNT_NOT_FOUND"));
		accountRepository.deleteById(accountId);
	}

	@Override
	public AccountDTO depositAmount(Long accountId, Double amount) throws AccountException {
		// TODO Auto-generated method stub
		AccountEntity accountEntity = accountRepository
				.findById(accountId)
				.orElseThrow(() -> new AccountException("service.ACCOUNT_NOT_FOUND"));
		
		if (amount <= 0) {
			throw new InvalidDataException("service.INVALID_AMOUNT");
		}
		
		Double availableBalance = accountEntity.getBalance() + amount;
		accountEntity.setBalance(availableBalance);
		AccountEntity savedEntity = accountRepository.save(accountEntity);
		
		TransactionEntity transactionEntity = new TransactionEntity();
		
		transactionEntity.setAccountId(accountId);
		transactionEntity.setAmount(amount);
		transactionEntity.setTransactionType(TransactionType.DEPOSIT.toString());
		transactionEntity.setTimestamp(LocalDateTime.now());
		
		transactionRepository.save(transactionEntity);
		
		return AccountDTO.prepareAccountDTO(savedEntity);
	}

	@Override
	public AccountDTO withdrawAmount(Long accountId, Double amount) throws AccountException {
		// TODO Auto-generated method stub
		AccountEntity accountEntity = accountRepository
				.findById(accountId)
				.orElseThrow(() -> new AccountException("service.ACCOUNT_NOT_FOUND"));
		
		if (accountEntity.getBalance() < amount) {
			throw new InsufficientBalanceException("service.NOT_ENOUGH_BALANCE");
		}
		
		if (amount <= 0) {
			throw new InvalidDataException("service.INVALID_AMOUNT");
		}
		
		Double availableBalance = accountEntity.getBalance() - amount;
		accountEntity.setBalance(availableBalance);
		AccountEntity savedEntity = accountRepository.save(accountEntity);
		
		TransactionEntity transactionEntity = new TransactionEntity();
		
		transactionEntity.setAccountId(accountId);
		transactionEntity.setAmount(amount);
		transactionEntity.setTransactionType(TransactionType.WITHDRAW.toString());
		transactionEntity.setTimestamp(LocalDateTime.now());
		
		transactionRepository.save(transactionEntity);
		
		return AccountDTO.prepareAccountDTO(savedEntity);
	}

	@Override
	public List<AccountDTO> transferAmount(TransferAmountDTO transferAmountDTO) throws AccountException {
	    AccountEntity fromAccount = accountRepository.findById(transferAmountDTO.fromAccountId())
	            .orElseThrow(() -> new AccountException("service.ACCOUNT_NOT_FOUND"));

	    AccountEntity toAccount = accountRepository.findById(transferAmountDTO.toAccountId())
	            .orElseThrow(() -> new AccountException("service.ACCOUNT_NOT_FOUND"));

	    if (transferAmountDTO.fromAccountId().equals(transferAmountDTO.toAccountId())) {
	        throw new InvalidDataException("service.SAME_ACCOUNT");
	    }

	    if (fromAccount.getBalance() < transferAmountDTO.transferAmount()) {
	        throw new InsufficientBalanceException("service.NOT_ENOUGH_BALANCE");
	    }

	    Double debit = fromAccount.getBalance() - transferAmountDTO.transferAmount();
	    fromAccount.setBalance(debit);

	    Double credit = toAccount.getBalance() + transferAmountDTO.transferAmount();
	    toAccount.setBalance(credit);

	    accountRepository.save(fromAccount);
	    accountRepository.save(toAccount);

	    TransactionEntity transactionEntity = new TransactionEntity();
	    transactionEntity.setAccountId(transferAmountDTO.fromAccountId());
	    transactionEntity.setAmount(transferAmountDTO.transferAmount());
	    transactionEntity.setTransactionType(TransactionType.TRANSFER.toString());
	    transactionEntity.setTimestamp(LocalDateTime.now());
	    transactionRepository.save(transactionEntity);

	    List<AccountEntity> updatedAccounts = accountRepository.findAll();

	    List<AccountDTO> updatedAccountDTOs = updatedAccounts.stream()
	            .map(AccountDTO::prepareAccountDTO)
	            .collect(Collectors.toList());

	    return updatedAccountDTOs;
	}


	@Override
	public List<TransactionDTO> getTransactionHistory(Long accountId) throws AccountException {
		// TODO Auto-generated method stub
		List<TransactionEntity> transactions = transactionRepository.findByAccountIdOrderByTimestampDesc(accountId);
		
		if (transactions.isEmpty()) {
			throw new AccountException("service.NO_TRANSACTION_HISTORY");
		}
		
		List<TransactionDTO> transactionList = transactions
				.stream()
				.map((transaction) -> TransactionDTO.prepareTransactionDTO(transaction))
				.collect(Collectors.toList());
		
		return transactionList;
	}

	@Override
	public List<TransactionDTO> getAllTransactions() throws AccountException {
		// TODO Auto-generated method stub
		List<TransactionEntity> transactions = transactionRepository.findAll();
		
		if (transactions.isEmpty()) {
			throw new AccountException("service.NO_TRANSACTION_HISTORY");
		}
		
		List<TransactionDTO> transactionList = transactions
				.stream()
				.map((transaction) -> TransactionDTO.prepareTransactionDTO(transaction))
				.collect(Collectors.toList());
		
		return transactionList;
	}

}
