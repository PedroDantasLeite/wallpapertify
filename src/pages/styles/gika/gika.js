import React, { useEffect, useState, useCallback } from "react";
import "./gika.css";
import { getColors } from "react-native-image-colors";
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  PlayPauseIcon,
  SpeakerWaveIcon,
} from "@heroicons/react/20/solid";

export default function Gika({ nowPlaying }) {
  const [colors, setColors] = useState({
    muted: null,
    darkMuted: null,
    lightMuted: null,
    vibrant: null,
    darkVibrant: null,
    lightVibrant: null,
    dominant: null,
  });

  const updateColors = useCallback(async () => {
    const newColors = await getColors(nowPlaying.albumArt, {
      fallback: "#228B22",
      cache: true,
      key: nowPlaying.albumArt,
    });
    setColors(newColors);
    document.body.style.backgroundColor = newColors.muted;
  }, [nowPlaying.albumArt]);

  useEffect(() => {
    updateColors();
  }, [updateColors]);

  function timeLeft(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  }

  function updateFontSize(length) {
    if (length <= 22) return "48px";
    if (length <= 46) return "34px";
    if (length > 46) return "24px";
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
        <div>
          <div
            className="song"
            style={{
              color: colors.muted,
            }}
          >
            {nowPlaying.name}
          </div>
          <div className="guy" style={{ color: colors.muted }}>
            {nowPlaying.artist}
          </div>
        </div>
        <div>
          <div className="acimag">
            <div className="rectangla1 rounded bg-white" />
            <div
              className="rectangla2 rounded-3"
              style={{
                width: `${Math.floor(
                  (nowPlaying.currentTime / nowPlaying.length) * 100
                )}%`,
                backgroundColor: colors.muted,
              }}
            />
          </div>
          <div className="meucu">
            <div className="pequininihi" style={{ color: colors.muted }}>
              {timeLeft(nowPlaying.currentTime)}
            </div>
            <div className="pequininihi" style={{ color: colors.muted }}>
              {"-" + timeLeft(nowPlaying.length - nowPlaying.currentTime)}
            </div>
          </div>
        </div>
        <div className="comoseterido">
          <ChevronDoubleLeftIcon
            className="player"
            style={{
              backgroundColor: colors.lightMuted,
              color: colors.muted,
            }}
          />
          <PlayPauseIcon
            className="player"
            style={{
              backgroundColor: colors.lightMuted,
              color: colors.muted,
            }}
          />
          <ChevronDoubleRightIcon
            className="player"
            style={{
              backgroundColor: colors.lightMuted,
              color: colors.muted,
            }}
          />
        </div>
        <div className="flexadaa">
          <span className="spandosom">
            <SpeakerWaveIcon
              className="somzin"
              style={{ color: colors.muted }}
            />
          </span>
          <div className="acimag">
            <div className="rectangla1 rounded bg-white" />
            <div
              className="rectangla2 rounded"
              style={{
                width: `${nowPlaying.volume}%`,
                backgroundColor: colors.muted,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
