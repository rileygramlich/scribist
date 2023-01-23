import React from 'react'
import { Card } from "react-bootstrap";

export default function DocsList({docs}) {
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
                <Card.Link href="#">Continue Doc</Card.Link>
                <Card.Link href="#">Delete</Card.Link>
              </Card.Body>
            </Card>
    ))
  return (
    <div className='DocsList'>
        {docCardEls}
    </div>
  )
}
