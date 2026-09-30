import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { io } from "socket.io-client";
import { FiArrowLeft, FiLink, FiCheck, FiCloudOff, FiLoader } from "react-icons/fi";
import { docs as docsApi } from "../lib/api";
import { getToken } from "../lib/auth";
import { copyText, countWords, timeAgo } from "../lib/text";

// Mid-tone text colours and see-through highlights, chosen to read on both the
// light and the dark page ("" = the theme's default).
const TEXT_COLORS = ["", "#2f6fd0", "#0f8b8d", "#2e8b57", "#c77c02", "#d9591b", "#d03b3b", "#c2417f", "#7b55c7", "#6b7686"];
const HIGHLIGHTS = ["", "rgba(255, 213, 79, 0.45)", "rgba(102, 187, 106, 0.35)", "rgba(66, 165, 245, 0.35)", "rgba(239, 83, 80, 0.3)", "rgba(171, 71, 188, 0.3)", "rgba(158, 158, 158, 0.35)"];

const TOOLBAR = [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "code-block", "link"],
    [{ align: [] }],
    [{ color: TEXT_COLORS }, { background: HIGHLIGHTS }],
    ["clean"],
];
const SAVE_AFTER_MS = 1000;

export default function Doc({ user, notify }) {
    const { docId } = useParams();
    const [params] = useSearchParams();
    const navigate = useNavigate();

    const [meta, setMeta] = useState(null);
    const [error, setError] = useState("");
    const [name, setName] = useState("");
    const [status, setStatus] = useState("connecting"); // connecting | saved | saving | unsaved | offline
    const [savedAt, setSavedAt] = useState(null);
    const [people, setPeople] = useState([]);
    const [words, setWords] = useState(0);

    const editorRef = useRef(null);
    const nameRef = useRef(null);
    const dirty = useRef(false);
    const renameTimer = useRef(null);

    // 1. Load the doc. Opening a share link adds you as a collaborator, then the
    //    token is dropped from the address bar.
    useEffect(() => {
        let cancelled = false;
        setMeta(null);
        setError("");
        const share = params.get("share");
        docsApi.get(docId, share)
            .then((doc) => {
                if (cancelled) return;
                setMeta(doc);
                setName(doc.name);
                if (share) navigate(`/docs/${docId}`, { replace: true });
            })
            .catch((err) => !cancelled && setError(err.message));
        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [docId]);

    // A brand-new doc: select "Untitled" so you can type a title straight away.
    useEffect(() => {
        if (meta && meta.owner && meta.name === "Untitled" && !meta.wordCount) {
            nameRef.current?.focus();
            nameRef.current?.select();
        }
    }, [meta]);

    // 2. The editor and the live connection.
    useEffect(() => {
        if (!meta) return;
        const container = editorRef.current;
        container.innerHTML = "";
        const el = document.createElement("div");
        container.append(el);
        const quill = new Quill(el, {
            theme: "snow",
            placeholder: "Start writing…",
            modules: { toolbar: TOOLBAR, history: { userOnly: true } },
        });
        quill.disable();
        quill.setText("Loading…");

        const socket = io({ auth: { token: getToken() } });
        let saveTimer = null;
        let loaded = false;
        dirty.current = false;

        const updateWords = () => setWords(countWords(quill.getText()));

        function save() {
            clearTimeout(saveTimer);
            if (!socket.connected || !loaded) return;
            dirty.current = false; // edits made while this save is in flight set it again
            setStatus("saving");
            socket.timeout(10000).emit("save-doc", { content: quill.getContents(), wordCount: countWords(quill.getText()) }, (err, res) => {
                if (err || !res || res.error) {
                    dirty.current = true;
                    setStatus("unsaved");
                    saveTimer = setTimeout(save, 3000);
                    return;
                }
                if (!dirty.current) {
                    setStatus("saved");
                    setSavedAt(res.savedAt);
                }
            });
        }

        // (Re)join the room on every connect. After a reconnect, keep any unsaved
        // local edits instead of replacing them with the server's copy.
        function join() {
            socket.emit("get-doc", docId, (res) => {
                if (res.error) return setError(res.error);
                if (!loaded || !dirty.current) quill.setContents(res.content || { ops: [] }, "api");
                if (!loaded) quill.history.clear();
                loaded = true;
                quill.enable();
                updateWords();
                if (dirty.current) save();
                else setStatus("saved");
            });
        }

        socket.on("connect", join);
        socket.on("disconnect", () => setStatus("offline"));
        socket.on("connect_error", (err) => {
            if (err.message === "unauthorized") setError("Your login has expired. Log in again to keep editing.");
            else setStatus("offline");
        });
        socket.on("receive-changes", (delta) => { quill.updateContents(delta, "api"); updateWords(); });
        socket.on("presence", setPeople);
        socket.on("name-changed", setName);
        socket.on("doc-deleted", () => { notify("The owner deleted this doc.", "error"); navigate("/"); });

        const onChange = (delta, old, source) => {
            if (source !== "user") return;
            socket.emit("send-changes", delta);
            dirty.current = true;
            setStatus("unsaved");
            updateWords();
            clearTimeout(saveTimer);
            saveTimer = setTimeout(save, SAVE_AFTER_MS);
        };
        quill.on("text-change", onChange);

        const warn = (e) => { if (dirty.current) { e.preventDefault(); e.returnValue = ""; } };
        window.addEventListener("beforeunload", warn);

        return () => {
            window.removeEventListener("beforeunload", warn);
            clearTimeout(saveTimer);
            // Leaving the page with edits not yet saved: send them on the way out.
            if (dirty.current && loaded && socket.connected) {
                socket.emit("save-doc", { content: quill.getContents(), wordCount: countWords(quill.getText()) });
            }
            quill.off("text-change", onChange);
            socket.disconnect();
            container.innerHTML = "";
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [meta && meta._id]);

    function rename(value) {
        setName(value);
        clearTimeout(renameTimer.current);
        renameTimer.current = setTimeout(() => {
            docsApi.rename(docId, value).catch((err) => notify(err.message, "error"));
        }, 600);
    }

    async function share() {
        const link = `${window.location.origin}/docs/${docId}?share=${meta.shareToken}`;
        const ok = await copyText(link);
        notify(ok ? "Share link copied. Anyone who's signed in and opens it can edit this doc." : link, ok ? "info" : "error");
    }

    if (error) {
        return (
            <section className="page page--narrow center">
                <h1>Can't open this doc</h1>
                <p className="muted">{error}</p>
                <Link to="/" className="btn btn--primary">Back to your docs</Link>
            </section>
        );
    }

    const others = people.filter((n) => n !== user.name);
    const together = others.length === 0 ? "Just you" : others.length === 1 ? `You and ${others[0]}` : `You and ${others.length} others`;

    return (
        <section className="doc">
            <div className="doc__bar">
                <Link to="/" className="icon-btn" aria-label="Back to your docs" title="Your docs"><FiArrowLeft /></Link>
                <input
                    ref={nameRef}
                    className="doc__name"
                    value={name}
                    onChange={(e) => rename(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
                    aria-label="Doc name"
                    maxLength={250}
                    placeholder="Untitled"
                    disabled={!meta}
                />
                <div className="doc__status">
                    <SaveStatus status={status} savedAt={savedAt} />
                    <span className="doc__people" title={people.join(", ")}>{together}</span>
                    {meta && meta.owner && (
                        <button type="button" className="btn btn--ghost btn--sm" onClick={share}><FiLink aria-hidden="true" /> Share</button>
                    )}
                </div>
            </div>
            <div className="doc__paper">
                <div className="editor" ref={editorRef} />
            </div>
            <div className="doc__foot">{words.toLocaleString()} {words === 1 ? "word" : "words"}</div>
        </section>
    );
}

function SaveStatus({ status, savedAt }) {
    const [, tick] = useState(0);
    useEffect(() => { const t = setInterval(() => tick((n) => n + 1), 30000); return () => clearInterval(t); }, []);
    if (status === "offline") return <span className="status status--warn"><FiCloudOff aria-hidden="true" /> Offline, reconnecting…</span>;
    if (status === "connecting") return <span className="status"><FiLoader aria-hidden="true" className="spin" /> Connecting…</span>;
    if (status === "saving" || status === "unsaved") return <span className="status"><FiLoader aria-hidden="true" className="spin" /> Saving…</span>;
    return <span className="status status--ok"><FiCheck aria-hidden="true" /> Saved{savedAt ? ` ${timeAgo(savedAt)}` : ""}</span>;
}
