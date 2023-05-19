import React, { useState, useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import { getAccessToken, getRefreshToken } from "../api/spotifyApi";
import "./main.css";
import { FastAverageColor } from "fast-average-color";
import chroma from "chroma-js";

export default function Main() {
  const [nowPlaying, setNowPlaying] = useState({});
  const [averageColor, setAverageColor] = useState();
  const [compColor, setCompColor] = useState([]);
  const spotifyApi = new SpotifyWebApi();
  const fac = new FastAverageColor();
  if (averageColor) {
    document.body.style.backgroundColor = averageColor.hex;
  }
  console.log(averageColor);

  useEffect(() => {
    if (!localStorage.getItem("refreshToken")) {
      const fetchRefreshToken = async () => {
        await getRefreshToken().then((success) => {
          localStorage.setItem("refreshToken", success.refresh_token);
          spotifyApi.setAccessToken(success.access_token);
        });
      };
      fetchRefreshToken();
    }
  }, [spotifyApi]);

  useEffect(() => {
    const updateSong = () => {
      const interval = setInterval(() => {
        getNowPlaying();
      }, 3000); // update every 3 seconds
      return () => clearInterval(interval);
    };
    updateSong();
  }, []);

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
        if (nowPlaying.name !== response.item.name) {
          updateImage(response.item.album.images[0].url);
        }
      },
      () => {
        getAccessToken(localStorage.getItem("refreshToken")).then((data) => {
          spotifyApi.setAccessToken(data);
          getNowPlaying();
        });
      }
    );
  };

  const updateImage = (art) => {
    const img = new Image();
    img.src = art;
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const color = fac.getColor(img);
      setCompColor(
        chroma(color.hex)
          .set("hsl.h", (chroma(color.hex).get("hsl.h") + 180) % 360)
          .darken(0.5)
          .hex()
      );
      setAverageColor(color);
    };
  };

  return (
    <>
      {(nowPlaying.name && (
        <div className="imagediv">
          <img
            className="img rounded-4"
            src={nowPlaying.albumArt}
            alt="Album"
          />
          <div className="d-flex">
            <div className="smool" />
            <div
              style={{
                width: `${Math.floor(
                  (nowPlaying.currentTime / nowPlaying.length) * 370
                )}px`,
                backgroundColor: `${compColor}`,
              }}
              className="rectangle"
            ></div>
            <div className="smool" />
          </div>
          <div className="text-center namesong text-black">
            {nowPlaying.name}
          </div>
          <div className="text-center nameartist text-black">
            {nowPlaying.artist}
          </div>
        </div>
      )) || <h3>loading</h3>}
    </>
  );
}
