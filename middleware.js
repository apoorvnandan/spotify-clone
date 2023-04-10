import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
    const token = await getToken({ req, secret: process.env.JWT_SECRET })
    // console.log('token', token)

    const { pathname } = req.nextUrl
    if (pathname.includes('/api/auth') || token) {
        return NextResponse.next();
    }
    if (!token && pathname != "/login") {
        console.log('hello', pathname)
        return NextResponse.redirect(new URL('/login', req.url))
    }
    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}