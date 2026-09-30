import React from "react";
import { Link } from "react-router-dom";

export default function Landing() {
    return (
        <section className="page landing">
            <div className="landing__copy">
                <p className="kicker">A writing room</p>
                <h1 className="display">Write more. <em>Stop fussing.</em></h1>
                <p className="lede">Docs that save themselves and that you can edit with a friend in real time. Berserk Mode for when you need to push words out, and a typing test for fun.</p>
                <div className="row">
                    <Link to="/login?mode=signup" className="btn btn--primary btn--lg">Start writing</Link>
                    <Link to="/berserk" className="btn btn--ghost btn--lg">Try Berserk Mode</Link>
                </div>
            </div>
            <div className="landing__features">
                <article className="feature">
                    <h2>Docs, together</h2>
                    <p>Rich text that saves as you type. Share a link and write with someone else, live.</p>
                </article>
                <article className="feature">
                    <h2>Berserk Mode</h2>
                    <p>Set a word target and a timer. Stop typing and it starts eating your words.</p>
                </article>
                <article className="feature">
                    <h2>Typing test</h2>
                    <p>Type a quote, get your words per minute and accuracy.</p>
                </article>
            </div>
        </section>
    );
}
