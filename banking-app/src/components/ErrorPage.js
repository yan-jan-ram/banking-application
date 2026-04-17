import React from "react";
import { useLocation } from "react-router-dom";
import "./errorPage.module.css"

const ErrorPage = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const errorCode = query.get("code") || "500";
  const errorMessage = query.get("message") || "An unexpected error occurred";

  return (
    <div>
      <h1>Oops! ERROR - {errorCode}</h1>
      <h2>{errorMessage}</h2>
    </div>
  );
};

export default ErrorPage;
