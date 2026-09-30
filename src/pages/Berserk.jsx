import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiPause, FiPlay, FiCopy, FiEye, FiEyeOff, FiFlag, FiSave, FiRotateCcw } from "react-icons/fi";
import { docs as docsApi } from "../lib/api";
import { copyText, countWords, formatClock, textToDelta } from "../lib/text";

// Stop typing for GRACE_MS and Berserk starts eating ERASE_CHARS characters
// every ERASE_EVERY_MS until you type again.
const GRACE_MS = 2000;
const ERASE_EVERY_MS = 2000;
const ERASE_CHARS = 5;
const TICK_MS = 100;

export default function Berserk({ user, notify }) {
    const [phase, setPhase] = useState("setup"); // setup | writing | done
    const [minutes, setMinutes] = useState(15);
    const [target, setTarget] = useState(500);
    const [mode, setMode] = useState("berserk"); // berserk | timer

    const [text, setText] = useState("");
    const [remaining, setRemaining] = useState(0);
    const [paused, setPaused] = useState(false);
    const [focus, setFocus] = useState(false);
    const [danger, setDanger] = useState(0);
    const [spentMs, setSpentMs] = useState(0);

    const endAt = useRef(0);
    const pausedLeft = useRef(0);
    const lastInput = useRef(0);
    const lastErase = useRef(0);
    const hitTarget = useRef(false);
    const area = useRef(null);

    const words = countWords(text);
    const duration = minutes * 60 * 1000;

    function start(e) {
        e.preventDefault();
        setText("");
        setPaused(false);
        setFocus(false);
        setDanger(0);
        hitTarget.current = false;
        endAt.current = Date.now() + duration;
        lastInput.current = Date.now();
        lastErase.current = 0;
        setRemaining(duration);
        setPhase("writing");
    }

    function finish() {
        setSpentMs(duration - Math.max(0, paused ? pausedLeft.current : endAt.current - Date.now()));
        setPhase("done");
    }

    function togglePause() {
        if (paused) {
            endAt.current = Date.now() + pausedLeft.current;
            lastInput.current = Date.now(); // no instant erasing on resume
            setPaused(false);
            setTimeout(() => area.current?.focus(), 0);
        } else {
            pausedLeft.current = Math.max(0, endAt.current - Date.now());
            setPaused(true);
        }
    }

    function onType(e) {
        lastInput.current = Date.now();
        lastErase.current = 0;
        setDanger(0);
        setText(e.target.value);
    }

    // The one clock. It only depends on phase and pause, never on typing, so the
    // countdown can't be reset by a keystroke.
    useEffect(() => {
        if (phase !== "writing" || paused) return;
        const tick = setInterval(() => {
            const now = Date.now();
            const left = endAt.current - now;
            if (left <= 0) {
                setRemaining(0);
                setSpentMs(duration);
                setPhase("done");
                return;
            }
            setRemaining(left);
            if (mode !== "berserk") return;
            const idle = now - lastInput.current;
            setDanger(Math.min(1, idle / GRACE_MS));
            if (idle >= GRACE_MS && now - lastErase.current >= ERASE_EVERY_MS) {
                lastErase.current = now;
                setText((t) => t.slice(0, -ERASE_CHARS));
            }
        }, TICK_MS);
        return () => clearInterval(tick);
    }, [phase, paused, mode, duration]);

    useEffect(() => {
        if (phase === "writing" && !hitTarget.current && words >= target) {
            hitTarget.current = true;
            notify(`You hit ${target.toLocaleString()} words. Keep going, or finish.`, "success");
        }
    }, [words, target, phase, notify]);

    useEffect(() => {
        if (phase === "writing") area.current?.focus();
    }, [phase]);

    if (phase === "setup") {
        return (
            <section className="page page--narrow">
                <p className="kicker">Berserk Mode</p>
                <h1>Go berserk.</h1>
                <p className="lede">Set a word target and a timer, then don't stop. In Berserk mode, pausing for more than {GRACE_MS / 1000} seconds starts deleting your last few characters until you type again.</p>
                <form className="card berserk-setup" onSubmit={start}>
                    <label className="field">
                        <span>Time <output>{minutes} min</output></span>
                        <input type="range" min="1" max="120" value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} />
                    </label>
                    <label className="field">
                        <span>Word target <output>{target.toLocaleString()} words</output></span>
                        <div className="range-row">
                            <input type="range" min="10" max="5000" step="10" value={Math.min(target, 5000)} onChange={(e) => setTarget(Number(e.target.value))} />
                            <input type="number" min="1" max="100000" value={target} onChange={(e) => setTarget(Math.max(1, Number(e.target.value) || 1))} aria-label="Word target" />
                        </div>
                    </label>
                    <fieldset className="choice">
                        <legend>Mode</legend>
                        <label className={`choice__option ${mode === "berserk" ? "is-on" : ""}`}>
                            <input type="radio" name="mode" value="berserk" checked={mode === "berserk"} onChange={() => setMode("berserk")} />
                            <strong>Berserk</strong>
                            <span>Stop typing and it eats your words.</span>
                        </label>
                        <label className={`choice__option ${mode === "timer" ? "is-on" : ""}`}>
                            <input type="radio" name="mode" value="timer" checked={mode === "timer"} onChange={() => setMode("timer")} />
                            <strong>Timer only</strong>
                            <span>Just the clock and the target. Nothing gets deleted.</span>
                        </label>
                    </fieldset>
                    <button type="submit" className="btn btn--primary btn--lg btn--block">
                        Write {target.toLocaleString()} words in {minutes} minutes
                    </button>
                </form>
            </section>
        );
    }

    if (phase === "done") return <Results {...{ text, words, target, spentMs, user, notify }} onAgain={() => setPhase("setup")} />;

    const progress = Math.min(1, words / target);
    return (
        <section className={`berserk ${focus ? "is-focus" : ""}`}>
            <div className="berserk__bar">
                <div className={`berserk__clock ${remaining < 60000 ? "is-low" : ""}`} aria-live="off">{formatClock(remaining)}</div>
                {!focus && (
                    <div className="berserk__count">
                        <strong>{words.toLocaleString()}</strong> / {target.toLocaleString()} words
                    </div>
                )}
                <div className="berserk__tools">
                    <button type="button" className="icon-btn" onClick={togglePause} aria-label={paused ? "Resume" : "Pause"} title={paused ? "Resume" : "Pause"}>
                        {paused ? <FiPlay /> : <FiPause />}
                    </button>
                    <button type="button" className="icon-btn" onClick={() => setFocus((f) => !f)} aria-label={focus ? "Show stats" : "Hide stats"} title={focus ? "Show stats" : "Focus"}>
                        {focus ? <FiEye /> : <FiEyeOff />}
                    </button>
                    <button type="button" className="icon-btn" onClick={async () => notify((await copyText(text)) ? "Copied." : "Couldn't copy.", "info")} aria-label="Copy text" title="Copy">
                        <FiCopy />
                    </button>
                    <button type="button" className="btn btn--primary btn--sm" onClick={finish}><FiFlag aria-hidden="true" /> Finish</button>
                </div>
            </div>
            <div className="meter" aria-hidden="true"><span className={progress >= 1 ? "is-full" : ""} style={{ width: `${progress * 100}%` }} /></div>
            <div className="berserk__page">
                <textarea
                    ref={area}
                    className="berserk__text"
                    value={text}
                    onChange={onType}
                    readOnly={paused}
                    placeholder="Go. Don't stop."
                    spellCheck="false"
                    aria-label="Berserk writing area"
                />
                {mode === "berserk" && !paused && (
                    <div className="danger" aria-hidden="true"><span style={{ width: `${danger * 100}%`, opacity: danger > 0.4 ? 1 : danger }} /></div>
                )}
                {paused && <div className="berserk__paused">Paused. Take a breath.</div>}
            </div>
        </section>
    );
}

