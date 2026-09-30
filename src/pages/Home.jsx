import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiTrash2, FiUsers, FiLogOut } from "react-icons/fi";
import { docs as docsApi } from "../lib/api";
import { timeAgo } from "../lib/text";

export default function Home({ user, notify, newDoc }) {
    const [lists, setLists] = useState(null);

    useEffect(() => {
        docsApi.list().then(setLists).catch((err) => { notify(err.message, "error"); setLists({ owned: [], shared: [] }); });
    }, [notify]);

    async function remove(doc) {
        const verb = doc.owner ? "Delete" : "Leave";
        const question = doc.owner
            ? `Delete "${doc.name}"? This can't be undone, and anyone you shared it with loses it too.`
            : `Leave "${doc.name}"? It will disappear from your list until someone shares it with you again.`;
        if (!window.confirm(question)) return;
        try {
            await docsApi.remove(doc._id);
            setLists((l) => ({ owned: l.owned.filter((d) => d._id !== doc._id), shared: l.shared.filter((d) => d._id !== doc._id) }));
            notify(`${verb === "Delete" ? "Deleted" : "Left"} "${doc.name}".`);
        } catch (err) {
            notify(err.message, "error");
        }
    }

    const firstName = (user.name || "").split(" ")[0];
    return (
        <section className="page">
            <div className="page__head">
                <div>
                    <p className="kicker">Your docs</p>
                    <h1>Hi, {firstName}.</h1>
                </div>
                <button type="button" className="btn btn--primary" onClick={newDoc}><FiPlus aria-hidden="true" /> New doc</button>
            </div>

            {!lists ? (
                <div className="doc-grid">{[0, 1, 2].map((i) => <div key={i} className="doc-card doc-card--skeleton" />)}</div>
            ) : (
                <>
                    {lists.owned.length === 0 ? (
                        <div className="empty">
                            <h2>Nothing here yet.</h2>
                            <p className="muted">Start a doc, or warm up with <Link to="/berserk">Berserk Mode</Link> and save what you write.</p>
                            <button type="button" className="btn btn--primary" onClick={newDoc}>Write your first doc</button>
                        </div>
                    ) : (
                        <div className="doc-grid">{lists.owned.map((d) => <DocCard key={d._id} doc={d} onRemove={remove} />)}</div>
                    )}
                    {lists.shared.length > 0 && (
                        <>
                            <h2 className="section-title"><FiUsers aria-hidden="true" /> Shared with you</h2>
                            <div className="doc-grid">{lists.shared.map((d) => <DocCard key={d._id} doc={d} onRemove={remove} />)}</div>
                        </>
                    )}
                </>
            )}
        </section>
    );
}

function DocCard({ doc, onRemove }) {
    return (
        <article className="doc-card">
            <Link to={`/docs/${doc._id}`} className="doc-card__link">
                <h3 className="doc-card__title">{doc.name}</h3>
                <p className="doc-card__meta">
                    {doc.wordCount.toLocaleString()} {doc.wordCount === 1 ? "word" : "words"} · edited {timeAgo(doc.updatedAt)}
                    {!doc.owner && doc.ownerName ? ` · by ${doc.ownerName}` : ""}
                </p>
            </Link>
            <button type="button" className="icon-btn doc-card__remove" onClick={() => onRemove(doc)}
                aria-label={doc.owner ? `Delete ${doc.name}` : `Leave ${doc.name}`} title={doc.owner ? "Delete" : "Leave"}>
                {doc.owner ? <FiTrash2 /> : <FiLogOut />}
            </button>
        </article>
    );
}
