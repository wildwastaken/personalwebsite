'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Music, CheckCircle2, AlertCircle, ArrowRight, ExternalLink } from 'lucide-react'

export default function SpotifySetupPage() {
  const [status, setStatus] = useState<{ isPlaying: boolean; title?: string; artist?: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [manualToken, setManualToken] = useState('')
  const [manualSaved, setManualSaved] = useState(false)

  const checkSpotify = () => {
    setLoading(true)
    fetch('/api/spotify')
      .then((res) => res.json())
      .then((data) => {
        setStatus(data)
        setLoading(false)
      })
      .catch(() => {
        setStatus(null)
        setLoading(false)
      })
  }

  useEffect(() => {
    checkSpotify()
  }, [])

  const handleManualSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!manualToken.trim()) return

    const res = await fetch('/api/spotify/save-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: manualToken.trim() }),
    })

    if (res.ok) {
      setManualSaved(true)
      checkSpotify()
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl space-y-8">
        <div className="flex items-center space-x-3 border-b border-zinc-800 pb-6">
          <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500">
            <Music className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Spotify Integration Setup</h1>
            <p className="text-sm text-zinc-400">Connect your Spotify account to display live tracks</p>
          </div>
        </div>

        {/* Current Status */}
        <div className="bg-zinc-950/60 rounded-xl p-5 border border-zinc-800/80 space-y-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Current Status</h2>
          {loading ? (
            <p className="text-sm text-zinc-400 animate-pulse">Checking Spotify connection...</p>
          ) : status?.title ? (
            <div className="flex items-center space-x-2 text-green-400 text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>Connected! Showing: <strong>{status.title}</strong> by {status.artist}</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-amber-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>Refresh token revoked or missing. Authorization required below.</span>
            </div>
          )}
        </div>

        {/* Step-by-Step Instructions */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-zinc-200">1-Click Authorization</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            In your <a href="https://developer.spotify.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-green-400 underline inline-flex items-center gap-1">Spotify Developer App <ExternalLink className="w-3 h-3" /></a> Settings, Spotify requires using the explicit loopback IP <code className="text-zinc-200">127.0.0.1</code> instead of <code className="text-zinc-200">localhost</code>. Add this exact Redirect URI:
          </p>

          <div className="bg-zinc-950 p-3 rounded-lg font-mono text-xs text-green-400 border border-zinc-800 flex justify-between items-center select-all">
            <span>http://127.0.0.1:3000/api/spotify/callback</span>
          </div>

          <a
            href="http://127.0.0.1:3000/api/spotify/login"
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-green-500 hover:bg-green-400 text-zinc-950 font-semibold rounded-xl transition duration-200"
          >
            <span>Connect Spotify Account</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Manual Fallback */}
        <div className="border-t border-zinc-800 pt-6 space-y-4">
          <h2 className="text-sm font-semibold text-zinc-200">Or Paste Refresh Token Manually</h2>
          <form onSubmit={handleManualSave} className="space-y-3">
            <input
              type="text"
              value={manualToken}
              onChange={(e) => setManualToken(e.target.value)}
              placeholder="Paste SPOTIFY_REFRESH_TOKEN here..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-green-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-sm font-medium rounded-lg transition"
            >
              Save Token
            </button>
            {manualSaved && <span className="ml-3 text-xs text-green-400">Token updated!</span>}
          </form>
        </div>

        <div className="pt-2 text-center">
          <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-300">
            ← Return to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