function Results({ text, words, target, spentMs, user, notify, onAgain }) {
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();
    const mins = Math.max(spentMs / 60000, 1 / 60);
    const wpm = Math.round(words / mins);
    const made = words >= target;

    async function saveAsDoc() {
        setSaving(true);
        try {
            const stamp = new Date().toLocaleDateString(undefined, { month: "short", day: "numeric" });
            const doc = await docsApi.create({ name: `Berserk session, ${stamp}`, content: textToDelta(text), wordCount: words });
            navigate(`/docs/${doc._id}`);
        } catch (err) {
            notify(err.message, "error");
            setSaving(false);
        }
    }

    return (
        <section className="page page--narrow">
            <p className="kicker">{made ? "Target reached" : "Session over"}</p>
            <h1>{made ? "You went berserk." : "Good effort."}</h1>
            <div className="stats">
                <div><strong>{words.toLocaleString()}</strong><span>words</span></div>
                <div><strong>{target.toLocaleString()}</strong><span>target</span></div>
                <div><strong>{formatClock(spentMs)}</strong><span>time</span></div>
                <div><strong>{wpm}</strong><span>words / min</span></div>
            </div>
            {text.trim() && <blockquote className="preview">{text.length > 600 ? `${text.slice(0, 600)}…` : text}</blockquote>}
            <div className="row">
                {user ? (
                    <button type="button" className="btn btn--primary" onClick={saveAsDoc} disabled={saving || !text.trim()}>
                        <FiSave aria-hidden="true" /> {saving ? "Saving…" : "Save as a doc"}
                    </button>
                ) : (
                    <Link to={`/login?mode=signup&next=${encodeURIComponent("/berserk/save")}`} className="btn btn--primary"
                        onClick={() => keepForLater(text, words)}>
                        Sign up to save your writing
                    </Link>
                )}
                <button type="button" className="btn btn--ghost" onClick={async () => notify((await copyText(text)) ? "Copied." : "Couldn't copy.")} disabled={!text.trim()}>
                    <FiCopy aria-hidden="true" /> Copy text
                </button>
                <button type="button" className="btn btn--ghost" onClick={onAgain}><FiRotateCcw aria-hidden="true" /> Go again</button>
            </div>
        </section>
    );
}

// A guest's session survives signing up: it waits in this tab, then /berserk/save turns it into a doc.
const PENDING = "scribist:berserk-pending";

function keepForLater(text, words) {
    try { sessionStorage.setItem(PENDING, JSON.stringify({ text, words })); } catch {}
}

export function SavePending({ notify }) {
    const navigate = useNavigate();
    const started = useRef(false);
    useEffect(() => {
        if (started.current) return;
        started.current = true;
        let pending = null;
        try { pending = JSON.parse(sessionStorage.getItem(PENDING)); } catch {}
        if (!pending || !pending.text) return navigate("/", { replace: true });
        const stamp = new Date().toLocaleDateString(undefined, { month: "short", day: "numeric" });
        docsApi.create({ name: `Berserk session, ${stamp}`, content: textToDelta(pending.text), wordCount: pending.words })
            .then((doc) => {
                try { sessionStorage.removeItem(PENDING); } catch {}
                notify("Saved your Berserk session as a doc.", "success");
                navigate(`/docs/${doc._id}`, { replace: true });
            })
            .catch((err) => { notify(err.message, "error"); navigate("/", { replace: true }); });
    }, [navigate, notify]);
    return <p className="page muted">Saving your writing…</p>;
}
