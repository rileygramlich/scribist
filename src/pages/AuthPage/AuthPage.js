import React from "react";
import SignUpForm from "../../components/SignUpForm/SignUpForm";
import LoginForm from "../../components/LoginForm/LoginForm";
import { Link } from "react-router-dom";
import {useDispatch} from 'react-redux'


import { useState } from "react";
import { Button } from "react-bootstrap";

export default function AuthPage({ setUser }) {
  const [showLogin, setShowLogin] = useState(true);
  // const dispatch = useDispatch()

  // console.log(process.env.GOOGLE_CLIENT_ID);

  function handleShow() {
    let status = !showLogin;
    setShowLogin(status);
  }

  // async function googleSuccess(res) {
  //   const result = res?.profileObj
  //   const token = res?.toekenId

  //   try {
  //     dispatch({type: 'AUTH', data: { result, token }});
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  // function googleFailure(error) {
  //   console.log(error)
  //   console.log("google sign in was unsuccessful.");
  // }

  return (
    <main className="AuthPage">
      {/* <h1>AuthPage</h1> */}
      <button onClick={handleShow}>{showLogin ? "Don't have an account with us?" : "Already a user."}</button>
      {showLogin ? (
        <LoginForm setUser={setUser} />
      ) : (
        <SignUpForm setUser={setUser} />
      )}
      {/* <div className="Google">
        <GoogleLogin
          clientId="952976319526-hvqsfe5spc7er6j94l8id3v8474lpdig.apps.googleusercontent.com"
          render={(renderProps) => (
            <Button
              className="classes.googleButton"
              color="primary"
              fullwidth
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
              variet="contained"
            >
              Sign in with Google
            </Button>
          )}
          onSuccess={googleSuccess}
          onFailure={googleFailure}
          cookiePolicy="single_host_origin"
        />
      </div> */}
    </main>
  );
}
