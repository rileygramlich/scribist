import "./App.css";
import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { getUser } from '../../utilities/users-service';
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from "../Home/Home";
import AuthPage from "../AuthPage/AuthPage";
import Profile from "../Profile/Profile";
import NavBar from "../../components/NavBar/NavBar";
import Number from "../../components/Number/Number";
import Doc from "../Doc/Doc";

export default function App() {
  const [user, setUser] = useState(getUser());


  return (
    <main className="App">
      {user ? (
        <>
          <NavBar user={user} setUser={setUser}/>
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/docs/new" element={<Doc />} />
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
