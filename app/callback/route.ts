import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const url = new URL(request.url)
  url.pathname = '/api/spotify/callback'
  return NextResponse.redirect(url.toString())
}
