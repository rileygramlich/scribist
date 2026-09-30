import React from "react";

export default function Footer() {
    return (
        <footer className="footer">
            <p>© {new Date().getFullYear()} Scribist · Designed &amp; built by <a href="https://github.com/rileygramlich">Riley Gramlich</a></p>
        </footer>
    );
}
