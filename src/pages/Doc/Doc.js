import { useState, useEffect, useRef, React } from "react";
import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";

// import api-utils:
import * as docsAPI from "../../utilities/docs-api"

// CSS
import "./Doc.css";

export default function Doc({ user }) {
    // Initilize hooks for docs since we'll be doing client side, rendering.
    const [sections, setSections] = useState(['section 1', 'section 2'])

    const [doc, setDoc] = useState({
        name: 'title',
        sections: [sections],
        wordCount: 100
    })

    const docsRef = useRef([])

    useEffect(function () {
        async function getDocs() {
          const docs = await docsAPI.getAll();
          docsRef.current = [
            ...new Set(docs.map((doc) => doc.name)),
          ];
        }
        getDocs();
    
        async function getSections() {
          const sections = await docsAPI.getSections();
          setSections(sections);
        }
        getSections();
      }, []);

  async function handleSaveDoc() {
    const doc = await docsAPI.addDoc()
  }

  return (
    <main className="Doc">
      <h1 className="title">{user.name}'s Doc Page</h1>
      <div className="page-container">
        <div className="sections-sidebar">
          {/* <a href="#" className="section">
            section 1
          </a>
          <a href="#" className="section button">
            section 2
          </a>
          <a href="#" className="section button">
            section 3
          </a> */}
        </div>
        <form className="doc-form" action="/docs/create" method="post">
          <input type="text" name="name" />
          <textarea name="section" id="" cols="70" rows="30">
            ...
          </textarea>
          <button onClick={handleSaveDoc}>Save</button>
        </form>
        <div>
            <h3>All Docs:</h3>
            <Card style={{ width: "18rem" }}>
          <Card.Body>
            <Card.Title>{doc.name}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              Words: {doc.wordCount}
            </Card.Subtitle>
            <Card.Text>
              Doc.sections[0] Lorem ipsum dolor sit amet consectetur adipisicing
              elit. Neque itaque incidunt ea perspiciatis,
            </Card.Text>
            <Card.Link>Continue Doc</Card.Link>
            <Card.Link>Delete</Card.Link>
          </Card.Body>
        </Card>
        </div>
      </div>
    </main>
  );
}
