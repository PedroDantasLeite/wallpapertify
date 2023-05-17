import axios from "axios";
import { Buffer } from "buffer";
const clientID = process.env.REACT_APP_CLIENT_ID;
const clientSecret = process.env.REACT_APP_CLIENT_SECRET;
const redirectUri = process.env.REACT_APP_REDIRECT_URI;

const getRefreshToken = async () => {
  let code = new URLSearchParams(window.location.search).get("code");
  if (!code) {
    throw new Error("Authorization code not found");
  }
  const authParameters = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=authorization_code&code=${code}&redirect_uri=${redirectUri}&client_id=${clientID}&client_secret=${clientSecret}`,
  };
  const response = await fetch(
    "https://accounts.spotify.com/api/token",
    authParameters
  );
  const data = await response.json();

  if (data.error) {
    throw new Error(data.error_description);
  }

  return data;
};

const getAccessToken = async (refreshToken) => {
  const credentials = {
    clientId: clientID,
    clientSecret: clientSecret,
    redirectUri: redirectUri,
  };

  const authHeader = Buffer.from(
    `${credentials.clientId}:${credentials.clientSecret}`
  ).toString("base64");
  const refreshTokenUrl = "https://accounts.spotify.com/api/token";

  try {
    const { data } = await axios.post(
      refreshTokenUrl,
      new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${authHeader}`,
        },
      }
    );

    const accessToken = data.access_token;
    return accessToken;
  } catch (err) {
    console.error("Failed to refresh access token", err);
    return null;
  }
};

export { getRefreshToken, getAccessToken };
