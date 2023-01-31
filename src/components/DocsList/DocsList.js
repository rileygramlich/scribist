import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function DocsList({ docs, handleDelete }) {
  const docCardEls = docs.map((doc) => (
    <Card id="doc-card" style={{ width: "18rem" }}>
      <Card.Body>
        <Link to={`docs/${doc._id}`}>
          <Card.Title>{doc.name}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            {/* Word Count: {doc.wordCount} */}
          </Card.Subtitle>
          <Card.Text>{/* {doc.content} */}</Card.Text>
          <button className="continue-btn">Continue Doc</button>
        </Link>
        <button className="delete-btn" onClick={(e) => handleDelete(doc._id)}>
          Delete
        </button>
      </Card.Body>
    </Card>
  ));
  return <div className="DocsList">{docCardEls}</div>;
}
