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

  function timeLeft(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  }

  return (
    <div
      className="imagediva rounded-4"
      style={{ boxShadow: "0px 4px 4px 0px" }}
    >
      <img src={nowPlaying.albumArt} className="imga rounded-4" />
      <div className="letss">
        <div className="song ">{nowPlaying.name}</div>
        <div className="guy">{nowPlaying.artist}</div>
        <span className="acima">
          <div className="rectangla1 rounded bg-white" />
          <div
            className="rectangla2 rounded"
            style={{
              width: `${Math.floor(
                (nowPlaying.currentTime / nowPlaying.length) * 100
              )}%`,
              backgroundColor: "black",
            }}
          />
        </span>
        <div className="meucu">
          <div className="pequininihi">{timeLeft(nowPlaying.currentTime)}</div>
          <div className="pequininihi">
            {"-" + timeLeft(nowPlaying.length - nowPlaying.currentTime)}
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
}
