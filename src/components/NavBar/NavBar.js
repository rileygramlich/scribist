import React from "react";
import { Link } from "react-router-dom";
import * as userService from "../../utilities/users-service"

export default function NavBar({ user, setUser }) {

  function handleLogout() {
    userService.logout()
    setUser(null)
  }

  return (
    <nav>
      <Link to="/home/profile">Profile</Link>
      &nbsp; | &nbsp;
      <Link to="/home/new">New Order</Link>
      &nbsp;&nbsp;<span>Welcome, {user.name}</span>
      &nbsp;&nbsp;<Link to="" onClick={handleLogout}>Log Out</Link>
      <div className="test">😂</div>
    </nav>
  );
}
