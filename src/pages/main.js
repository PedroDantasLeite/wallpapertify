import React, { useState, useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import { getAccessToken, getRefreshToken } from "../api/spotifyApi";
import "./main.css";
import { Bars3Icon } from "@heroicons/react/20/solid";
import { Container } from "react-bootstrap";
import Pedro from "./styles/pedro/pedro";
import Gika from "./styles/gika/gika";

export default function Main() {
  const [nowPlaying, setNowPlaying] = useState({});
  const [dropdownVisible, setDropodownVisible] = useState(false);
  const [style, setStyle] = useState("Pedro");

  const estilos = ["Pedro", "Gika", "Algm"];

  useEffect(() => {
    const spotifyApi = new SpotifyWebApi();
    const fetchRefreshToken = async () => {
      if (!localStorage.getItem("refreshToken"))
        await getRefreshToken().then((success) => {
          localStorage.setItem("refreshToken", success.refresh_token);
          spotifyApi.setAccessToken(success.access_token);
        });
      updateSong();
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
        },
        () => {
          getAccessToken(localStorage.getItem("refreshToken")).then((data) => {
            spotifyApi.setAccessToken(data);
          });
        }
      );
    };

    const updateSong = () => {
      const interval = setInterval(() => {
        getNowPlaying();
      }, 3000); // update every 3 seconds
      return () => clearInterval(interval);
    };

    fetchRefreshToken();
  }, []);

  const renderStyle = () => {
    if (!nowPlaying.name) return <h3>waiting song..</h3>;
    switch (style) {
      case "Pedro":
        return <Pedro nowPlaying={nowPlaying} />;
      case "Gika":
        return <Gika nowPlaying={nowPlaying} />;
      default:
        return <h3>How?</h3>;
    }
  };

  return (
    <>
      <Container className="w-auto h-auto position-absolute left-0 top-0 m-4">
        <span className="cursor-pointer w-auto h-auto" type="button">
          <Bars3Icon
            onClick={() => setDropodownVisible(!dropdownVisible)}
            width={35}
            stroke="white"
            strokeWidth="0.6"
          />
        </span>
        {dropdownVisible && (
          <div className="text-center w-max h-auto mt-2 bg-white rounded">
            {estilos.map((pessoa) => (
              <div
                type="button"
                className="w-max py-1 mx-4 cursor-pointe color bg-gray-300"
                onClick={() => setStyle(pessoa)}
                key={pessoa}
              >
                {pessoa}
              </div>
            ))}
          </div>
        )}
      </Container>
      {renderStyle()}
    </>
  );
}
