import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import style from "./accountsDetails.module.css";

const AccountsDetails = ({ accounts, setAccounts }) => {
  const [searchAccountId, setSearchAccountId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccounts = () => {
      fetch("http://localhost:8081/api/accounts/getAll", { method: "GET" })
        .then((response) => {
          if (!response.ok) {
            if (response.status === 400) {
              throw new Error("Bad request (400)");
            } else if (response.status === 404) {
              throw new Error("Accounts not found (404)");
            } else if (response.status === 500) {
              throw new Error("Server error (500)");
            } else {
              throw new Error(`Unexpected error (${response.status})`);
            }
          }
          return response.json();
        })
        .then((data) => setAccounts(data))
        .catch((error) => {
          const errorCode = error.message.match(/\((\d+)\)/)?.[1] || 500;
          navigate(
            `/error?code=${errorCode}&message=${encodeURIComponent(
              error.message
            )}`
          );
        });
    };

    fetchAccounts();
  }, [navigate, setAccounts]);

  const getAccountById = (e) => {
    e.preventDefault();
    if (searchAccountId) {
      fetch(`http://localhost:8081/api/accounts/get/${searchAccountId}`, {
        method: "GET",
      })
        .then((response) => {
          if (!response.ok) {
            if (response.status === 400) {
              throw new Error("Bad request (400)");
            } else if (response.status === 404) {
              throw new Error("Account not found (404)");
            } else if (response.status === 500) {
              throw new Error("Server error (500)");
            } else {
              throw new Error(`Unexpected error (${response.status})`);
            }
          }
          return response.json();
        })
        .then((data) => {
          if (data.accountId) {
            setAccounts([data]);
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
    } else {
      window.alert("Enter account Id to proceed");
    }
    setSearchAccountId("");
  };

  const handleSearchReset = () => {
    const fetchAccounts = () => {
      fetch("http://localhost:8081/api/accounts/getAll", { method: "GET" })
        .then((response) => {
          if (!response.ok) {
            if (response.status === 400) {
              throw new Error("Bad request (400)");
            } else if (response.status === 404) {
              throw new Error("Accounts not found (404)");
            } else if (response.status === 500) {
              throw new Error("Server error (500)");
            } else {
              throw new Error(`Unexpected error (${response.status})`);
            }
          }
          return response.json();
        })
        .then((data) => setAccounts(data))
        .catch((error) => {
          const errorCode = error.message.match(/\((\d+)\)/)?.[1] || 500;
          navigate(
            `/error?code=${errorCode}&message=${encodeURIComponent(
              error.message
            )}`
          );
        });
    };

    fetchAccounts();
    setSearchAccountId("");
  };

  const handleUpdate = (accountId) => {
    const newHolderName = window.prompt("Edit holder name: ");
    const newBalance = window.prompt("Edit available balance: ");

    if (newHolderName && newBalance) {
      const updatedAccount = {
        accountId,
        holderName: newHolderName,
        balance: parseFloat(newBalance),
      };

      fetch(`http://localhost:8081/api/accounts/update/${accountId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedAccount),
      })
        .then((response) => {
          if (response.ok) {
            setAccounts(
              accounts.map((account) =>
                account.accountId === accountId ? updatedAccount : account
              )
            );
            window.alert("Account updated successfully!");
          } else {
            if (response.status === 400) {
              throw new Error("Bad request (400)");
            } else if (response.status === 500) {
              throw new Error("Server error (500)");
            } else {
              throw new Error(`Unexpected error (${response.status})`);
            }
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
    }
  };

  const handleDelete = (accountId) => {
    if (window.confirm("Are you sure you want to delete this account?")) {
      fetch(`http://localhost:8081/api/accounts/delete/${accountId}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            setAccounts((prevAccounts) =>
              prevAccounts.filter((account) => account.accountId !== accountId)
            );
            window.alert("Account deleted successfully!");
          } else {
            if (response.status === 400) {
              throw new Error("Bad request (400)");
            } else if (response.status === 500) {
              throw new Error("Server error (500)");
            } else {
              throw new Error(`Unexpected error (${response.status})`);
            }
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
    }
  };

  const handleDeposit = (accountId) => {
    const amount = window.prompt("Enter amount to deposit: ");

    if (amount) {
      fetch(`http://localhost:8081/api/accounts/deposit/${accountId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: parseFloat(amount) }),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            if (response.status === 400) {
              throw new Error("Bad request (400)");
            } else if (response.status === 500) {
              throw new Error("Server error (500)");
            } else {
              throw new Error(`Unexpected error (${response.status})`);
            }
          }
        })
        .then((updatedAccount) => {
          setAccounts(
            accounts.map((account) =>
              account.accountId === accountId ? updatedAccount : account
            )
          );
          window.alert("Deposit successful!");
        })
        .catch((error) => {
          const errorCode = error.message.match(/\((\d+)\)/)?.[1] || 500;
          navigate(
            `/error?code=${errorCode}&message=${encodeURIComponent(
              error.message
            )}`
          );
        });
    }
  };

  const handleWithdraw = (accountId) => {
    const amount = window.prompt("Enter amount to withdraw: ");

    if (amount) {
      fetch(`http://localhost:8081/api/accounts/withdraw/${accountId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: parseFloat(amount) }),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            if (response.status === 400) {
              throw new Error("Bad request (400)");
            } else if (response.status === 500) {
              throw new Error("Server error (500)");
            } else {
              throw new Error(`Unexpected error (${response.status})`);
            }
          }
        })
        .then((updatedAccount) => {
          setAccounts(
            accounts.map((account) =>
              account.accountId === accountId ? updatedAccount : account
            )
          );
          window.alert("Withdraw success!");
        })
        .catch((error) => {
          const errorCode = error.message.match(/\((\d+)\)/)?.[1] || 500;
          navigate(
            `/error?code=${errorCode}&message=${encodeURIComponent(
              error.message
            )}`
          );
        });
    }
  };

  return (
    <section className={style.section}>
      <h3 className={style.sideHeading}>Accounts Section</h3>
      <div className={style.search}>
        <form method="get" onSubmit={getAccountById}>
          <input
            type="number"
            value={searchAccountId}
            onChange={(e) => setSearchAccountId(e.target.value)}
            placeholder="Enter account Id"
            className={style.searchInput}
            min={1}
          />
          <div className={style.fetchButton}>
            <button type="submit">Search</button>
            <button type="button" onClick={handleSearchReset}>
              Reset
            </button>
          </div>
        </form>
      </div>
      <table className={style.accountsTable}>
        <thead>
          <tr>
            <th>Account Id</th>
            <th>Holder name</th>
            <th>Balance</th>
            <th>Update account</th>
            <th>Delete account</th>
            <th>Deposit</th>
            <th>Withdraw</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => (
            <tr key={account.accountId}>
              <td>{account.accountId}</td>
              <td>{account.holderName}</td>
              <td>{account.balance}</td>
              <td>
                <button
                  className={style.update}
                  onClick={() => handleUpdate(account.accountId)}
                >
                  Update
                </button>
              </td>
              <td>
                <button
                  className={style.delete}
                  onClick={() => handleDelete(account.accountId)}
                >
                  Delete
                </button>
              </td>
              <td>
                <button
                  className={style.deposit}
                  onClick={() => handleDeposit(account.accountId)}
                >
                  Deposit
                </button>
              </td>
              <td>
                <button
                  className={style.withdraw}
                  onClick={() => handleWithdraw(account.accountId)}
                >
                  Withdraw
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default AccountsDetails;
