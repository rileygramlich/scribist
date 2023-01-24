import { useState, React } from "react";
import { Link } from "react-router-dom";
// Bootstrap imports
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

// CSS
import "../../pages/App/App.css";
import "./NavBar.css";

import * as userService from "../../utilities/users-service";

export default function NavBar({ user, setUser, toggleTheme }) {
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
    <Navbar className="Navbar" expand="lg" id="Nav">
      <Container className="container-fluid">
        <Navbar.Brand className="logo-contain">
          <Link className="logo" to="/">
            Scribist
          </Link>
        </Navbar.Brand>
        <button className="dark-toggle" onClick={toggleTheme}>
          D
        </button>
        <form action="" className="search">
          <input type="text" name="search" value="search ..." />
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
              <div className="drop-contain">
                <NavDropdown.Item className="drop-item">
                  <Link className="drop-item" to="/docs/new">
                    New Doc
                  </Link>
                </NavDropdown.Item>
                <NavDropdown.Item className="drop-item">
                  <Link to="/notes/new">New Note</Link>
                </NavDropdown.Item>
                <NavDropdown.Item className="drop-item">
                  <Link to="/berserk">Berserk Mode</Link>
                </NavDropdown.Item>
                <NavDropdown.Item className="drop-item">
                  <Link to="/type-test">Test Typing Speed</Link>
                </NavDropdown.Item>
                <NavDropdown.Divider />
              </div>
            </NavDropdown>
            {user ? (
              <NavDropdown title="User" id="basic-nav-dropdown">
                <div className="drop-contain">
                  <div>{user.name}</div>
                  <div>{user.email}</div>
                  <NavDropdown.Item href="#action/3.2">
                    <Link to="/user/logout" onClick={handleLogout}>
                      Logout
                    </Link>
                  </NavDropdown.Item>
                </div>
              </NavDropdown>
            ) : (
              <NavDropdown title="User" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.2">
                  <Link to="/">Login</Link>
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
