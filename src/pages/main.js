import React, { useState, useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import { refreshAccessToken, getRefreshToken } from "../api/spotifyApi";

export default function Main() {
  const [nowPlaying, setNowPlaying] = useState({});
  const [refreshToken, setRefreshToken] = useState("");
  const spotifyApi = new SpotifyWebApi();

  useEffect(() => {
    if (refreshToken) return;
    const fetchRefreshToken = async () => {
      const token = await getRefreshToken();
      setRefreshToken(token.refresh_token);
      spotifyApi.setAccessToken(token.access_token);
    };
    fetchRefreshToken();
  }, [spotifyApi]);

  const getNowPlaying = () => {
    spotifyApi.getMyCurrentPlaybackState().then((response) => {
      setNowPlaying({
        name: response.item.name,
        artist: response.item.artists[0].name,
        albumArt: response.item.album.images[0].url,
      });
    });
  };

  return (
    <>
      <button onClick={getNowPlaying}></button>
      {nowPlaying.name}
    </>
  );
}
