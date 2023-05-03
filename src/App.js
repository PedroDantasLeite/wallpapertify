import logo from "./logo.svg";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import { useEffect, useState } from "react";
import Login from "./login";
import Main from "./main";

const code = new URLSearchParams(window.location.search).get("code");

function App() {
  const [refreshToken, setRefreshToken] = useState("");

  const clientID = process.env.REACT_APP_CLIENT_ID;
  const clientSecret = process.env.REACT_APP_CLIENT_SECRET;
  const redirectUri = process.env.REACT_APP_REDIRECT_URI;

  useEffect(() => {
    console.log(redirectUri, "<- redirect uri");
    var authParameters = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=authorization_code&code=${code}&redirect_uri=${redirectUri}&client_id=${clientID}&client_secret=${clientSecret}`,
    };
    fetch("https://accounts.spotify.com/api/token", authParameters)
      .then((result) => result.json())
      .then((data) => setRefreshToken(data));
  }, []);

  return code ? <Main refreshToken={refreshToken} /> : <Login />;
}

export default App;
