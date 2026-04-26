import React, { useState } from "react";
import SignUpForm from "../../components/SignUpForm/SignUpForm";
import LoginForm from "../../components/LoginForm/LoginForm";
import GoogleSignInButton from "../../components/GoogleSignInButton/GoogleSignInButton";

import "./AuthPage.css";

export default function AuthPage({ setUser }) {
    const [showLogin, setShowLogin] = useState(false);

    function handleShow() {
        let status = !showLogin;
        setShowLogin(status);
    }

    return (
        <main className="AuthPage">
            {showLogin ? (
                <LoginForm setUser={setUser} />
            ) : (
                <SignUpForm setUser={setUser} />
            )}
            <div style={{ marginTop: "0.75rem", marginBottom: "0.5rem" }}>
                <GoogleSignInButton setUser={setUser} />
            </div>
            <button
                className="user-button"
                id="sign-up-toggle"
                onClick={handleShow}
            >
                {showLogin
                    ? "Don't have an account with us?"
                    : "Already a user?"}
            </button>
        </main>
    );
}
