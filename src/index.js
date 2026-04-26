import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";
import App from "./pages/App/App";

const root = ReactDOM.createRoot(document.getElementById("root"));
const app = (
  <Router>
    <App />
  </Router>
);

root.render(
  <React.StrictMode>
    {process.env.REACT_APP_GOOGLE_CLIENT_ID ? (
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
        {app}
      </GoogleOAuthProvider>
    ) : (
      app
    )}
  </React.StrictMode>
);
