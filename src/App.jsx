import React, { Suspense, lazy, useCallback, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import NavBar from "./components/NavBar.jsx";
import Footer from "./components/Footer.jsx";
import Toast from "./components/Toast.jsx";
import Landing from "./pages/Landing.jsx";
import Home from "./pages/Home.jsx";
import Berserk, { SavePending } from "./pages/Berserk.jsx";
import TypeTest from "./pages/TypeTest.jsx";
import About from "./pages/About.jsx";
import Auth from "./pages/Auth.jsx";
import NotFound from "./pages/NotFound.jsx";
import { getUser, logout as clearToken } from "./lib/auth";
import { docs } from "./lib/api";
import { useTheme } from "./lib/theme";

// The editor (and Quill with it) only loads when a doc is opened.
const Doc = lazy(() => import("./pages/Doc.jsx"));

export default function App() {
    const [user, setUser] = useState(getUser);
    const [theme, toggleTheme] = useTheme();
    const [toast, setToast] = useState(null);
    const navigate = useNavigate();

    const notify = useCallback((message, kind = "info") => setToast({ message, kind, id: Date.now() }), []);

    const newDoc = useCallback(async () => {
        try {
            const doc = await docs.create();
            navigate(`/docs/${doc._id}`);
        } catch (err) {
            notify(err.message, "error");
        }
    }, [navigate, notify]);

    function logout() {
        clearToken();
        setUser(null);
        navigate("/");
    }

    const ctx = { user, setUser, notify, newDoc };

    return (
        <div className="app">
            <NavBar user={user} theme={theme} toggleTheme={toggleTheme} onNewDoc={newDoc} onLogout={logout} />
            <main className="main" id="main">
                <Routes>
                    <Route path="/" element={user ? <Home {...ctx} /> : <Landing />} />
                    <Route path="/docs/:docId" element={<RequireUser user={user}><Suspense fallback={<p className="page muted">Opening…</p>}><Doc {...ctx} /></Suspense></RequireUser>} />
                    <Route path="/berserk" element={<Berserk {...ctx} />} />
                    <Route path="/berserk/save" element={<RequireUser user={user}><SavePending {...ctx} /></RequireUser>} />
                    <Route path="/typetest" element={<TypeTest />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/login" element={user ? <AfterLogin /> : <Auth {...ctx} />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
            <Footer />
            <Toast toast={toast} onDone={() => setToast(null)} />
        </div>
    );
}

// Once signed in, /login forwards to wherever the visitor was headed (e.g. a share link).
function AfterLogin() {
    const next = new URLSearchParams(useLocation().search).get("next") || "/";
    return <Navigate to={next.startsWith("/") && !next.startsWith("//") ? next : "/"} replace />;
}

// Send signed-out visitors to log in, then back to where they were going (share links included).
function RequireUser({ user, children }) {
    const location = useLocation();
    if (user) return children;
    return <Navigate to={`/login?next=${encodeURIComponent(location.pathname + location.search)}`} replace />;
}
