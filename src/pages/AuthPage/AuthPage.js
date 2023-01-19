import React from 'react'
import SignUpForm from '../../components/SignUpForm/SignUpForm'
import LoginForm from '../../components/LoginForm/LoginForm'

import { useState } from 'react'

export default function AuthPage({setUser}) {
  const [showLogin, setShowLogin] = useState(true)

  function handleShow() {
    let status = !showLogin;
    setShowLogin(status);
  }

  return (
    <main>
      <h1>AuthPage</h1>
      <button onClick={handleShow}>{showLogin ? "Sign-up" : "Login"}</button>
      {showLogin ? <LoginForm setUser={setUser}/> : <SignUpForm setUser={setUser}/>}
    </main>
  )
}
