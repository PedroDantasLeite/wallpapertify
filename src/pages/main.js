import React, { useState, useEffect, useMemo } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import { getAccessToken, getRefreshToken } from "../api/spotifyApi";
import "./main.css";
import { Bars3Icon, InformationCircleIcon } from "@heroicons/react/20/solid";
import Pedro from "./styles/pedro/pedro";
import Gika from "./styles/gika/gika";
import MadeBy from "../components/madeBy";

export default function Main() {
  const [nowPlaying, setNowPlaying] = useState({});
  const [dropdownVisible, setDropodownVisible] = useState(false);
  const [madeByVisible, setMadeByVisible] = useState(false);
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
            isPlaying: response.is_playing,
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
      return <h3 className="margin-auto autozada">Awaiting song</h3>;
    switch (style) {
      case "Pedro":
        return <Pedro nowPlaying={nowPlaying} />;
      case "Gika":
        return <Gika nowPlaying={nowPlaying} />;
      default:
        return <h3>How?</h3>;
    }
  };

  function pauseResume() {
    nowPlaying.isPlaying ? spotifyApi.pause() : spotifyApi.play();
  }

  function toggleDropdown() {
    setDropodownVisible(!dropdownVisible);
    console.log("Dropdown Visible:", !dropdownVisible);
  }

  const StyleComponent = ({ pessoa }) => {
    const index = estilos.indexOf(pessoa);

    return (
      <div
        className={`d-flex align-items-center justify-content-center bg-white estilos 
        ${index === 0 ? "leftround" : "rightround"} ${
          dropdownVisible ? "slide-in" : "slide-out"
        } `}
        onClick={() => setStyle(pessoa)}
        type="button"
      >
        <span type="button" className="fontado text-center" key={pessoa}>
          {pessoa}
        </span>
      </div>
    );
  };

  return (
    <>
      <div
        className="d-flex justify-content-center position-absolute left-0 top-0 m-4"
        style={{ top: "16px" }}
      >
        <span
          className="cursor-pointer w-auto h-auto"
          type="button"
          onClick={toggleDropdown}
        >
          <Bars3Icon width={40} style={{ color: "white" }} />
        </span>
        {dropdownVisible &&
          estilos.map((pessoa) => <StyleComponent pessoa={pessoa} />)}
      </div>
      <span
        className="cursor-pointer w-auto h-auto position-absolute left-0 text-center topalgo m-4"
        type="button"
      >
        <InformationCircleIcon
          onMouseEnter={() => setMadeByVisible(true)}
          onMouseLeave={() => setMadeByVisible(false)}
          width={40}
          style={{ color: "white" }}
        />
      </span>
      {madeByVisible && <MadeBy />}
      {renderStyle()}
    </>
  );
}
