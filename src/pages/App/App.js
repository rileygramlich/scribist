import "./App.css";
import React, { createContext, useState, useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { getUser } from "../../utilities/users-service";
import "bootstrap/dist/css/bootstrap.min.css";

import Home from "../Home/Home";
import AuthPage from "../AuthPage/AuthPage";
import Profile from "../Profile/Profile";
import NavBar from "../../components/NavBar/NavBar";
import Number from "../../components/Number/Number";
import Doc from "../Doc/Doc";
import Berserk from "../Berserk/Berserk";


export const ThemeContext = createContext(null);

export default function App() {
  const [user, setUser] = useState(getUser());
  const [theme, setTheme] = useState("dark");

  function toggleTheme() {
    console.log('changing theme')
    setTheme((curr) => (curr === "light" ? "dark" : "light"))
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <main className="App" id={theme}>
        <NavBar user={user} setUser={setUser} toggleTheme={toggleTheme}/>
        {user ? (
          <>
            <Routes>
              <Route path="/" element={<Home user={user} />} />
              <Route path="/docs/:docId" element={<Doc user={user}/>} />
              <Route path="/berserk" element={<Berserk user={user} />} />
              <Route path="/home/profile" element={<Profile />} />
              <Route path="/:num" element={<Number />} />
            </Routes>
          </>
        ) : (
          <AuthPage setUser={setUser} />
        )}
      </main>
    </ThemeContext.Provider>
  );
}
