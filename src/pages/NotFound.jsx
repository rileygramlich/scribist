import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <section className="page page--narrow center">
            <p className="kicker">404</p>
            <h1>That page doesn't exist.</h1>
            <Link to="/" className="btn btn--primary">Back to Scribist</Link>
        </section>
    );
}
