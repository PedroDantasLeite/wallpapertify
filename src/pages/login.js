import React from "react";
import { Container } from "react-bootstrap";

const AUTH_URL =
  "https://accounts.spotify.com/authorize?client_id=10338d7a66914823895ab10c1b2ef1ab&response_type=code&redirect_uri=https://pedrodantasleite.github.io/wallpapertify/&scope=user-read-private%20user-read-currently-playing%20user-read-recently-played%20user-read-playback-state";

export default function Login() {
  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <a className="btn btn-success btn-lg" href={AUTH_URL}>
        Login With Spotify
      </a>
    </Container>
  );
}
