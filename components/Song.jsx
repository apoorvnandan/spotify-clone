import { millisToMinutesAndSeconds } from "@/lib/time";
import { PlayIcon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function Song({ order, track, globalCurrentTrackId, setGlobalCurrentTrackId, globalIsTrackPlaying, setGlobalIsTrackPlaying }) {
    const { data: session, status } = useSession();
    const [hover, setHover] = useState(false);

    const playSong = async () => {
        setGlobalCurrentTrackId(track.track.id)
        setGlobalIsTrackPlaying(true)
        console.log("playing", track.track.id)
        if (session && session.user && session.user.accessToken) {
            let token = ''
            if (typeof session.user.accessToken == 'string') {
                token = session.user.accessToken
            } else {
                token = session.user.accessToken.access_token
            }
            const response = await fetch("https://api.spotify.com/v1/me/player/play", {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ uris: [track.track.uri] })
            })
        }
    }

    return <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onClick={playSong} className="grid grid-cols-2 text-neutral-400 text-sm py-4 px-5 hover:bg-white hover:bg-opacity-10 rounded-lg cursor-pointer">
        <div className="flex items-center space-x-4">
            {hover ? <PlayIcon className="h-5 w-5 text-white" /> : <p className="w-5">{order + 1}</p>}
            <img className="h-10 w-10" src={track.track.album.images[0].url} alt="" />
            <div className="">
                <p className="w-36 lg:w-64 truncate text-white text-base">{track.track.name}</p>
                <p className="">{track.track.artists[0].name}</p>
            </div>
        </div>
        <div className="flex items-center justify-between ml-auto md:ml-0">
            <p className="w-40 truncate hidden md:inline">{track.track.album.name}</p>
            <p>{millisToMinutesAndSeconds(track.track.duration_ms)}</p>
        </div>
    </div>
}