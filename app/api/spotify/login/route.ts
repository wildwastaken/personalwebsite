import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const host = request.headers.get('host') || '127.0.0.1:3000'
  const isLocal = host.includes('localhost') || host.includes('127.0.0.1')
  const protocol = isLocal ? 'http' : 'https'
  const normalizedHost = isLocal ? host.replace('localhost', '127.0.0.1') : host
  const customRedirect = searchParams.get('redirect_uri')
  const redirectUri = customRedirect || `${protocol}://${normalizedHost}/api/spotify/callback`

  const clientId = process.env.SPOTIFY_CLIENT_ID
  if (!clientId) {
    return new NextResponse('Missing SPOTIFY_CLIENT_ID in environment', { status: 500 })
  }
  const scopes = [
    'user-read-currently-playing',
    'user-read-recently-played',
    'user-read-playback-state',
  ].join(' ')

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    scope: scopes,
    redirect_uri: redirectUri,
    show_dialog: 'true',
  })

  return NextResponse.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`)
}
