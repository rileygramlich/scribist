// LoginForm.jsx

import React, { useState } from "react";
import * as usersService from "../../utilities/users-service";

export default function LoginForm({ setUser }) {
    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");

    function handleChange(evt) {
        setCredentials({ ...credentials, [evt.target.name]: evt.target.value });
        setError("");
    }

    async function handleSubmit(evt) {
        // Prevent form from being submitted to the server
        evt.preventDefault();
        try {
            // The promise returned by the signUp service method
            // will resolve to the user object included in the
            // payload of the JSON Web Token (JWT)
            const user = await usersService.login(credentials);
            setUser(user);
        } catch {
            setError("Log In Failed - Try Again");
        }
    }

    return (
        <div id="auth-container">
            <div id="login-container">
                <h3 className="title" id="sign-up-title">
                    Login With Email:{" "}
                </h3>
                <form
                    className="form-container"
                    autoComplete="off"
                    onSubmit={handleSubmit}
                >
                    <div className="input-container">
                        <label>Email: </label>
                        <input
                            className="auth-in"
                            type="text"
                            name="email"
                            value={credentials.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-container">
                        <label>Password: </label>
                        <input
                            className="auth-in"
                            type="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button className="submit-auth-button" type="submit">
                        LOG IN
                    </button>
                </form>
            </div>
            <p className="error-message">&nbsp;{error}</p>
        </div>
    );
}
