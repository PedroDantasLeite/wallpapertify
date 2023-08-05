import React, { useEffect, useState } from "react";
import "./gika.css";
import { getColors } from "react-native-image-colors";

export default function Gika({ nowPlaying }) {
  const [colors, setColors] = useState({
    darkMuted: null,
    darkVibrant: null,
    dominant: null,
    lightMuted: null,
    lightVibrant: null,
    muted: null,
    vibrant: null,
  });

  useEffect(() => {
    getColors(nowPlaying.albumArt, {
      fallback: "#228B22",
      cache: true,
      key: nowPlaying.albumArt,
    }).then(setColors);
    document.body.style.backgroundColor = colors.muted;
  }, [colors, nowPlaying.albumArt]);

  function timeLeft(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  }

  return (
    <div
      className="imagediva rounded-4"
      style={{
        boxShadow: "0px 4px 4px 0px",
        backgroundColor: colors.lightMuted,
      }}
    >
      <img src={nowPlaying.albumArt} className="imga rounded-4" alt="album" />
      <div className="letss">
        <div className="song" style={{ color: colors.muted }}>
          {nowPlaying.name}
        </div>
        <div className="guy" style={{ color: colors.muted }}>
          {nowPlaying.artist}
        </div>
        <span className="acima">
          <div className="rectangla1 rounded bg-white" />
          <div
            className="rectangla2 rounded"
            style={{
              width: `${Math.floor(
                (nowPlaying.currentTime / nowPlaying.length) * 100
              )}%`,
              backgroundColor: colors.muted,
            }}
          />
        </span>
        <div className="meucu">
          <div className="pequininihi" style={{ color: colors.muted }}>
            {timeLeft(nowPlaying.currentTime)}
          </div>
          <div className="pequininihi" style={{ color: colors.muted }}>
            {"-" + timeLeft(nowPlaying.length - nowPlaying.currentTime)}
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
}
