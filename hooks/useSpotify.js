import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { spotifyApi } from "@/lib/spotify";

export default function useSpotify() {
    const { data: session, status } = useSession();

    useEffect(() => {
        if (session) {
            // if rrefresh token fails (ihghly unlikely)
            if (session.error == "refresh token error") {
                signIn();
            }
            spotifyApi.setAccessToken(session.user.accessToken)
        }
    }, [session])
    return spotifyApi;
}