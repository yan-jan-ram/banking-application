package com.project.banking.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.project.banking.dto.AccountDTO;
import com.project.banking.dto.TransactionDTO;
import com.project.banking.dto.TransferAmountDTO;
import com.project.banking.exception.AccountException;
import com.project.banking.service.AccountService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;

@RestController
@RequestMapping(value = "/api/accounts")
@Validated
@CrossOrigin(origins = "http://localhost:3000", 
methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.PATCH}, 
allowedHeaders = "*")
public class AccountController {

    @Autowired
    Environment environment;
    
    private AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }
    
    // Create a new account
    // http://localhost:8081/api/accounts/create
    @PostMapping(value = "/create", consumes = "application/json", produces = "application/json")
    public ResponseEntity<AccountDTO> createAccount(
            @RequestBody @Valid AccountDTO accountDTO) throws AccountException {
        AccountDTO accountDto = accountService.createAccount(accountDTO);
        
        return new ResponseEntity<>(accountDto, HttpStatus.CREATED);
    }
    
    // Create multiple accounts
    // http://localhost:8081/api/accounts/bulk
    @PostMapping(value = "/bulk", consumes = "application/json", produces = "application/json")
    public ResponseEntity<List<AccountDTO>> createAccounts(
            @RequestBody @Valid List<AccountDTO> accountDTOs) throws AccountException {
        List<AccountDTO> result = accountService.createAccounts(accountDTOs);
        
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }
    
    // Get account by id
    // http://localhost:8081/api/accounts/get/{id}
    @GetMapping(value = "/get/{id}")
    public ResponseEntity<AccountDTO> getAccountById(
            @PathVariable("id") @Min(value = 1, message = "{banking.account_id.invalid}") 
            Long accountId) throws AccountException {
        AccountDTO accountDto = accountService.getAccountById(accountId);
        
        return new ResponseEntity<>(accountDto, HttpStatus.OK);
    }
    
    // Get all accounts
    // http://localhost:8081/api/accounts/getAll
    @GetMapping(value = "/getAll")
    public ResponseEntity<List<AccountDTO>> getAllAccounts() throws AccountException {
        List<AccountDTO> dtos = accountService.getAllAccounts();
        
        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }
    
    // Update account
    // http://localhost:8081/api/accounts/update/{id}
    @PutMapping(value = "/update/{id}")
    public ResponseEntity<AccountDTO> updateAccount(
            @PathVariable("id") @Min(value = 1, message = "{banking.account_id.invalid}") 
            Long accountId, @RequestBody @Valid AccountDTO accountDto) throws AccountException {
        AccountDTO accountDTO = accountService.updateAccount(accountId, accountDto);
        
        return new ResponseEntity<>(accountDTO, HttpStatus.OK);
    }
    
    // Delete account
    // http://localhost:8081/api/accounts/delete/{id}
    @DeleteMapping(value = "delete/{id}")
    public ResponseEntity<String> deleteAccount(
            @PathVariable("id") @Min(value = 1, message = "{banking.account_id.invalid}") 
            Long accountId) throws AccountException {
        accountService.deleteAccount(accountId);
        String message = environment.getProperty("API.DELETE_SUCCESS");
        
        return new ResponseEntity<>(message, HttpStatus.OK);
    }
    
    // Deposit amount
    // http://localhost:8081/api/accounts/deposit/{id}
    @PutMapping(value = "/deposit/{id}")
    public ResponseEntity<AccountDTO> depositAmount(
            @PathVariable("id") @Min(value = 1, message = "{banking.account_id.invalid}") 
            Long accountId, @RequestBody @Valid Map<String, Double> request) throws AccountException {
        Double amount = request.get("amount");
        AccountDTO accountDto = accountService.depositAmount(accountId, amount);
        
        return new ResponseEntity<>(accountDto, HttpStatus.OK);
    }
    
    // Withdraw amount
    // http://localhost:8081/api/accounts/withdraw/{id}
    @PutMapping(value = "/withdraw/{id}")
    public ResponseEntity<AccountDTO> withdrawAmount(
            @PathVariable("id") @Min(value = 1, message = "{banking.account_id.invalid}") 
            Long accountId, @RequestBody @Valid Map<String, Double> request) throws AccountException {
        Double amount = request.get("amount");
        AccountDTO accountDto = accountService.withdrawAmount(accountId, amount);
        
        return new ResponseEntity<>(accountDto, HttpStatus.OK);
    }
    
    // Transfer amount
    // http://localhost:8081/api/accounts/transfer
    @PostMapping(value = "/transfer")
    public ResponseEntity<List<AccountDTO>> transferAmount(
            @RequestBody @Valid TransferAmountDTO transferAmountDTO) throws AccountException {
        List<AccountDTO> updatedAccounts = accountService.transferAmount(transferAmountDTO);
        // String message = environment.getProperty("API.TRANSFER_SUCCESS");

        return new ResponseEntity<>(updatedAccounts, HttpStatus.OK);
    }
    
    // Get transaction history
    // http://localhost:8081/api/accounts/transactions/{id}
    @GetMapping(value = "/transactions/{id}")
    public ResponseEntity<List<TransactionDTO>> getTransactionHistory(
            @PathVariable("id") @Min(value = 1, message = "{banking.account_id.invalid}") 
            Long accountId) throws AccountException {
        List<TransactionDTO> transactionList = accountService.getTransactionHistory(accountId);
        return new ResponseEntity<>(transactionList, HttpStatus.OK);
    }
    
    // Get all transactions history
    // http://localhost:8081/api/accounts/transaction_history
    @GetMapping(value = "/transaction_history")
    public ResponseEntity<List<TransactionDTO>> getAllTransactions() throws AccountException {
		List<TransactionDTO> transactionList = accountService.getAllTransactions();
		
		return new ResponseEntity<>(transactionList, HttpStatus.OK);
	}
    
}
