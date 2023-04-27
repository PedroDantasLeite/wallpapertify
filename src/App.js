import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap'
import { useEffect, useState } from 'react';
import Login from './login';
import Main from './main';

const CLIENT_ID = '10338d7a66914823895ab10c1b2ef1ab'
const CLIENT_SECRET = 'a6a1bb132baa4c0ea03de5bd7fbd9e94'

const code = new URLSearchParams(window.location.search).get("code")

function App() {
  const [accessToken, setAccessToken]  = useState('')

  useEffect (() => {
    var authParameters ={
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
    }
    fetch('https://accounts.spotify.com/api/token', authParameters)
      .then(
        result => result.json()
      )
      .then(data => setAccessToken(data.access_token))
  }, [])

  function getCurrentPlayed () {}

  return code ? <Main accessToken={accessToken} /> : <Login />
}

export default App;
