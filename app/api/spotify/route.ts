import { NextResponse } from 'next/server'

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN

const NOW_PLAYING_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing'
const RECENTLY_PLAYED_ENDPOINT = 'https://api.spotify.com/v1/me/player/recently-played?limit=1'
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token'

async function getAccessToken() {
  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    return null
  }

  const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')

  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: REFRESH_TOKEN,
    }),
  })

  return response.json()
}

export async function GET() {
  try {
    const { access_token } = await getAccessToken() || {}

    if (!access_token) {
      return NextResponse.json({
        isPlaying: false,
        title: 'Not configured',
        artist: 'Add Spotify credentials',
      })
    }

    // Try to get currently playing
    const nowPlayingResponse = await fetch(NOW_PLAYING_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })

    if (nowPlayingResponse.status === 200) {
      const song = await nowPlayingResponse.json()

      return NextResponse.json({
        isPlaying: true,
        title: song.item.name,
        artist: song.item.artists.map((artist: any) => artist.name).join(', '),
        album: song.item.album.name,
        albumImageUrl: song.item.album.images[0]?.url,
        songUrl: song.item.external_urls.spotify,
      })
    }

    // If nothing is playing, get recently played
    const recentlyPlayedResponse = await fetch(RECENTLY_PLAYED_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })

    if (recentlyPlayedResponse.status === 200) {
      const data = await recentlyPlayedResponse.json()
      const song = data.items[0]?.track

      if (song) {
        return NextResponse.json({
          isPlaying: false,
          title: song.name,
          artist: song.artists.map((artist: any) => artist.name).join(', '),
          album: song.album.name,
          albumImageUrl: song.album.images[0]?.url,
          songUrl: song.external_urls.spotify,
        })
      }
    }

    return NextResponse.json({
      isPlaying: false,
      title: 'The Way You Look Tonight',
      artist: 'Frank Sinatra',
    })
  } catch (error) {
    console.error('Error fetching Spotify data:', error)
    return NextResponse.json({
      isPlaying: false,
      title: 'The Way You Look Tonight',
      artist: 'Frank Sinatra',
    })
  }
}
