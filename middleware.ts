import { NextResponse, type NextRequest } from 'next/server'

// The Spotify setup flow writes the refresh token to .env.local, so it only works locally.
// In production these routes would let any visitor swap in their own Spotify account.
export function middleware(_request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return new NextResponse('Not found', { status: 404 })
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/spotify-setup', '/callback', '/api/spotify/login', '/api/spotify/callback', '/api/spotify/save-token'],
}
