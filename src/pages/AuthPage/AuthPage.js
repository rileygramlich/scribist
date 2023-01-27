import React, { useState } from "react";
import SignUpForm from "../../components/SignUpForm/SignUpForm";
import LoginForm from "../../components/LoginForm/LoginForm";

import "./AuthPage.css"

export default function AuthPage({ setUser }) {
  const [showLogin, setShowLogin] = useState(true);

  function handleShow() {
    let status = !showLogin;
    setShowLogin(status);
  }

  return (
    <main className="AuthPage">
      <button onClick={handleShow}>{showLogin ? "Don't have an account with us?" : "Already a user?"}</button>
      {showLogin ? (
        <LoginForm setUser={setUser} />
      ) : (
        <SignUpForm setUser={setUser} />
      )}
    </main>
  );
}
