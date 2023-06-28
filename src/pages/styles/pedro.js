import React, { useState, useEffect } from "react";
import "./pedro.css";
import { FastAverageColor } from "fast-average-color";
import chroma from "chroma-js";

export default function Pedro({ nowPlaying }) {
  const [averageColor, setAverageColor] = useState();
  const [compColor, setCompColor] = useState([]);

  if (averageColor) {
    document.body.style.backgroundColor = averageColor.hex;
  }

  useEffect(() => {
    const fac = new FastAverageColor();
    const updateImage = (art) => {
      const img = new Image();
      img.src = art;
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const color = fac.getColor(img);
        setCompColor(
          chroma(color.hex)
            .set("hsl.h", (chroma(color.hex).get("hsl.h") + 180) % 360)

            .hex()
        );
        setAverageColor(color);
      };
    };
    updateImage(nowPlaying.albumArt);
  }, [nowPlaying]);

  return (
    <div className="imagediv">
      <img className="img rounded-4" src={nowPlaying.albumArt} alt="Album" />
      <div className="d-flex">
        <div className="smool" />
        <div
          style={{
            width: `${Math.floor(
              (nowPlaying.currentTime / nowPlaying.length) * 305
            )}px`,
            backgroundColor: `${compColor}`,
          }}
          className="rectangle border border-dark"
        ></div>
        <div className="smool" />
      </div>
      <div className="text-center namesong text-white border-white border-2">
        {nowPlaying.name}
      </div>
      <div className="text-center nameartist text-white">
        {nowPlaying.artist}
      </div>
    </div>
  );
}
