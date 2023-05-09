import React, { useState, useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import { refreshAccessToken, getRefreshToken } from "../api/spotifyApi";
import "./main.css";
import { Container } from "react-bootstrap";

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
    updateSong();
  }, [spotifyApi]);

  const updateSong = () => {
    const interval = setInterval(() => {
      getNowPlaying();
    }, 3000); // update every 3 second
    return () => clearInterval(interval);
  };

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
      <div className="image">
        <img source={nowPlaying.albumArt} />
      </div>
    </>
  );
}
