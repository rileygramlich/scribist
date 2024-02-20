import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import TextEditor from "../../components/TextEditor/TextEditor";

// import api-utils:
import * as docsAPI from "../../utilities/docs-api";

// CSS
import "./Doc.css";

export default function Doc({ user }) {
    const { docId } = useParams();

    const [name, setName] = useState("");

    useEffect(() => {
        async function renderDoc() {
            const doc = await docsAPI.getDoc(docId);
            setName(doc.name);
        }
        renderDoc();
    }, []);

    async function handleSaveDoc() {
        await docsAPI.update(docId, name);
    }

    function handleNameChange(e) {
        setName(e.target.value);
        handleSaveDoc();
    }

    return (
        <main className="Doc">
            <div className="page-container">
                <form className="doc-form" onSubmit={handleSaveDoc}>
                    <input
                        type="text"
                        name={name}
                        value={name}
                        onChange={handleNameChange}
                        className="doc-name"
                    />
                    <TextEditor setName={setName} name={name} />
                </form>
            </div>
        </main>
    );
}
