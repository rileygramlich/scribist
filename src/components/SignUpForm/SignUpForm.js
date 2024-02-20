import React, { Component } from "react";
import { signUp } from "../../utilities/users-service";

export default class SignUpForm extends Component {
    state = {
        name: "",
        email: "",
        password: "",
        confirm: "",
        error: "",
    };

    handleChange = (evt) => {
        console.log(this.setState);
        this.setState({
            [evt.target.name]: evt.target.value,
            error: "",
        });
    };

    handleSubmit = async (evt) => {
        // Prevent form from being submitted to the server
        evt.preventDefault();
        try {
            // We don't want to send the 'error' or 'confirm' property,
            //  so let's make a copy of the state object, then delete them
            const formData = { ...this.state };
            delete formData.error;
            delete formData.confirm;
            delete formData.error;
            // The promise returned by the signUp service method
            // will resolve to the user object included in the
            // payload of the JSON Web Token (JWT)
            const user = await signUp(formData);
            this.props.setUser(user);
        } catch {
            // An error occurred
            this.setState({ error: "Sign Up Failed - Try Again" });
        }
    };

    render() {
        const disable = this.state.password !== this.state.confirm;
        return (
            <div id="auth-container">
                <div id="signup-form-container">
                    <h3 className="title" id="sign-up-title">
                        Sign Up With Email:{" "}
                    </h3>
                    <form
                        className="form-container"
                        autoComplete="off"
                        onSubmit={this.handleSubmit}
                    >
                        <div className="input-container">
                            <label htmlFor="name">Name:</label>
                            <input
                                className="auth-in"
                                type="text"
                                id="name"
                                name="name"
                                value={this.state.name}
                                onChange={this.handleChange}
                                required
                            />
                        </div>
                        <div className="input-container">
                            <label htmlFor="email">Email:</label>
                            <input
                                className="auth-in"
                                type="email"
                                id="email"
                                name="email"
                                value={this.state.email}
                                onChange={this.handleChange}
                                required
                            />
                        </div>
                        <div className="input-container">
                            <label htmlFor="password">Password:</label>
                            <input
                                className="auth-in"
                                type="password"
                                id="password"
                                name="password"
                                value={this.state.password}
                                onChange={this.handleChange}
                                required
                            />
                        </div>
                        <div className="input-container">
                            <label htmlFor="confirm">Confirm Password:</label>
                            <input
                                className="auth-in"
                                type="password"
                                id="confirm"
                                name="confirm"
                                value={this.state.confirm}
                                onChange={this.handleChange}
                                required
                            />
                        </div>
                        <button
                            className="submit-auth-button"
                            id="signup-button"
                            type="submit"
                            disabled={disable}
                        >
                            SIGN UP
                        </button>
                    </form>
                </div>
                <p id="error-message" className="error-message">
                    &nbsp;{this.state.error}
                </p>
            </div>
        );
    }
}
