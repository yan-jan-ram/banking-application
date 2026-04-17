import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import style from "./transactionHistory.module.css";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [searchAccountId, setSearchAccountId] = useState("");
  const navigate = useNavigate();

  const fetchAllTransactions = useCallback(() => {
    fetch("http://localhost:8081/api/accounts/transaction_history", {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 400) {
            throw new Error("Bad request (400)");
          } else if (response.status === 404) {
            throw new Error("Transactions not found (404)");
          } else if (response.status === 500) {
            throw new Error("Server error (500)");
          } else {
            throw new Error(`Unexpected error (${response.status})`);
          }
        }
        return response.json();
      })
      .then((data) => setTransactions(data))
      .catch((error) => {
        const errorCode = error.message.match(/\((\d+)\)/)?.[1] || 500;
        navigate(
          `/error?code=${errorCode}&message=${encodeURIComponent(
            error.message
          )}`
        );
      });
  }, [navigate]);

  useEffect(() => {
    fetchAllTransactions();
  }, [fetchAllTransactions]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchAccountId) {
      fetch(
        `http://localhost:8081/api/accounts/transactions/${searchAccountId}`,
        {
          method: "GET",
        }
      )
        .then((response) => {
          if (!response.ok) {
            if (response.status === 400) {
              throw new Error("Bad request (400)");
            } else if (response.status === 404) {
              throw new Error("Transactions not found (404)");
            } else if (response.status === 500) {
              throw new Error("Server error (500)");
            } else {
              throw new Error(`Unexpected error (${response.status})`);
            }
          }
          return response.json();
        })
        .then((data) => {
          if (data.length > 0) {
            setTransactions(data);
          } else {
            throw new Error("Transactions not found (404)");
          }
        })
        .catch((error) => {
          const errorCode = error.message.match(/\((\d+)\)/)?.[1] || 500;
          navigate(
            `/error?code=${errorCode}&message=${encodeURIComponent(
              error.message
            )}`
          );
        });
      setSearchAccountId("");
    } else {
      window.alert("Enter account ID to proceed");
    }
  };

  const handleReset = () => {
    setSearchAccountId("");
    fetchAllTransactions();
  };

  return (
    <section className={style.section}>
      <h3 className={style.sideHeading}>Transactions Section</h3>
      <div className={style.search}>
        <form method="get" onSubmit={handleSearch}>
          <input
            type="number"
            value={searchAccountId}
            placeholder="Enter account ID"
            onChange={(e) => setSearchAccountId(e.target.value)}
            min={1}
          />
        </form>
        <button onClick={handleSearch}>Search</button>
        <button type="reset" onClick={handleReset}>
          Reset
        </button>
      </div>
      <table className={style.transactionsTable}>
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Account ID</th>
            <th>Amount</th>
            <th>Transaction Type</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.transactionId}>
              <td>{transaction.transactionId}</td>
              <td>{transaction.accountId}</td>
              <td>{transaction.amount}</td>
              <td className={style.transactionType}>
                {transaction.transactionType}
              </td>
              <td>{transaction.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default TransactionHistory;
