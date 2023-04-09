import Song from "./Song"

export default function Songs({ globalPlaylistState, globalCurrentTrackId, setGlobalCurrentTrackId, globalIsTrackPlaying, setGlobalIsTrackPlaying }) {
    return <div className="text-white px-8 flex flex-col space-y-1 pb-28">
        {globalPlaylistState?.tracks.items.map((track, i) => {
            return <Song
                key={track.track.id}
                track={track}
                order={i}
                globalCurrentTrackId={globalCurrentTrackId}
                setGlobalCurrentTrackId={setGlobalCurrentTrackId}
                globalIsTrackPlaying={globalIsTrackPlaying}
                setGlobalIsTrackPlaying={setGlobalIsTrackPlaying}
            />
        })}
    </div>
}