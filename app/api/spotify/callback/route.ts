import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error) {
    return new NextResponse(`
      <html>
        <body style="font-family: system-ui; background: #121212; color: #fff; text-align: center; padding: 50px;">
          <h2 style="color: #ef4444;">Spotify Authorization Cancelled or Failed</h2>
          <p>${error}</p>
          <a href="/spotify-setup" style="color: #1DB954;">Try Again</a>
        </body>
      </html>
    `, { headers: { 'Content-Type': 'text/html' }, status: 400 })
  }

  if (!code) {
    return new NextResponse('Missing authorization code', { status: 400 })
  }

  const host = request.headers.get('host') || '127.0.0.1:3000'
  const isLocal = host.includes('localhost') || host.includes('127.0.0.1')
  const protocol = isLocal ? 'http' : 'https'
  const normalizedHost = isLocal ? host.replace('localhost', '127.0.0.1') : host
  const pathname = new URL(request.url).pathname
  const redirectUri = `${protocol}://${normalizedHost}${pathname}`

  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
    }),
  })

  const data = await response.json()

  if (!response.ok || !data.refresh_token) {
    return new NextResponse(`
      <html>
        <body style="font-family: system-ui; background: #121212; color: #fff; text-align: center; padding: 50px;">
          <h2 style="color: #ef4444;">Failed to Exchange Token</h2>
          <pre style="background: #242424; padding: 15px; border-radius: 8px; text-align: left; max-width: 600px; margin: 20px auto;">${JSON.stringify(data, null, 2)}</pre>
          <a href="/spotify-setup" style="color: #1DB954;">Back to Spotify Setup</a>
        </body>
      </html>
    `, { headers: { 'Content-Type': 'text/html' }, status: 400 })
  }

  // Update .env.local
  const envPath = path.join(process.cwd(), '.env.local')
  try {
    let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : ''
    if (envContent.includes('SPOTIFY_REFRESH_TOKEN=')) {
      envContent = envContent.replace(/SPOTIFY_REFRESH_TOKEN=.*/, `SPOTIFY_REFRESH_TOKEN=${data.refresh_token}`)
    } else {
      envContent += `\nSPOTIFY_REFRESH_TOKEN=${data.refresh_token}\n`
    }
    fs.writeFileSync(envPath, envContent)
    process.env.SPOTIFY_REFRESH_TOKEN = data.refresh_token
  } catch (err) {
    console.error('Failed to write to .env.local:', err)
  }

  return new NextResponse(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Spotify Connected</title>
        <style>
          body {
            font-family: system-ui, -apple-system, sans-serif;
            background: #09090b;
            color: #f4f4f5;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            text-align: center;
          }
          .card {
            background: #18181b;
            padding: 48px;
            border-radius: 20px;
            border: 1px solid #27272a;
            max-width: 480px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.5);
          }
          h1 { color: #22c55e; margin: 0 0 16px; font-size: 26px; }
          p { color: #a1a1aa; line-height: 1.6; font-size: 15px; }
          .token { background: #27272a; padding: 10px; border-radius: 8px; font-family: monospace; font-size: 12px; word-break: break-all; margin: 16px 0; color: #a3e635; }
          a {
            display: inline-block;
            margin-top: 16px;
            padding: 12px 24px;
            background: #22c55e;
            color: #000;
            font-weight: 600;
            text-decoration: none;
            border-radius: 10px;
            transition: transform 0.2s;
          }
          a:hover { transform: scale(1.03); }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>🎉 Spotify Connected!</h1>
          <p>Your new refresh token has been generated and saved directly to <code>.env.local</code>.</p>
          <div class="token">${data.refresh_token}</div>
          <a href="/">Go to Home Page</a>
        </div>
      </body>
    </html>
  `, { headers: { 'Content-Type': 'text/html' } })
}
