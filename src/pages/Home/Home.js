import { useState, React, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import DocsList from "../../components/DocsList/DocsList";

// CSS
import "./Home.css";

// import api-utils:
import * as docsAPI from "../../utilities/docs-api"

export default function Home({user}) {
  const docsRef = useRef([])
  const [docs, setDocs] = useState([])

  useEffect(function () {
        async function getDocs() {
          const docs = await docsAPI.getAllDocs();
          setDocs(docs)
          docsRef.current = [
            ...new Set(docs.map((doc) => (doc))),
          ];
        }
        getDocs();
      }, []);

      async function handleDelete(docId) {
        console.log('deleting doc')
        const docs = await docsAPI.deleteDoc(docId)
        setDocs(docs)
      }
      
  return (
    <main className="Home">
      <h1 className="title">{user.name}'s Home Page</h1>
      <div className="docs">
        <Button id="new-doc-btn" type="submit">
          <Link to="/docs/new">New Doc</Link>
        </Button>
        <DocsList docs={docs} handleDelete={handleDelete}/>
      </div>
    </main>
  );
}
