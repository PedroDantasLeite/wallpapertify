import React, { useEffect, useState } from "react";
import chroma from "chroma-js";
import "./gika.css";

export default function Gika({ nowPlaying }) {
  const [colors, setColors] = useState([]);

  // document.body.style.backgroundColor = colors[0];

  useEffect(() => {
    // let image = document.getElementById("image");
    // setColors(chroma.scale().colors(5));
    // console.log(image);
  }, []);

  return (
    <div className="imagediva border rounded-4">
      <img src={nowPlaying.albumArt} className="imga rounded-4" />
      <div className="letss">
        <div className="song ">{nowPlaying.name}</div>
        <div className="guy">{nowPlaying.artist}</div>
        <div
          className="rectangla rounded"
          style={{
            width: `${Math.floor(
              (nowPlaying.currentTime / nowPlaying.length) * 305
            )}px`,
            backgroundColor: "black",
          }}
        ></div>
      </div>
    </div>
  );
}
