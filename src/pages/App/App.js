import "./App.css";
import React, { createContext, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { getUser } from "../../utilities/users-service";
import "bootstrap/dist/css/bootstrap.min.css";

import "quill/dist/quill.snow.css";

import Home from "../Home/Home";
import AuthPage from "../AuthPage/AuthPage";
import NavBar from "../../components/NavBar/NavBar";
import Doc from "../Doc/Doc";
import Berserk from "../Berserk/Berserk";
import TypeTest from "../TypeTest/TypeTest";
import About from "../About/About";
import Footer from "../../components/Footer/Footer";

import * as docsAPI from "../../utilities/docs-api";

export const ThemeContext = createContext(null);

export default function App() {
  const [user, setUser] = useState(getUser());
  const [theme, setTheme] = useState("dark");

  const navigate = useNavigate();

  function toggleTheme() {
    setTheme((curr) => (curr === "light" ? "dark" : "light"));
  }

  async function handleNewDoc() {
    const docId = await docsAPI.create();
    navigate(`/docs/${docId}`);
    // await docsAPI.getDoc(docId)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <main className="App" id={theme}>
        <NavBar
          user={user}
          setUser={setUser}
          toggleTheme={toggleTheme}
          handleNewDoc={handleNewDoc}
        />
        {user ? (
          <>
            <Routes>
              <Route
                path="/"
                element={<Home user={user} handleNewDoc={handleNewDoc} />}
              />
              <Route exact path="/berserk" element={<Berserk />} />
              <Route exact path="/typetest" element={<TypeTest />} />
              <Route exact path="/about" element={<About />} />
              <Route path="/docs/:docId" element={<Doc user={user} />} />
              <Route path="/*" element={<AuthPage setUser={setUser} />} />
            </Routes>
          </>
        ) : (
          <Routes>
            <Route exact path="/berserk" element={<Berserk />} />
            <Route exact path="/typetest" element={<TypeTest />} />
            <Route exact path="/about" element={<About />} />
            <Route path="/auth-page" element={<AuthPage setUser={setUser} />} />
            <Route path="/" element={<AuthPage setUser={setUser} />} />
            <Route
              path="/docs/:docId"
              element={<AuthPage setUser={setUser} />}
            />
            <Route path="/*" element={<AuthPage setUser={setUser} />} />
          </Routes>
        )}
        <Footer />
      </main>
    </ThemeContext.Provider>
  );
}
