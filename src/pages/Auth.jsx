import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { users } from "../lib/api";
import { saveToken } from "../lib/auth";

export default function Auth({ setUser }) {
    const [params] = useSearchParams();
    const [mode, setMode] = useState(params.get("mode") === "signup" ? "signup" : "login");
    const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);
    // Setting the user is enough: the /login route then forwards to ?next= (see AfterLogin).
    function signedIn(token) {
        setUser(saveToken(token));
    }

    function change(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    }

    async function submit(e) {
        e.preventDefault();
        if (mode === "signup" && form.password !== form.confirm) return setError("Those passwords don't match.");
        setBusy(true);
        try {
            const token = mode === "signup"
                ? await users.signUp({ name: form.name, email: form.email, password: form.password })
                : await users.login({ email: form.email, password: form.password });
            signedIn(token);
        } catch (err) {
            setError(err.message);
        } finally {
            setBusy(false);
        }
    }

    const signup = mode === "signup";
    return (
        <section className="page page--narrow">
            <div className="card auth">
                <h1>{signup ? "Create your account" : "Welcome back"}</h1>
                <p className="muted">{signup ? "Your docs, saved and ready on any device." : "Log in to get back to your docs."}</p>

                <GoogleButton onToken={signedIn} onError={setError} />

                <form className="form" onSubmit={submit}>
                    {signup && (
                        <label className="field">
                            <span>Name</span>
                            <input name="name" value={form.name} onChange={change} required autoComplete="name" maxLength={80} />
                        </label>
                    )}
                    <label className="field">
                        <span>Email</span>
                        <input name="email" type="email" value={form.email} onChange={change} required autoComplete="email" />
                    </label>
                    <label className="field">
                        <span>Password</span>
                        <input name="password" type="password" value={form.password} onChange={change} required minLength={6}
                            autoComplete={signup ? "new-password" : "current-password"} />
                    </label>
                    {signup && (
                        <label className="field">
                            <span>Confirm password</span>
                            <input name="confirm" type="password" value={form.confirm} onChange={change} required minLength={6} autoComplete="new-password" />
                        </label>
                    )}
                    <p className="form__error" role="alert">{error}</p>
                    <button type="submit" className="btn btn--primary btn--block" disabled={busy}>
                        {busy ? "One moment…" : signup ? "Create account" : "Log in"}
                    </button>
                </form>

                <p className="auth__switch">
                    {signup ? "Already have an account?" : "New to Scribist?"}{" "}
                    <button type="button" className="link" onClick={() => { setMode(signup ? "login" : "signup"); setError(""); }}>
                        {signup ? "Log in" : "Create an account"}
                    </button>
                </p>
            </div>
        </section>
    );
}

/** Google's own sign-in button. Only shown when the server has a GOOGLE_CLIENT_ID. */
function GoogleButton({ onToken, onError }) {
    const ref = useRef(null);
    const [clientId, setClientId] = useState(null);

    useEffect(() => {
        users.config().then((c) => setClientId(c.googleClientId)).catch(() => {});
    }, []);

    useEffect(() => {
        if (!clientId) return;
        let cancelled = false;
        const render = () => {
            if (cancelled || !window.google?.accounts?.id || !ref.current) return;
            window.google.accounts.id.initialize({
                client_id: clientId,
                callback: async ({ credential }) => {
                    try {
                        onToken(await users.google(credential));
                    } catch (err) {
                        onError(err.message);
                    }
                },
            });
            const dark = document.documentElement.dataset.theme === "dark";
            window.google.accounts.id.renderButton(ref.current, {
                theme: dark ? "filled_black" : "outline", size: "large", shape: "pill", width: 320, text: "continue_with",
            });
        };
        if (window.google?.accounts?.id) render();
        else {
            const script = document.createElement("script");
            script.src = "https://accounts.google.com/gsi/client";
            script.async = true;
            script.onload = render;
            document.head.appendChild(script);
        }
        return () => { cancelled = true; };
    }, [clientId, onToken, onError]);

    if (!clientId) return null;
    return (
        <>
            <div className="google" ref={ref} />
            <div className="divider"><span>or with email</span></div>
        </>
    );
}
