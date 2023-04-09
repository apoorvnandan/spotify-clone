import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import { LOGIN_URL, spotifyApi } from "@/lib/spotify";

async function refreshAcessToken(token) {
    try {
        spotifyApi.setAccessToken(token.accessToken)
        spotifyApi.setRefreshToken(token.refreshToken)

        const { body: refreshedToken } = await spotifyApi.refreshAccessToken()

        return {
            ...token,
            accessToken: refreshedToken,
            accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000,
            refreshToken: refreshedToken.refresh_token ?? token.refreshToken
        }
    } catch (error) {
        console.error(error)
        return {
            ...token,
            error: "refresh token error"
        }
    }
}

export const authOptions = {
    // Configure one or more authentication providers
    providers: [
        SpotifyProvider({
            clientId: process.env.SPOTIFY_CLIENT_ID,
            clientSecret: process.env.SPOTIFY_SECRET,
            authorization: LOGIN_URL
        }),
        // ...add more providers here
    ],
    secret: process.env.JWT_SECRET,
    pages: {
        signIn: "/login"
    },
    callbacks: {
        async jwt({ token, account, user }) {
            // initial sign in
            if (account && user) return {
                ...token,
                accessToken: account.access_token,
                refreshToken: account.refresh_token,
                username: account.providerAccountId,
                accessTokenExpires: account.expires_at * 1000
            }

            // token is valid
            if (Date.now() < token.accessTokenExpires) {
                console.log("access token valid")
                return token;
            }

            // access token expires -> refresh the token
            return await refreshAcessToken(token)
        },

        async session({ session, token }) {
            session.user.accessToken = token.accessToken;
            session.user.refreshToken = token.refreshToken
            session.user.username = token.username
            return session
        }

    }
}
export default NextAuth(authOptions)