import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "./transferAmount.module.css";

const TransferAmount = ({ accounts, setAccounts }) => {
  const [fromAccountId, setFromAccountId] = useState(1);
  const [toAccountId, setToAccountId] = useState(1);
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleTransfer = (e) => {
    e.preventDefault();

    if (!fromAccountId || !toAccountId || !amount || amount <= 0) {
      return navigate(
        `/error?code=400&message=${encodeURIComponent(
          "All fields are required and amount must be positive."
        )}`
      );
    }

    if (parseInt(fromAccountId) === parseInt(toAccountId)) {
      return navigate(
        `/error?code=400&message=${encodeURIComponent(
          "Cannot transfer to the same account."
        )}`
      );
    }

    const fromAccount = accounts.find(
      (acc) => acc.accountId === parseInt(fromAccountId)
    );
    const toAccount = accounts.find(
      (acc) => acc.accountId === parseInt(toAccountId)
    );

    if (!fromAccount) {
      return navigate(
        `/error?code=404&message=${encodeURIComponent(
          `From account with ID ${fromAccountId} does not exist.`
        )}`
      );
    }

    if (!toAccount) {
      return navigate(
        `/error?code=404&message=${encodeURIComponent(
          `To account with ID ${toAccountId} does not exist.`
        )}`
      );
    }

    if (amount > fromAccount.balance) {
      return navigate(
        `/error?code=400&message=${encodeURIComponent(
          `Insufficient funds in account ID ${fromAccountId}.`
        )}`
      );
    }

    setIsSubmitting(true);

    fetch("http://localhost:8081/api/accounts/transfer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fromAccountId: parseInt(fromAccountId),
        toAccountId: parseInt(toAccountId),
        transferAmount: parseFloat(amount), // ✅ FIX 1: renamed from "amount" to "transferAmount" to match backend DTO
      }),
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 400) {
            throw new Error("Bad request (400): Invalid input.");
          } else if (response.status === 404) {
            throw new Error("Not found (404): Account(s) not found.");
          } else if (response.status === 500) {
            throw new Error("Server error (500): Internal server error.");
          } else {
            throw new Error(`Unexpected error: ${response.status}`);
          }
        }
        return response.json();
      })
      .then((updatedAccounts) => {
        // ✅ FIX 2: backend returns List<AccountDTO> (a plain array), not an object with fromAccount/toAccount
        setAccounts(
          accounts.map((account) => {
            const updated = updatedAccounts.find(
              (u) => u.accountId === account.accountId
            );
            return updated ? updated : account;
          })
        );
        window.alert("Transfer successful!");
        handleReset();
      })
      .catch((error) => {
        console.error(error);
        navigate(
          `/error?code=${
            error.message.includes("500") ? 500 : 400
          }&message=${encodeURIComponent(error.message)}`
        );
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleReset = () => {
    setFromAccountId(1);
    setToAccountId(1);
    setAmount("");
  };

  return (
    <>
      <h3 className={style.sideHeading}>Transfer Amount</h3>
      <section className={style.transferSection}>
        <form className={style.transferForm} onSubmit={handleTransfer}>
          <div className={style.formGroup}>
            <label htmlFor="fromAccountId">From Account: </label>
            <input
              type="number"
              id="fromAccountId"
              min={1}
              value={fromAccountId}
              onChange={(e) => setFromAccountId(e.target.value)}
              placeholder="Enter From account Id"
              className={style.inputField}
              disabled={isSubmitting}
            />
          </div>
          <div className={style.formGroup}>
            <label htmlFor="toAccountId">To Account: </label>
            <input
              type="number"
              id="toAccountId"
              min={1}
              value={toAccountId}
              onChange={(e) => setToAccountId(e.target.value)}
              placeholder="Enter To account Id"
              className={style.inputField}
              disabled={isSubmitting}
            />
          </div>
          <div className={style.formGroup}>
            <label htmlFor="amount">Amount: </label>
            <input
              type="number"
              id="amount"
              min={0}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount to transfer"
              className={style.inputField}
              disabled={isSubmitting}
            />
          </div>
          <div className={style.buttonGroup}>
            <button
              type="submit"
              className={`${style.btn} ${style.btnTransfer}`}
              disabled={isSubmitting}
            >
              Transfer
            </button>
            <button
              type="button"
              onClick={handleReset}
              className={`${style.btn} ${style.btnCancel}`}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
    </>
  );
};

export default TransferAmount;