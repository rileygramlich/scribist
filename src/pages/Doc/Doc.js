import { useState, useEffect, useRef, React } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "react-bootstrap";
import { EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";

// import api-utils:
import * as docsAPI from "../../utilities/docs-api";

// CSS
import "./Doc.css";

export default function Doc({ user }) {
  // Initilize hooks for docs since we'll be doing client side, rendering.
  // const [sections, setSections] = useState(['section 1', 'section 2'])

  const [name, setName] = useState("");
  const [content, setContent] = useState("");

  const navigate = useNavigate();

  // const [doc, setDoc] = useState({
  //     name: name,
  //     content: content,
  //     wordCount: content.split(' ').length
  // })

  const docsRef = useRef([]);

  async function handleSaveDoc(event) {
    event.preventDefault();
    console.log("You are saving" + name + "   Content: " + content);
    let wordCount = content.split(" ").length - 1;
    // console.log(doc)
    docsAPI.create(name, content, wordCount);
    navigate('/')
  }

  return (
    <main className="Doc">
      <h1 className="title">{user.name}'s Doc Page</h1>
      <div className="page-container">
        <Editor />
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
        <form className="doc-form" onSubmit={handleSaveDoc}>
          <input
            type="text"
            name={name}
            onChange={(e) => setName(e.target.value)}
          />
          <textarea
            name="content"
            id=""
            cols="70"
            rows="30"
            onChange={(e) => setContent(e.target.value)}
          >
            ...
          </textarea>
          <button type="submit">Save</button>
        </form>
        <div>
          <h3>All Docs:</h3>
          <Card style={{ width: "18rem" }}>
            <Card.Body>
              <Card.Title>{name}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                Words: {content.split(" ").length}
              </Card.Subtitle>
              <Card.Text>{content}</Card.Text>
              <Card.Link>Continue Doc</Card.Link>
              <Card.Link>Delete</Card.Link>
            </Card.Body>
          </Card>
        </div>
      </div>
    </main>
  );
}
