import React, { useEffect, useState } from "react";
import chroma from "chroma-js";

export default function Gika({ nowPlaying }) {
  const [colors, setColors] = useState([]);

  // document.body.style.backgroundColor = colors[0];

  useEffect(() => {
    // let image = document.getElementById("image");
    // setColors(chroma.scale().colors(5));
    // console.log(image);
  }, []);

  return (
    <>
      <div className="imagediv">
        <img src={nowPlaying.albumArt} className="img rounded-4" />
      </div>
    </>
  );
}
