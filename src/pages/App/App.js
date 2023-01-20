import "./App.css";
import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { getUser } from '../../utilities/users-service';

import Home from "../Home/Home";
import AuthPage from "../AuthPage/AuthPage";
import Profile from "../Profile/Profile";
import NavBar from "../../components/NavBar/NavBar";
import Number from "../../components/Number/Number";

export default function App() {
  const [user, setUser] = useState(getUser());


  return (
    <main className="App">
      <h1 className="hello">Welcome to Scribist</h1>
      {user ? (
        <>
          <NavBar user={user} setUser={setUser}/>
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/home/profile" element={<Profile />} />
            <Route path="/:num" element={<Number />} />
          </Routes>
        </>
      ) : (
        <AuthPage setUser={setUser}/>
      )}
    </main>
  );
}
