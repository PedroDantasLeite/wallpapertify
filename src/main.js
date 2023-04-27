import React, { useEffect } from 'react'

export default function Main(accessToken) {
    
    async function fetchCurrentSong(token){
        return await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
            method: "GET", headers: { Authorization: `Bearer ${token}` }
        });
    }

    useEffect(() => {
      const result = fetchCurrentSong()
      result.then(data => console.log(data))
    
    }, [])
    

    
  return (
    <button onClick={fetchCurrentSong}></button>
  )
}
