import React, { useState, useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import { refreshAccessToken, getRefreshToken } from "../api/spotifyApi";
import "./main.css";
import { FastAverageColor } from "fast-average-color";

export default function Main() {
  const [nowPlaying, setNowPlaying] = useState({});
  const [refreshToken, setRefreshToken] = useState("");
  const [averageColor, setAverageColor] = useState();
  const spotifyApi = new SpotifyWebApi();
  const fac = new FastAverageColor();
  if (averageColor) {
    document.body.style.backgroundColor = averageColor.hex;
  }

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
    }, 3000); // update every 3 seconds
    return () => clearInterval(interval);
  };

  const getNowPlaying = () => {
    spotifyApi.getMyCurrentPlaybackState().then(
      (response) => {
        setNowPlaying({
          name: response.item.name,
          artist: response.item.artists[0].name,
          albumArt: response.item.album.images[0].url,
          length: response.item.duration_ms,
          currentTime: response.progress_ms,
        });
        const img = new Image();
        img.src = response.item.album.images[0].url;
        img.crossOrigin = "Anonymous";
        img.onload = () => {
          setAverageColor(fac.getColor(img));
        };
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

  console.log(
    `w-${Math.floor(
      (nowPlaying.currentTime / nowPlaying.length) * 370
    )}px rectangle rounded-4 border border-dark`
  );

  return (
    <>
      <div className="imagediv">
        <img className="img rounded-4" src={nowPlaying.albumArt} alt="Album" />
        <div className="d-flex">
          <div
            //style={`width: ${Math.floor(
            // (nowPlaying.currentTime / nowPlaying.length) * 370
            //)}px`}
            className="rectangle rounded-4 border border-dark"
          ></div>
          <div className="rectangle rounded-4 border border-dark"></div>
        </div>
        <div className="text-center namesong">{nowPlaying.name}</div>
        <div className="text-center nameartist">{nowPlaying.artist}</div>
        <div>{nowPlaying.length}</div>
        <div>{nowPlaying.currentTime}</div>
      </div>
    </>
  );
}
