import React from 'react'
import { Card } from "react-bootstrap";

export default function DocsList({docs, handleDelete}) {
    const docCardEls = docs.map(doc => (
        <Card style={{ width: "18rem" }}>
            {console.log(doc)}
              <Card.Body>
                <Card.Title>{doc.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {doc.wordCount}
                </Card.Subtitle>
                <Card.Text>
                  {doc.content}
                </Card.Text>
                <Card.Link >Continue Doc</Card.Link>
                <button onClick={(e) => handleDelete(doc._id)}>Delete</button>
              </Card.Body>
            </Card>
    ))
  return (
    <div className='DocsList'>
        {docCardEls}
    </div>
  )
}
