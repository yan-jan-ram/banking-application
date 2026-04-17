import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "./createAccount.module.css";

const CreateAccount = ({ accounts, setAccounts }) => {
  const [holderName, setHolderName] = useState("");
  const [balance, setBalance] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (holderName && balance) {
      setIsSubmitting(true);

      fetch("http://localhost:8081/api/accounts/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          holderName: holderName,
          balance: parseFloat(balance),
        }),
      })
        .then((response) => {
          if (!response.ok) {
            if (response.status === 400) {
              throw new Error("Bad request (400): Invalid input.");
            } else if (response.status === 500) {
              throw new Error("Server error (500): Internal server error.");
            } else {
              throw new Error(`Unexpected error: ${response.status}`);
            }
          }
          return response.json();
        })
        .then((newAccount) => {
          setAccounts([...accounts, newAccount]);
          window.alert("Account created successfully!");
          setHolderName("");
          setBalance("");
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
    } else {
      navigate(
        `/error?code=400&message=${encodeURIComponent(
          "Please provide both holder name and balance"
        )}`
      );
    }
  };

  const handleHolderNameChange = (e) => {
    const value = e.target.value;
    if (/^[a-zA-Z\s]*$/.test(value)) {
      setHolderName(value);
    }
  };

  return (
    <section className={style.create}>
      <h3 className={style.sideHeading}>New Account</h3>
      <div className={style.card}>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Holder Name: </label>
            <input
              type="text"
              placeholder="Enter name"
              value={holderName}
              onChange={handleHolderNameChange}
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label>Balance: </label>
            <input
              type="number"
              placeholder="Enter amount"
              value={balance}
              min={0}
              max={1000000}
              onChange={(e) => setBalance(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <div className={style.buttonGroup}>
            <button type="submit" disabled={isSubmitting}>
              Create
            </button>
            <button
              type="button"
              onClick={() => {
                setHolderName("");
                setBalance("");
              }}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CreateAccount;
