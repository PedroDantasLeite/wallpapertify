import React, { useState, useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import { refreshAccessToken, getRefreshToken } from "../api/spotifyApi";
import "./main.css";

export default function Main() {
  const [nowPlaying, setNowPlaying] = useState({});
  const [refreshToken, setRefreshToken] = useState("");
  const [averageColor, setAverageColor] = useState();
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

  console.log(averageColor);

  const updateSong = () => {
    const interval = setInterval(() => {
      getNowPlaying();
    }, 3000); // update every 3 second
    return () => clearInterval(interval);
  };

  const getNowPlaying = () => {
    spotifyApi.getMyCurrentPlaybackState().then(
      (response) => {
        setNowPlaying({
          name: response.item.name,
          artist: response.item.artists[0].name,
          albumArt: response.item.album.images[0].url,
        });
      },
      (error) => {
        if (error.status === 401) {
          refreshAccessToken(refreshToken).then((data) => {
            spotifyApi.setAccessToken(data.access_token);
            getNowPlaying();
          });
        }
      }
    );
  };

  return (
    <>
      <div className="imagediv">
        <img className="img rounded-5" src={nowPlaying.albumArt} alt="Album" />
        <div className="rectangle rounded-4 border border-dark"></div>
        <div className="text-center namesong">{nowPlaying.name}</div>
        <div className="text-center nameartist">{nowPlaying.artist}</div>
      </div>
    </>
  );
}
