import { ChevronDownIcon } from "@heroicons/react/24/solid"
import { shuffle } from "lodash"
import { signOut, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react"
import Songs from "./Songs";

const colors = [
    "from-indigo-500",
    "from-blue-500",
    "from-green-500",
    "from-red-500",
    "from-yellow-500",
    "from-pink-500",
    "from-purple-500",
]

export default function Center({ globalPlaylistId, setGlobalPlaylistId, globalPlaylistState, setGlobalPlaylistState, globalCurrentTrackId, setGlobalCurrentTrackId, globalIsTrackPlaying, setGlobalIsTrackPlaying }) {
    const { data: session, status } = useSession();
    const [color, setColor] = useState(null);
    const [opacity, setOpacity] = useState(0);
    const [textOpacity, setTextOpacity] = useState(0);

    function changeOpacity(scrollPos) {
        const offset = 300
        const textTransition = 10;
        let newOpacity = 1 - (offset - scrollPos) / 300
        setOpacity(newOpacity)
        let delta = 0
        if ((scrollPos - offset) > 0) delta = scrollPos - offset
        setTextOpacity(1 - ((textTransition - delta) / textTransition))
    }

    useEffect(() => {
        setColor(shuffle(colors).pop())
    }, [globalPlaylistId])

    useEffect(() => {
        async function f() {
            if (globalPlaylistId && session && session.user && session.user.accessToken) {
                let token = session.user.accessToken
                const response = await fetch(`https://api.spotify.com/v1/playlists/${globalPlaylistId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                const data = await response.json()
                setGlobalPlaylistState(data)
            }
        }
        f();
    }, [globalPlaylistId, session])

    return <div className="flex-grow">
        <header className="text-white sticky top-0 h-20 z-10 text-4xl bg-neutral-800 p-8 flex items-center font-bold" style={{ opacity: opacity }}>
            <div style={{ opacity: textOpacity }}>
                {globalPlaylistState?.name}
            </div>
        </header >
        <div onClick={() => signOut()} className="absolute z-20 top-5 right-8 flex items-center bg-black bg-opacity-70 text-white space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2">
            <img className="rounded-full w-7 h-7" src={session?.user.image} alt="profile pic" />
            <h2 className="text-sm">Logout</h2>
            <ChevronDownIcon className="h-5 w-5" />
        </div>
        <div onScroll={(e) => changeOpacity(e.target.scrollTop)} className="relative -top-20 h-screen overflow-y-scroll scrollbar-hide bg-neutral-900">
            <section className={`flex items-end space-x-7 bg-gradient-to-b to-neutral-900 ${color} h-80 text-white p-8`}>
                <img className="h-44 w-44 shadow-2xl" src={globalPlaylistState?.images[0]?.url} alt="playlist image" />
                <div>
                    <p className="text-white text-sm font-bold">Playlist</p>
                    <h1 className="text-2xl font-extrabold md:text-3xl lg:text-5xl">{globalPlaylistState?.name}</h1>
                </div>
            </section>
            <div>
                <Songs
                    globalPlaylistState={globalPlaylistState}
                    globalCurrentTrackId={globalCurrentTrackId}
                    setGlobalCurrentTrackId={setGlobalCurrentTrackId}
                    globalIsTrackPlaying={globalIsTrackPlaying}
                    setGlobalIsTrackPlaying={setGlobalIsTrackPlaying}
                />
            </div>
        </div>
    </div >
}