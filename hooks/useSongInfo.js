import { useEffect, useState } from "react";
import useSpotify from "./useSpotify";

export default function useSongInfo(globalCurrentTrackId) {
    const spotifyApi = useSpotify();
    const [songInfo, setSongInfo] = useState(null)
    useEffect(() => {
        async function fetchSongInfo() {
            if (globalCurrentTrackId) {
                const trackInfo = await fetch(`https://api.spotify.com/v1/tracks/${globalCurrentTrackId}`, {
                    headers: {
                        Authorization: `Bearer ${spotifyApi.getAccessToken()}`
                    }
                }).then(res => res.json())
                setSongInfo(trackInfo)
            }
        }
        fetchSongInfo()
    }, [globalCurrentTrackId, spotifyApi])
    return songInfo;
}