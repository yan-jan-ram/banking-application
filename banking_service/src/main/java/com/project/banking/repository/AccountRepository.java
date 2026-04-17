package com.project.banking.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.banking.entity.AccountEntity;

public interface AccountRepository extends JpaRepository<AccountEntity, Long>{

}
