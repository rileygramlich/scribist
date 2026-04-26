import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import * as usersService from "../../utilities/users-service";

export default function GoogleSignInButton({ setUser }) {
  const [error, setError] = useState("");

  if (!process.env.REACT_APP_GOOGLE_CLIENT_ID) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          try {
            const user = await usersService.loginWithGoogle(credentialResponse.credential);
            setUser(user);
            setError("");
          } catch {
            setError("Google Sign-In Failed - Try Again");
          }
        }}
        onError={() => setError("Google Sign-In Failed - Try Again")}
      />
      {error ? <p className="error-message">{error}</p> : null}
    </div>
  );
}
