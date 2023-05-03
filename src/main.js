import React, { useEffect } from "react";

export default function Main(refreshToken) {
  const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;

  const getNowPlaying = () => {
    console.log(refreshToken);
    return fetch(NOW_PLAYING_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });
  };

  const handleGetSong = () => {
    const result = getNowPlaying().then((data) => console.log(data));
  };

  return (
    <>
      <button onClick={handleGetSong}></button>
    </>
  );
}
