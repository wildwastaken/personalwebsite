import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { token } = await request.json()
    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 })
    }

    const envPath = path.join(process.cwd(), '.env.local')
    let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : ''
    if (envContent.includes('SPOTIFY_REFRESH_TOKEN=')) {
      envContent = envContent.replace(/SPOTIFY_REFRESH_TOKEN=.*/, `SPOTIFY_REFRESH_TOKEN=${token}`)
    } else {
      envContent += `\nSPOTIFY_REFRESH_TOKEN=${token}\n`
    }
    fs.writeFileSync(envPath, envContent)
    process.env.SPOTIFY_REFRESH_TOKEN = token

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
