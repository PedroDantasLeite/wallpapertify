const clientID = process.env.REACT_APP_CLIENT_ID;
const clientSecret = process.env.REACT_APP_CLIENT_SECRET;
const redirectUri = process.env.REACT_APP_REDIRECT_URI;

const getRefreshToken = async () => {
  const code = new URLSearchParams(window.location.search).get("code");
  if (!code) {
    throw new Error("Authorization code not found");
  }
  const authParameters = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=authorization_code&code=${new URLSearchParams(
      window.location.search
    ).get(
      "code"
    )}&redirect_uri=${redirectUri}&client_id=${clientID}&client_secret=${clientSecret}`,
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

const refreshAccessToken = async (refreshToken) => {
  const url = "https://accounts.spotify.com/api/token";

  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: "Basic " + btoa(clientID + ":" + clientSecret),
  };

  const data = {
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  };

  const response = await fetch(url, {
    method: "POST",
    headers: headers,
    body: new URLSearchParams(data),
  });

  const responseData = await response.json();

  if (responseData.error) {
    throw new Error(responseData.error_description);
  }

  return responseData.access_token;
};

export { getRefreshToken, refreshAccessToken };
