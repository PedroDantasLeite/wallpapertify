import React, { useState, useEffect, useMemo } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import { getAccessToken, getRefreshToken } from "../api/spotifyApi";
import "./main.css";
import { Bars3Icon, InformationCircleIcon } from "@heroicons/react/20/solid";
import { Container } from "react-bootstrap";
import Pedro from "./styles/pedro/pedro";
import Gika from "./styles/gika/gika";

export default function Main() {
  const [nowPlaying, setNowPlaying] = useState({});
  const [dropdownVisible, setDropodownVisible] = useState(false);
  const [MadeBy, setMadeBy] = useState(false);
  const [style, setStyle] = useState("Gika");
  const estilos = ["Pedro", "Gika"];

  const spotifyApi = useMemo(() => new SpotifyWebApi(), []);

  useEffect(() => {
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
            volume: response.device.volume_percent,
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
      }, 1000); // update every  second
      return () => clearInterval(interval);
    };

    fetchRefreshToken();
  }, [spotifyApi]);

  const renderStyle = () => {
    if (!nowPlaying.name)
      return <h3 className="margin-auto autozada">waiting song..</h3>;
    switch (style) {
      case "Pedro":
        return <Pedro nowPlaying={nowPlaying} />;
      case "Gika":
        return <Gika nowPlaying={nowPlaying} />;
      default:
        return <h3>How?</h3>;
    }
  };

  function pauseSong() {
    spotifyApi.pause();
  }

  return (
    <>
      <Container className="w-auto h-auto position-absolute left-0 d-flex top-0 m-4">
        <span className="cursor-pointer menuicon w-auto h-auto" type="button">
          <Bars3Icon
            onClick={() => setDropodownVisible(!dropdownVisible)}
            width={40}
            style={{ color: "white" }}
          />
        </span>
        {dropdownVisible && (
          <div className="text-center px-2 w-max justify-content-center h-auto bg-white padzada rounded">
            {estilos.map((pessoa) => (
              <div
                type="button"
                className="fontado px-2 py-1 cursor-pointer"
                onClick={() => setStyle(pessoa)}
                key={pessoa}
              >
                {pessoa}
              </div>
            ))}
          </div>
        )}
      </Container>
      <Container className="w-auto h-auto position-absolute left-0 text-center topalgo m-4">
        <span className="cursor-pointer menuicon w-auto h-auto" type="button">
          <InformationCircleIcon
            onMouseEnter={() => setMadeBy(true)}
            onMouseLeave={() => setMadeBy(false)}
            width={40}
            style={{ color: "white" }}
          />
        </span>
      </Container>
      {MadeBy && <div className="w-auto h-auto">Made By Pedro</div>}
      {renderStyle()}
    </>
  );
}
