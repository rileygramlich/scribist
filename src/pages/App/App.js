import "./App.css";
import React, { createContext, useState, useContext, useParams } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { getUser } from "../../utilities/users-service";
import "bootstrap/dist/css/bootstrap.min.css";

import Home from "../Home/Home";
import AuthPage from "../AuthPage/AuthPage";
import Profile from "../Profile/Profile";
import NavBar from "../../components/NavBar/NavBar";
import Number from "../../components/Number/Number";
import Doc from "../Doc/Doc";
import Berserk from "../Berserk/Berserk";
import About from "../About/About";

import * as docsAPI from "../../utilities/docs-api";

export const ThemeContext = createContext(null);


export default function App() {
  const [user, setUser] = useState(getUser());
  const [theme, setTheme] = useState("dark");
  
  const navigate = useNavigate()

  function toggleTheme() {
    console.log('changing theme')
    setTheme((curr) => (curr === "light" ? "dark" : "light"))
  }

  async function handleNewDoc() {
    console.log('handling')
    const docId = await docsAPI.create();
    console.log('redirecting:' + docId)
    navigate(`/docs/${docId}`)
    // await docsAPI.getDoc(docId)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <main className="App" id={theme}>
        <NavBar user={user} setUser={setUser} toggleTheme={toggleTheme} handleNewDoc={handleNewDoc}/>
        {user ? (
          <>
            <Routes>
              <Route path="/" element={<Home user={user} handleNewDoc={handleNewDoc}/>} />
              <Route path="/docs/:docId" element={<Doc user={user}/>} />
              <Route path="/berserk" element={<Berserk user={user} />} />
              <Route path="/about" element={<About user={user}/>} />
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
