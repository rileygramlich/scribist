import { useState, React } from "react";
import { Link } from "react-router-dom";

// CSS
import "./Doc.css"

export default function Doc({ user }) {

    // async function addDoc()

  return (
    <main className="Doc">
      <h1 className="title">{user.name}'s Doc Page</h1>
      <div className="page-container">
      <div className="sections-sidebar">
        <a href="#" className="section">
          section 1
        </a>
        <a href="#" className="section button">
          section 2
        </a>
        <a href="#" className="section button">
          section 3
        </a>
      </div>
      <form action="/docs/create" method="post">
        <textarea name="section" id="" cols="70" rows="30">
          ...
        </textarea>
        <button type="submit">Save</button>
      </form>
      </div>
    </main>
  );
}
