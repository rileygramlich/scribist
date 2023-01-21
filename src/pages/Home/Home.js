import { useState, React } from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

// CSS
import "./Home.css";

export default function Home({user}) {
  return (
    <main className="Home">
      <h1 className="title">{user.name}'s Home Page</h1>
      <div className="docs">
        <Button type="submit">
          <Link to="/docs/new">New Doc</Link>
        </Button>
        {/* use a array.map to create an array of docCardEls to render each one */}
        <Card style={{ width: "18rem" }}>
          <Card.Body>
            <Card.Title>Doc Name</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              Word Count
            </Card.Subtitle>
            <Card.Text>
              Doc.sections[0] Lorem ipsum dolor sit amet consectetur adipisicing
              elit. Neque itaque incidunt ea perspiciatis,
            </Card.Text>
            <Card.Link href="#">Continue Doc</Card.Link>
            <Card.Link href="#">Delete</Card.Link>
          </Card.Body>
        </Card>
        <Card style={{ width: "18rem" }}>
          <Card.Body>
            <Card.Title>Doc Name</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              Word Count
            </Card.Subtitle>
            <Card.Text>
              Doc.sections[0] Lorem ipsum dolor sit amet consectetur adipisicing
              elit. Neque itaque incidunt ea perspiciatis,
            </Card.Text>
            <Card.Link href="#">Continue Doc</Card.Link>
            <Card.Link href="#">Delete</Card.Link>
          </Card.Body>
        </Card>
        <Card style={{ width: "18rem" }}>
          <Card.Body>
            <Card.Title>Doc Name</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              Word Count
            </Card.Subtitle>
            <Card.Text>
              Doc.sections[0] Lorem ipsum dolor sit amet consectetur adipisicing
              elit. Neque itaque incidunt ea perspiciatis,
            </Card.Text>
            <Card.Link href="#">Continue Doc</Card.Link>
            <Card.Link href="#">Delete</Card.Link>
          </Card.Body>
        </Card>
        <Card style={{ width: "18rem" }}>
          <Card.Body>
            <Card.Title>Doc Name</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              Word Count
            </Card.Subtitle>
            <Card.Text>
              Doc.sections[0] Lorem ipsum dolor sit amet consectetur adipisicing
              elit. Neque itaque incidunt ea perspiciatis,
            </Card.Text>
            <Card.Link href="#">Continue Doc</Card.Link>
            <Card.Link href="#">Delete</Card.Link>
          </Card.Body>
        </Card>
      </div>
    </main>
  );
}
