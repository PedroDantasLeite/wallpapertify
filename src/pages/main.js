import React, { useState, useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import { getAccessToken, getRefreshToken } from "../api/spotifyApi";
import "./main.css";
import { FastAverageColor } from "fast-average-color";
import chroma from "chroma-js";

export default function Main() {
  const [nowPlaying, setNowPlaying] = useState({});
  const [refreshToken, setRefreshToken] = useState("");
  const [averageColor, setAverageColor] = useState();
  const [triadColor, setTriadColor] = useState([]);
  const spotifyApi = new SpotifyWebApi();
  const fac = new FastAverageColor();

  if (averageColor) {
    document.body.style.backgroundColor = averageColor.hex;
  }

  const fetchRefreshToken = async () => {
    await getRefreshToken().then((success) => {
      localStorage.setItem("refreshToken", success.refresh_token);
      setRefreshToken(success.refresh_token);
      spotifyApi.setAccessToken(success.access_token);
    });
  };

  useEffect(() => {
    if (!localStorage.getItem("refreshToken")) {
      fetchRefreshToken();
    }
  }, [spotifyApi]);

  useEffect(() => {
    updateSong();
  }, []);

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
          const color = fac.getColor(img);
          setTriadColor(
            chroma
              .scale([
                color.hex,
                chroma(color.hex).set("hsl.h", "+120"),
                chroma(color.hex).set("hsl.h", "-120"),
              ])
              .colors()
          );
          setAverageColor(color);
        };
      },
      (error) => {
        getAccessToken(localStorage.getItem("refreshToken")).then((data) => {
          spotifyApi.setAccessToken(data);
          getNowPlaying();
        });
      }
    );
  };

  return (
    <>
      <div className="imagediv">
        <img className="img rounded-4" src={nowPlaying.albumArt} alt="Album" />
        <div className="d-flex">
          <div
            style={{
              width: `${Math.floor(
                (nowPlaying.currentTime / nowPlaying.length) * 370
              )}px`,
              backgroundColor: `${triadColor[2]}`,
            }}
            className="rectangle rounded-4"
          ></div>
        </div>
        <div className="text-center namesong text-black">{nowPlaying.name}</div>
        <div className="text-center nameartist text-black">
          {nowPlaying.artist}
        </div>
      </div>
    </>
  );
}
