import React, { useEffect, useMemo, useRef, useState } from "react";
import { FiRefreshCw, FiSkipForward } from "react-icons/fi";
import quotes from "../data/quotes";

const pick = (not) => {
    let q;
    do q = quotes[Math.floor(Math.random() * quotes.length)]; while (quotes.length > 1 && q === not);
    return q;
};

export default function TypeTest() {
    const [quote, setQuote] = useState(() => pick());
    const [typed, setTyped] = useState("");
    const [startedAt, setStartedAt] = useState(null);
    const [endedAt, setEndedAt] = useState(null);
    const [now, setNow] = useState(Date.now());
    const input = useRef(null);

    const target = quote.quote;
    const done = endedAt !== null;

    // A live clock while the test runs. It starts on the first keystroke.
    useEffect(() => {
        if (!startedAt || done) return;
        const t = setInterval(() => setNow(Date.now()), 200);
        return () => clearInterval(t);
    }, [startedAt, done]);

    function onType(e) {
        if (done) return;
        const value = e.target.value.slice(0, target.length);
        if (!startedAt && value) setStartedAt(Date.now());
        setTyped(value);
        if (value.length === target.length) setEndedAt(Date.now());
    }

    function reset(next) {
        setQuote(next ? pick(quote) : quote);
        setTyped("");
        setStartedAt(null);
        setEndedAt(null);
        setTimeout(() => input.current?.focus(), 0);
    }

    const correct = useMemo(() => [...typed].filter((c, i) => c === target[i]).length, [typed, target]);
    const elapsed = startedAt ? ((endedAt || now) - startedAt) / 1000 : 0;
    // Too early to measure: a couple of characters in a fraction of a second reads as 600 wpm.
    const measurable = done || (elapsed >= 2 && typed.length >= 10);
    const wpm = measurable && elapsed > 0 ? Math.round((correct / 5) / (elapsed / 60)) : 0;
    const accuracy = typed.length ? Math.round((correct / typed.length) * 100) : 100;

    return (
        <section className="page page--narrow">
            <p className="kicker">Typing test</p>
            <h1>How fast do you type?</h1>
            <p className="lede">Type the quote below. The clock starts on your first key.</p>

            <figure className="card quote" onClick={() => input.current?.focus()}>
                <blockquote aria-label={target}>
                    {[...target].map((c, i) => {
                        const state = i < typed.length ? (typed[i] === c ? "ok" : "bad") : i === typed.length && !done ? "cursor" : "";
                        return <span key={i} className={state ? `ch ch--${state}` : "ch"}>{c}</span>;
                    })}
                </blockquote>
                <figcaption>— {quote.source}</figcaption>
            </figure>

            <textarea
                ref={input}
                className="type-input"
                value={typed}
                onChange={onType}
                onPaste={(e) => e.preventDefault()}
                placeholder="Start typing here…"
                disabled={done}
                autoFocus
                spellCheck="false"
                autoCorrect="off"
                autoCapitalize="off"
                aria-label="Type the quote"
            />

            <div className="stats stats--compact">
                <div><strong>{measurable ? wpm : "–"}</strong><span>wpm</span></div>
                <div><strong>{accuracy}%</strong><span>accuracy</span></div>
                <div><strong>{elapsed.toFixed(1)}s</strong><span>time</span></div>
            </div>

            {done && <p className="result">{wpm} words per minute at {accuracy}% accuracy. {wpm >= 70 ? "Blazing." : wpm >= 45 ? "Nicely done." : "Keep practising."}</p>}

            <div className="row">
                <button type="button" className="btn btn--primary" onClick={() => reset(true)}><FiSkipForward aria-hidden="true" /> New quote</button>
                <button type="button" className="btn btn--ghost" onClick={() => reset(false)}><FiRefreshCw aria-hidden="true" /> Try this one again</button>
            </div>
        </section>
    );
}
