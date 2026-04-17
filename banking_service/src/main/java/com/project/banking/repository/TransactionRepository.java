package com.project.banking.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.banking.entity.TransactionEntity;

public interface TransactionRepository extends JpaRepository<TransactionEntity, Long>{

	public List<TransactionEntity> findByAccountIdOrderByTimestampDesc(Long accountId);
}
