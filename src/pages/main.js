import React, { useState, useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import { getAccessToken, getRefreshToken } from "../api/spotifyApi";
import "./main.css";
import { Bars3Icon } from "@heroicons/react/20/solid";
import Pedro from "./styles/pedro";
import { Container } from "react-bootstrap";

export default function Main() {
  const [nowPlaying, setNowPlaying] = useState({});
  const spotifyApi = new SpotifyWebApi();

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
      },
      () => {
        getAccessToken(localStorage.getItem("refreshToken")).then((data) => {
          spotifyApi.setAccessToken(data);
          getNowPlaying();
        });
      }
    );
  };

  return (
    <>
      {(nowPlaying.name && (
        <>
          <Container
            type="button"
            className="w-auto h-auto position-absolute left-0 top-0 m-4 cursor-pointer"
          >
            <Bars3Icon width={35} stroke="white" stroke-width="0.7" />
          </Container>
          <Pedro nowPlaying={nowPlaying} />
        </>
      )) || <h3>waiting song..</h3>}
    </>
  );
}
