import { useState, useEffect, useRef, React } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Card } from "react-bootstrap";
import TextEditor from "../../components/TextEditor/TextEditor";


// import api-utils:
import * as docsAPI from "../../utilities/docs-api";

// CSS
import "./Doc.css";

export default function Doc({ user }) {
  // Initilize hooks for docs since we'll be doing client side, rendering.
  // const [sections, setSections] = useState(['section 1', 'section 2'])
  const {docId} = useParams()

  const [name, setName] = useState("");
  const [content, setContent] = useState({});

  const navigate = useNavigate();


  const docsRef = useRef([]);

  async function handleSaveDoc(content) {
    console.log("You are saving");
    console.log(name)
    console.log(content)
    await docsAPI.update(docId, name, content);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      handleSaveDoc(content)
    }, 5000)
    return () => {clearInterval(interval)}
  }, [content])

  return (
    <main className="Doc">
      <h1 className="title">{user.name}'s Doc Page</h1>
      <div className="page-container">
        <div className="sections-sidebar"></div>
        <form className="doc-form" onSubmit={handleSaveDoc}>
          <label htmlFor="">Title: </label>
          <input
            type="text"
            name={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextEditor handleSaveDoc={handleSaveDoc} content={content} setContent={setContent} name={name}/>
          <textarea name="content" id="" cols="70" rows="30">
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
                {/* Words: {content.split(" ").length} */}
              </Card.Subtitle>
              {/* <Card.Text>{content}</Card.Text> */}
              <Card.Link>Continue Doc</Card.Link>
              <Card.Link>Delete</Card.Link>
            </Card.Body>
          </Card>
        </div>
      </div>
    </main>
  );
}
