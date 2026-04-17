import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import CreateAccount from "./CreateAccount";
import AccountsDetails from "./AccountsDetails";
import TransactionHistory from "./TransactionHistory";
import TransferAmount from "./TransferAmount";
import ErrorPage from "./ErrorPage";
import ToggleTheme from "./ToggleTheme"
import style from "./display.module.css";

const Display = () => {
  const [accounts, setAccounts] = useState([]);

  return (
    <Router>
      <header>
        <h1 className={style.mainHeading}>Banking</h1>
        <ToggleTheme />
        <nav className={style.buttons}>
          <Link to="/create">
            <button className={style.navButton}>Create</button>
          </Link>
          <Link to="/accounts">
            <button className={style.navButton}>Accounts</button>
          </Link>
          <Link to="/transactions">
            <button className={style.navButton}>Transactions</button>
          </Link>
          <Link to="/transfer">
            <button className={style.navButton}>Transfer</button>
          </Link>
        </nav>
      </header>
      <main>
        <Routes>
          <Route
            path="/create"
            element={
              <CreateAccount accounts={accounts} setAccounts={setAccounts} />
            }
          />
          <Route
            path="/accounts"
            element={
              <AccountsDetails accounts={accounts} setAccounts={setAccounts} />
            }
          />
          <Route path="/transactions" element={<TransactionHistory />} />
          <Route
            path="/transfer"
            element={
              <TransferAmount accounts={accounts} setAccounts={setAccounts} />
            }
          />
          <Route
            path="/"
            element={
              <h1 className={style.welcome}>Welcome to the Banking App</h1>
            }
          />
          <Route path="/error" element={<ErrorPage />} />
          <Route
            path="*"
            element={
              <Navigate to="/error?code=404&message=Page%20not%20found" />
            }
          />
        </Routes>
      </main>
    </Router>
  );
};

export default Display;
