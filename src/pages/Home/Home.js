import React, { useState, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import DocsList from "../../components/DocsList/DocsList";

// CSS
import "./Home.css";

// import api-utils:
import * as docsAPI from "../../utilities/docs-api";

export default function Home({ user, handleNewDoc }) {
    const docsRef = useRef([]);
    const [docs, setDocs] = useState([]);

    useEffect(function () {
        async function getDocs() {
            const docs = await docsAPI.getAllDocs();
            setDocs(docs);
            docsRef.current = [...new Set(docs.map((doc) => doc))];
        }
        getDocs();
    }, []);

    async function handleDelete(docId) {
        const docs = await docsAPI.deleteDoc(docId);
        setDocs(docs);
    }

    return (
        <main className="Home">
            <h1 className="title">{user.name}'s Docs</h1>
            <div className="docs">
                <Button
                    className="new-doc-btn"
                    type="submit"
                    onClick={handleNewDoc}
                >
                    New Doc
                </Button>
                <DocsList docs={docs} handleDelete={handleDelete} />
            </div>
        </main>
    );
}
