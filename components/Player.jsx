import { ArrowsRightLeftIcon, SpeakerWaveIcon, } from "@heroicons/react/24/outline";
import { ArrowUturnLeftIcon, BackwardIcon, ForwardIcon, PauseCircleIcon, PlayCircleIcon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react";

export default function Player({ globalCurrentTrackId, setGlobalCurrentTrackId, globalIsTrackPlaying, setGlobalIsTrackPlaying }) {
    const [songInfo, setSongInfo] = useState(null)
    const { data: session, status } = useSession();
    const [volumne, setVolume] = useState(50);

    async function getCurrentlyPlaying() {
        let token = ''
        if (typeof session.user.accessToken == 'string') {
            token = session.user.accessToken
        } else {
            token = session.user.accessToken.access_token
        }
        const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        if (response.status == 204) {
            console.log("204 response")
            return;
        }
        const data = await response.json();
        return data;
    }

    async function handlePlayPause() {
        const currentlyPlayingData = await getCurrentlyPlaying();
        if (currentlyPlayingData && currentlyPlayingData.is_playing) {
            let token = ''
            if (typeof session.user.accessToken == 'string') {
                token = session.user.accessToken
            } else {
                token = session.user.accessToken.access_token
            }
            const response = await fetch("https://api.spotify.com/v1/me/player/pause", {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (response.status == 204) {
                setGlobalIsTrackPlaying(false)
            }
        } else {
            let token = ''
            if (typeof session.user.accessToken == 'string') {
                console.log("assigning accessToken", session.user.accessToken)
                token = session.user.accessToken
            } else {
                console.log("assigning access_token", session.user.accessToken.access_token)
                token = session.user.accessToken.access_token
            }
            const response = await fetch("https://api.spotify.com/v1/me/player/play", {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (response.status == 204) {
                setGlobalIsTrackPlaying(true)
            }
        }
    }

    useEffect(() => {
        async function fetchSongInfo(trackId) {
            if (trackId) {
                let token = ''
                if (typeof session.user.accessToken == 'string') {
                    token = session.user.accessToken
                } else {
                    token = session.user.accessToken.access_token
                }
                const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                const trackInfo = await response.json()
                console.log({ trackInfo })
                setSongInfo(trackInfo)
            }
        }

        async function f() {
            if (session && session.user && session.user.accessToken) {
                if (!globalCurrentTrackId) {
                    const data = await getCurrentlyPlaying()
                    setGlobalCurrentTrackId(data?.item?.id)
                    if (data?.is_playing) {
                        setGlobalIsTrackPlaying(true)
                    }
                    await fetchSongInfo(data?.item?.id)
                    setVolume(50)
                } else {
                    await fetchSongInfo(globalCurrentTrackId)
                }
            }

        }
        f();
        console.log({ globalCurrentTrackId })
    }, [globalCurrentTrackId, session])
    // bg-gradient-to-b from-black to-neutral-900
    return <div className="h-24 bg-neutral-800 border-t border-neutral-700 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
        <div className="flex items-center space-x-4">
            <img className="hidden md:inline h-10 w-10" src={songInfo?.album?.images[0]?.url} alt="" />
            <div className="">
                <h3 className="text-white text-sm">{songInfo?.name}</h3>
                <p className="text-neutral-400 text-xs">{songInfo?.artists[0]?.name}</p>
            </div>
        </div>
        <div className="flex items-center justify-evenly">
            <ArrowsRightLeftIcon className="text-neutral-400 hover:text-white h-5 w-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out" />
            <BackwardIcon className="text-neutral-400 hover:text-white h-5 w-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out" />
            {globalIsTrackPlaying ? (
                <PauseCircleIcon onClick={handlePlayPause} className="cursor-pointer hover:scale-125 transition transform duration-100 ease-out h-10 w-10" />
            ) : (
                <PlayCircleIcon onClick={handlePlayPause} className="cursor-pointer hover:scale-125 transition transform duration-100 ease-out h-10 w-10" />
            )}
            <ForwardIcon className="text-neutral-400 hover:text-white h-5 w-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out" />
            <ArrowUturnLeftIcon className="text-neutral-400 hover:text-white h-5 w-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out" />
        </div>
        <div className="flex items-center justify-end pr-5 space-x-3 md:space-x-4">
            <SpeakerWaveIcon className="h-5 w-5 text-neutral-400 hover:text-white" />
            <input type="range" min={0} max={100} className="accent-white hover:accent-green-600 w-14 md:w-28" />
        </div>
    </div>
}