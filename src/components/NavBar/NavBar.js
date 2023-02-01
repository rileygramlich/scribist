import React, { useState } from "react";
import { Link } from "react-router-dom";
// Bootstrap imports
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

import { MdDarkMode } from "react-icons/md";

// CSS
import "../../pages/App/App.css";
import "./NavBar.css";

import * as userService from "../../utilities/users-service";

export default function NavBar({ user, setUser, toggleTheme, handleNewDoc }) {
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
        <div className="logo-n-button">
          <Navbar.Brand className="logo-contain">
            <Link className="logo" to="/">
              Scribist
            </Link>
          </Navbar.Brand>
          <button className="dark-toggle" onClick={toggleTheme}>
            <MdDarkMode />
          </button>
        </div>
        <form className="search">
          {/* <input type="text" name="search" placeholder="search ..." />
          Add search functionality */}
        </form>
        <div>
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
                    {user ? (
                      <button className="new-doc-btn" onClick={handleNewDoc}>
                        New Doc
                      </button>
                    ) : (
                      <Link to="/">Login</Link>
                    )}
                  </NavDropdown.Item>

                  <NavDropdown.Item className="drop-item">
                    <Link to="/berserk">Berserk Mode</Link>
                  </NavDropdown.Item>
                  <NavDropdown.Item className="drop-item">
                    <Link to="/typetest">Test Typing Speed</Link>
                  </NavDropdown.Item>
                  <NavDropdown.Item className="drop-item">
                    <Link to="/about">About</Link>
                  </NavDropdown.Item>
                </div>
              </NavDropdown>
              {user ? (
                <NavDropdown title="User" id="basic-nav-dropdown">
                  <div className="drop-contain">
                    <div>User: {user.name}</div>
                    <div>Email: {user.email}</div>
                    <NavDropdown.Divider />
                    <NavDropdown.Item>
                      <Link to="/user/logout" onClick={handleLogout}>
                        Logout
                      </Link>
                    </NavDropdown.Item>
                  </div>
                </NavDropdown>
              ) : (
                <NavDropdown title="User" id="basic-nav-dropdown">
                  <NavDropdown.Item>
                    <Link to="/">Login</Link>
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </div>
      </Container>
    </Navbar>
  );
}
