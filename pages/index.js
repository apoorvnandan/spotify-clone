import { Inter } from 'next/font/google'
import { signOut, useSession } from 'next-auth/react'
import Sidebar from '@/components/Sidebar';
import Center from '@/components/Center';
import { useState } from 'react';
import Player from '@/components/Player';

const inter = Inter({ subsets: ['latin'] })



export default function Home() {
  // const { data: session, status } = useSession();
  const [globalPlaylistId, setGlobalPlaylistId] = useState(null);
  const [globalPlaylistState, setGlobalPlaylistState] = useState(null);
  const [globalCurrentTrackId, setGlobalCurrentTrackId] = useState(null);
  const [globalIsTrackPlaying, setGlobalIsTrackPlaying] = useState(false)

  return (
    <div className='bg-black h-screen overflow-hidden'>
      <main className="flex w-full">
        <Sidebar
          globalPlaylistId={globalPlaylistId}
          setGlobalPlaylistId={setGlobalPlaylistId}
        />
        <Center
          globalPlaylistId={globalPlaylistId}
          setGlobalPlaylistId={setGlobalPlaylistId}
          globalPlaylistState={globalPlaylistState}
          setGlobalPlaylistState={setGlobalPlaylistState}
          globalCurrentTrackId={globalCurrentTrackId}
          setGlobalCurrentTrackId={setGlobalCurrentTrackId}
          globalIsTrackPlaying={globalIsTrackPlaying}
          setGlobalIsTrackPlaying={setGlobalIsTrackPlaying}
        />

      </main>
      <div className='sticky bottom-0'>
        <Player
          globalCurrentTrackId={globalCurrentTrackId}
          setGlobalCurrentTrackId={setGlobalCurrentTrackId}
          globalIsTrackPlaying={globalIsTrackPlaying}
          setGlobalIsTrackPlaying={setGlobalIsTrackPlaying}
        />
      </div>
    </div>
  )
}
