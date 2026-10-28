'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import PixelScape from '@/components/PixelScape'

interface SpotifyData {
  isPlaying: boolean
  title: string
  artist: string
  album?: string
  albumImageUrl?: string
  songUrl?: string
}

interface ReadingData {
  isReading: boolean
  title: string
  author: string
  bookUrl: string
  coverImage?: string
}

export default function Home() {
  const [lastUpdated, setLastUpdated] = useState<string>('')
  const [spotifyData, setSpotifyData] = useState<SpotifyData>({
    isPlaying: false,
    title: 'Loading...',
    artist: '',
  })
  const [readingData, setReadingData] = useState<ReadingData>({
    isReading: false,
    title: 'Loading...',
    author: '',
    bookUrl: '',
  })
  const [isLoadingSpotify, setIsLoadingSpotify] = useState(true)
  const [isLoadingReading, setIsLoadingReading] = useState(true)

  useEffect(() => {
    fetch('/api/last-updated')
      .then((res) => res.json())
      .then((data) => setLastUpdated(data.lastUpdated))
      .catch(() => setLastUpdated(''))

    fetch('/api/spotify')
      .then((res) => res.json())
      .then((data) => {
        setSpotifyData(data)
        setIsLoadingSpotify(false)
      })
      .catch(() => {
        setSpotifyData({
          isPlaying: false,
          title: 'Sun (Instrumental)',
          artist: 'Sleeping At Last',
        })
        setIsLoadingSpotify(false)
      })

    fetch('/api/reading')
      .then((res) => res.json())
      .then((data) => {
        setReadingData(data)
        setIsLoadingReading(false)
      })
      .catch(() => {
        setReadingData({
          isReading: false,
          title: 'The Cost of Discipleship',
          author: 'Dietrich Bonhoeffer',
          bookUrl: 'https://hardcover.app/@allenliu/',
        })
        setIsLoadingReading(false)
      })
  }, [])

  return (
    <div className="relative flex w-full flex-1 flex-col justify-between py-1">
      {/* Pixel Horizon Anchored to Bottom Screen Edge */}
      <PixelScape currentScape="andes" />

      {/* Main Content Area */}
      <div className="relative z-10 w-full space-y-6 sm:space-y-8">
        {/* Intro Header: Bigger & Higher-Res Profile Photo + Identity */}
        {/* On phones the photo sits beside the name and the prose spans the full width below. */}
        <section className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4 gap-y-4 sm:gap-x-7">
          {/* Prominent High-Res Profile Photo */}
          <div className="flex-shrink-0">
            <div className="border border-[#E6E4D9] dark:border-[#282726] p-1 sm:p-1.5 bg-white dark:bg-[#1C1B1A] rounded-md shadow-sm">
              <Image
                src="/images/pfp.png"
                alt="Allen Liu"
                width={192}
                height={192}
                sizes="(max-width: 639px) 96px, (max-width: 767px) 176px, 192px"
                className="w-24 h-24 sm:w-44 sm:h-44 md:w-48 md:h-48 object-cover rounded block"
                priority
              />
            </div>
          </div>

          {/* Name, Subtitle & Direct Links */}
          <div className="contents sm:block sm:space-y-3">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#100F0F] dark:text-[#CECDC3]">
                Allen Liu
              </h1>
              <p className="font-mono text-xs text-[#6F6E69] dark:text-[#878580] mt-1">
                <span className="block sm:inline">Senior at Princeton University</span>
                <span className="hidden sm:inline"> • </span>
                <span className="block sm:inline">Computer Science, Economics &amp; Philosophy</span>
              </p>
            </div>

            <p className="col-span-2 text-base text-[#282726] dark:text-[#D4D2C9] leading-relaxed">
              I build simple software tools, study economic mechanisms and ethics, and hike alpine trails.
              I care about software that is direct, purposeful, and free of unnecessary bloat.
            </p>

            {/* Direct Links (resume removed as requested) */}
            <div className="col-span-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-xs sm:pt-1">
              <a
                href="https://github.com/wildwastaken"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-[#100F0F] dark:text-[#CECDC3]"
              >
                github ↗
              </a>
              <span className="text-[#6F6E69] dark:text-[#878580]">•</span>
              <a
                href="https://www.linkedin.com/in/allenliuct/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-[#100F0F] dark:text-[#CECDC3]"
              >
                linkedin ↗
              </a>
              <span className="text-[#6F6E69] dark:text-[#878580]">•</span>
              <a
                href="https://www.strava.com/athletes/104181021"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-[#100F0F] dark:text-[#CECDC3]"
              >
                strava ↗
              </a>
              <span className="text-[#6F6E69] dark:text-[#878580]">•</span>
              <a
                href="https://hardcover.app/@allenliu/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-[#100F0F] dark:text-[#CECDC3]"
              >
                books ↗
              </a>
              <span className="text-[#6F6E69] dark:text-[#878580]">•</span>
              <a
                href="mailto:allenliu@princeton.edu"
                className="hover:underline text-[#100F0F] dark:text-[#CECDC3]"
              >
                email ↗
              </a>
            </div>
          </div>
        </section>

        {/* Authentic About Prose */}
        <section className="bg-[#FFFCF0]/85 dark:bg-[#161615]/85 backdrop-blur-[3px] border border-[#E6E4D9]/80 dark:border-[#282726]/80 p-3 sm:p-3.5 rounded-sm leading-relaxed text-[14px] sm:text-[14.5px] text-[#282726] dark:text-[#D4D2C9]">
          <p>
            I first learned to write software during the pandemic building stock checkers and notification bots for neighbors in Connecticut. At Princeton, I study computer systems, economics, and moral philosophy, and hike alpine passes across Peru, the Canadian Rockies, and Iceland. Outside coursework and terminal, I spend time cycling country roads, reading theology and literature, or cooking with close friends.
          </p>
        </section>

        {/* Recent Trips Section */}
        <section className="space-y-2">
          <div className="flex items-baseline justify-between border-b border-[#E6E4D9] dark:border-[#282726] pb-1">
            <h2 className="font-serif text-base sm:text-lg font-bold tracking-tight text-[#100F0F] dark:text-[#CECDC3]">
              Recent Trips
            </h2>
            <Link
              href="/hikes"
              className="font-mono text-xs text-[#6F6E69] dark:text-[#878580] hover:text-[#100F0F] dark:hover:text-[#CECDC3]"
            >
              all hikes &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <Link href="/hikes?trip=STA-02" className="group block no-underline p-2.5 sm:p-3 border border-[#E6E4D9]/90 dark:border-[#282726]/90 bg-[#FFFCF0]/85 dark:bg-[#161615]/85 backdrop-blur-[4px] rounded-sm space-y-1 hover:border-[#6F6E69] dark:hover:border-[#878580] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
              <div className="flex flex-wrap items-baseline justify-between font-mono text-[11px] text-[#6F6E69] dark:text-[#878580]">
                <span className="font-bold text-[#100F0F] dark:text-[#CECDC3]">Peruvian Andes • 4,630m</span>
                <span>Dec 2025</span>
              </div>
              <h3 className="font-serif text-sm font-bold text-[#100F0F] dark:text-[#CECDC3]">
                <span className="group-hover:underline">
                  Salkantay Pass &amp; Machu Picchu
                </span>
              </h3>
              <p className="text-xs text-[#6F6E69] dark:text-[#878580] leading-relaxed">
                High-altitude pass beneath Mount Salkantay, descending through cloud forests and Incan stone terraces.
              </p>
            </Link>

            <Link href="/hikes?trip=STA-03" className="group block no-underline p-2.5 sm:p-3 border border-[#E6E4D9]/90 dark:border-[#282726]/90 bg-[#FFFCF0]/85 dark:bg-[#161615]/85 backdrop-blur-[4px] rounded-sm space-y-1 hover:border-[#6F6E69] dark:hover:border-[#878580] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
              <div className="flex flex-wrap items-baseline justify-between font-mono text-[11px] text-[#6F6E69] dark:text-[#878580]">
                <span className="font-bold text-[#100F0F] dark:text-[#CECDC3]">Canadian Rockies • 2,611m</span>
                <span>Summer 2024</span>
              </div>
              <h3 className="font-serif text-sm font-bold text-[#100F0F] dark:text-[#CECDC3]">
                <span className="group-hover:underline">
                  Sentinel Pass &amp; Moraine Lake
                </span>
              </h3>
              <p className="text-xs text-[#6F6E69] dark:text-[#878580] leading-relaxed">
                Climbing above Larch Valley to one of Banff’s highest maintained passes beneath Mount Temple.
              </p>
            </Link>
          </div>
        </section>
      </div>

      <div className="relative z-10 mt-6 w-full space-y-3">
        <footer className="w-full rounded-sm border border-[#E6E4D9]/80 dark:border-[#282726]/80 bg-[#FFFCF0]/90 dark:bg-[#161615]/90 backdrop-blur-[3px] p-3 sm:p-3.5">
          <div className="border-b border-[#E6E4D9]/70 dark:border-[#282726]/70 pb-3 mb-4">
            <h2 className="font-serif text-base text-[#100F0F] dark:text-[#CECDC3]">Currently</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8">
            <div className="min-w-0 space-y-1.5">
              <div className="flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-widest text-[#6F6E69] dark:text-[#878580]">
                <span>{spotifyData.isPlaying ? 'Listening now' : 'Last played'}</span>
                {spotifyData.isPlaying && (
                  <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 tracking-normal normal-case">
                    <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" /> live
                  </span>
                )}
              </div>
              {isLoadingSpotify ? (
                <p className="text-xs text-[#6F6E69] dark:text-[#878580]">Fetching stream…</p>
              ) : spotifyData.title ? (
                <>
                  <p className="font-serif text-sm leading-relaxed text-[#100F0F] dark:text-[#CECDC3] break-words">
                    {spotifyData.songUrl ? (
                      <a href={spotifyData.songUrl} target="_blank" rel="noopener noreferrer" className="no-underline hover:underline underline-offset-4">
                        {spotifyData.title}
                      </a>
                    ) : spotifyData.title}
                  </p>
                  {spotifyData.artist && <p className="text-xs text-[#6F6E69] dark:text-[#878580]">by {spotifyData.artist}</p>}
                </>
              ) : (
                <p className="text-xs text-[#6F6E69] dark:text-[#878580]">Offline</p>
              )}
            </div>
            <div className="min-w-0 space-y-1.5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#6F6E69] dark:text-[#878580]">On my desk</p>
              {isLoadingReading ? (
                <p className="text-xs text-[#6F6E69] dark:text-[#878580]">Fetching book…</p>
              ) : readingData.title ? (
                <>
                  <p className="font-serif text-sm italic leading-relaxed text-[#100F0F] dark:text-[#CECDC3]">
                    {readingData.bookUrl ? (
                      <a href={readingData.bookUrl} target="_blank" rel="noopener noreferrer" className="no-underline hover:underline underline-offset-4">
                        {readingData.title}
                      </a>
                    ) : readingData.title}
                  </p>
                  {readingData.author && <p className="text-xs text-[#6F6E69] dark:text-[#878580]">by {readingData.author}</p>}
                </>
              ) : (
                <p className="text-xs text-[#6F6E69] dark:text-[#878580]">Nothing recorded</p>
              )}
            </div>
          </div>
        </footer>
        <div className="flex min-h-6 items-center justify-between gap-4 font-mono text-[10px] text-[#6F6E69] dark:text-[#878580]">
          <span>{lastUpdated && <>Last updated {lastUpdated}</>}</span>
          <span className="inline-flex shrink-0 items-center gap-2 text-[#718F7C] dark:text-[#9BAA93]">
            <svg className="scroll-tree h-5 w-3.5" viewBox="0 0 18 26" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 2 5 8h2L3 14h3l-4 6h14l-4-6h3l-4-6h2L9 2Z M9 20v4" />
            </svg>
            <span>scroll to reveal</span>
          </span>
        </div>
      </div>
    </div>
  )
}
