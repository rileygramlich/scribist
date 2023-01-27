import React, { useState, useEffect, useRef } from "react";
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

  const nameRef = useRef()

  const navigate = useNavigate();

  useEffect(() => {
    async function renderDoc() {
      const doc = await docsAPI.getDoc(docId)
      console.log(doc)
      setName(doc.name)
    }
    renderDoc()
  }, [])


  const docsRef = useRef([]);

  async function handleSaveDoc() {
    console.log("You are saving");
    console.log(name)
    await docsAPI.update(docId, name);
  }


  function handleNameChange(e) {
    setName(e.target.value)
    handleSaveDoc()
  }
  // function handleSave() {

  // }

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     console.log('saving name')
  //     handleSaveDoc(content)
  //   }, 5000)
  //   return () => {clearInterval(interval)}
  // }, [name])

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
            value={name}
            onChange={handleNameChange}
          />
          <TextEditor setName={setName} name={name}/>
          <button type="submit">Save</button>
        </form>
      </div>
    </main>
  );
}
