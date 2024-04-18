import React, { useState, useEffect } from "react";
import "./pedro.css";
import { FastAverageColor } from "fast-average-color";

export default function Pedro({ nowPlaying }) {
  const [averageColor, setAverageColor] = useState();
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
        setAverageColor(color);
      };
    };
    updateImage(nowPlaying.albumArt);
  }, [nowPlaying]);

  return (
    <div className="imagediv">
      <img className="img" src={nowPlaying.albumArt} alt="Album" />
      <div className="acimap">
        <div className="rectangla1 bg-white rounded-3" />
        <div
          className="rectangla2"
          style={{
            width: `${Math.floor(
              (nowPlaying.currentTime / nowPlaying.length) * 100
            )}%`,
            backgroundColor: "black",
          }}
        />
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
