import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { FiMoon, FiSun, FiPlus, FiMenu, FiX } from "react-icons/fi";

export default function NavBar({ user, theme, toggleTheme, onNewDoc, onLogout }) {
    const [open, setOpen] = useState(false);
    const [menu, setMenu] = useState(false);
    const location = useLocation();
    const menuRef = useRef(null);

    // Close the mobile menu and the account menu after navigating.
    useEffect(() => { setOpen(false); setMenu(false); }, [location.pathname]);

    useEffect(() => {
        if (!menu) return;
        const close = (e) => { if (!menuRef.current?.contains(e.target)) setMenu(false); };
        const esc = (e) => { if (e.key === "Escape") setMenu(false); };
        document.addEventListener("pointerdown", close);
        document.addEventListener("keydown", esc);
        return () => { document.removeEventListener("pointerdown", close); document.removeEventListener("keydown", esc); };
    }, [menu]);

    return (
        <header className="nav">
            <div className="nav__inner">
                <Link to="/" className="brand" aria-label="Scribist home">
                    <span className="brand__mark" aria-hidden="true">S</span>
                    <span className="brand__name">Scribist</span>
                </Link>

                <nav className={`nav__links ${open ? "is-open" : ""}`} aria-label="Main">
                    {user && <NavLink to="/" end className="nav__link">Docs</NavLink>}
                    <NavLink to="/berserk" className="nav__link">Berserk</NavLink>
                    <NavLink to="/typetest" className="nav__link">Typing test</NavLink>
                    <NavLink to="/about" className="nav__link">About</NavLink>
                </nav>

                <div className="nav__actions">
                    {user && (
                        <button type="button" className="btn btn--primary btn--sm nav__new" onClick={onNewDoc}>
                            <FiPlus aria-hidden="true" /> <span>New doc</span>
                        </button>
                    )}
                    <button type="button" className="icon-btn" onClick={toggleTheme}
                        aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"} title="Light / dark">
                        {theme === "dark" ? <FiSun /> : <FiMoon />}
                    </button>
                    {user ? (
                        <div className="account" ref={menuRef}>
                            <button type="button" className="avatar" onClick={() => setMenu((m) => !m)}
                                aria-haspopup="menu" aria-expanded={menu} title={user.name}>
                                {(user.name || "?").trim()[0].toUpperCase()}
                            </button>
                            {menu && (
                                <div className="menu" role="menu">
                                    <div className="menu__who">
                                        <strong>{user.name}</strong>
                                        <span>{user.email}</span>
                                    </div>
                                    <button type="button" role="menuitem" className="menu__item" onClick={onLogout}>Log out</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login" className="btn btn--ghost btn--sm">Log in</Link>
                    )}
                    <button type="button" className="icon-btn nav__burger" onClick={() => setOpen((o) => !o)}
                        aria-label="Menu" aria-expanded={open}>
                        {open ? <FiX /> : <FiMenu />}
                    </button>
                </div>
            </div>
        </header>
    );
}
