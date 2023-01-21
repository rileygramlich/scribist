import { useState, React } from "react";
import { Link } from "react-router-dom";
// Bootstrap imports
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

// CSS
import "./NavBar.css";

import * as userService from "../../utilities/users-service";

export default function NavBar({ user, setUser }) {
  function handleLogout() {
    userService.logout();
    setUser(null);
  }

  const [show, setShow] = useState(false);
  function showDropdown(e) {
    setShow(!show);
  }

  function hideDropdown(e) {
    setShow(false);
  }

  return (
    <Navbar className="Navbar" bg="light" expand="lg">
      <Container className="container-fluid">
        <Navbar.Brand className="logo" href="#home">
          <Link to="/home">Scribist</Link>
        </Navbar.Brand>
        <button className="dark-toggle">D</button>
        <form action="" className="search">
          <input type="text" name="search" value="search ..."/>
          {/* Add search functionality */}
        </form>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="container-fluid">
            <NavDropdown
              className="ml-auto"
              title="Utilities"
              id="basic-nav-dropdown"
              show={show}
              onMouseEnter={showDropdown}
              onMouseLeave={hideDropdown}
            >
              <NavDropdown.Item href="#action/3.1">
                <Link to="/docs/new">New Doc</Link>
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                <Link to="/notes/new">New Note</Link>
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">
                <Link to="/berserk">Berserk Mode</Link>
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.4">
                <Link to="/type-test">Test Typing Speed</Link>
              </NavDropdown.Item>
              <NavDropdown.Divider />
            </NavDropdown>
            <NavDropdown title="User" id="basic-nav-dropdown">
              <div>{user.name}</div>
              <div>{user.email}</div>
              <NavDropdown.Item href="#action/3.2">
                <Link to="/user/logout" onClick={handleLogout}>
                  Logout
                </Link>
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
