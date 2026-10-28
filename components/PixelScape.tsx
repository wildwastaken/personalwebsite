'use client'

import LandscapeArt from './LandscapeArt'
import { useState, useEffect, type CSSProperties } from 'react'

export type ScapeType = 'none' | 'andes' | 'mountains' | 'forest' | 'lake' | 'custom'

export const SCAPES: {
  id: Exclude<ScapeType, 'none' | 'custom'>
  label: string
  alt: string
  info: string
}[] = [
  {
    id: 'andes',
    label: 'andes',
    alt: '16-bit retro pixel art of grand majestic Andean & Icelandic glacier peaks reflecting in a glacial tarn with natural framing ridges',
    info: 'Grand Peaks (Andes & Iceland)',
  },
  /* Other horizon options are retired; Andes is the only active landscape.
  {
    id: 'mountains',
    label: 'valley',
    alt: '16-bit retro pixel art landscape with evergreen pine trees along the outer edges framing a peaceful glassy lake and mountain silhouettes along the bottom',
    info: 'Alpine Tarn & Outer Pine Framing',
  },
  {
    id: 'forest',
    label: 'forest',
    alt: '16-bit retro pixel art of misty evergreen pine forest ridgelines and moonlit valleys',
    info: 'Misty Pine Forest Dawn & Night Mist',
  },
  {
    id: 'lake',
    label: 'lake',
    alt: '16-bit retro pixel art of Moraine alpine lake reflecting mountain peaks under starry skies',
    info: 'Moraine Alpine Lake & Reflections',
  },
  */
]

interface PixelScapeProps {
  currentScape: ScapeType
}

export default function PixelScape({ currentScape }: PixelScapeProps) {
  const [customScapeUrl, setCustomScapeUrl] = useState<string | null>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('artgen_custom_scape')
      if (saved) setCustomScapeUrl(saved)
    } catch {}

    let gestureDistance = 0
    let touchY: number | null = null
    const scrollRoom = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
    const handleScroll = () => {
      const room = scrollRoom()
      if (room > 1) {
        gestureDistance = 0
        setScrollProgress(Math.min(1, Math.max(0, window.scrollY / Math.min(360, room))))
      }
    }
    // A compact page still receives scroll intent even when the viewport has no scroll room.
    // Never cancel native scrolling, zooming, or nested scrolling controls.
    const revealFromGesture = (delta: number) => {
      if (scrollRoom() > 1) return
      gestureDistance = Math.min(360, Math.max(0, gestureDistance + delta))
      setScrollProgress(gestureDistance / 360)
    }
    const isControl = (target: EventTarget | null) => target instanceof Element &&
      Boolean(target.closest('input, textarea, select, [contenteditable="true"], [role="dialog"]'))
    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.defaultPrevented || isControl(event.target) || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1
      revealFromGesture(event.deltaY * unit)
    }
    const handleTouchStart = (event: TouchEvent) => {
      touchY = event.touches.length === 1 && !isControl(event.target) ? event.touches[0].clientY : null
    }
    const handleTouchMove = (event: TouchEvent) => {
      if (touchY === null || event.touches.length !== 1) return
      const nextY = event.touches[0].clientY
      revealFromGesture(touchY - nextY)
      touchY = nextY
    }
    const handleKey = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || isControl(event.target)) return
      if (event.target instanceof Element && event.target.closest('button, a') && event.key === ' ') return
      if (event.key === 'Home') revealFromGesture(-360)
      else if (event.key === 'End' || event.key === 'PageDown') revealFromGesture(360)
      else if (event.key === 'PageUp') revealFromGesture(-360)
      else if (event.key === 'ArrowDown') revealFromGesture(40)
      else if (event.key === 'ArrowUp') revealFromGesture(-40)
      else if (event.key === ' ') revealFromGesture(event.shiftKey ? -360 : 360)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)
    window.addEventListener('wheel', handleWheel, { passive: true })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('keydown', handleKey)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('keydown', handleKey)
    }
  }, [])

  const isHidden = currentScape === 'none'
  // At rest the entire horizon sits below the viewport, then scrolls upward into it.
  const translateY = (1 - scrollProgress) * 100

  return (
    <div
      aria-hidden="true"
      data-landscape=""
      className="fixed inset-0 pointer-events-none select-none overflow-hidden z-0"
      style={{
        visibility: isHidden ? 'hidden' : 'visible',
        '--horizon-progress': scrollProgress,
      } as CSSProperties}
    >
      {/* A compact horizon leaves the upper page clear and dissolves into the paper. */}
      <div
        className="absolute inset-x-0 bottom-0 h-[min(42vh,360px)] min-h-[220px] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
        style={{
          transform: `translateY(${translateY}%)`,
          maskImage:
            'linear-gradient(to bottom, transparent, rgba(0,0,0,0.6) 24%, black 60%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent, rgba(0,0,0,0.6) 24%, black 60%)',
        }}
      >
        {SCAPES.map((scape) => {
          const isActive = scape.id === currentScape
          return (
            <div
              key={scape.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-80 dark:opacity-70' : 'opacity-0'
              }`}
            >
              <LandscapeArt terrain={scape.id} />
            </div>
          )
        })}

        {/* Custom Scape from /artgen if active */}
        {currentScape === 'custom' && customScapeUrl && (
          <div
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              currentScape === 'custom' ? 'opacity-90 dark:opacity-75' : 'opacity-0'
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={customScapeUrl}
              alt="Custom generated pixel art horizon from /artgen"
              className="w-full h-full object-cover object-bottom saturate-50 opacity-60"
            />
          </div>
        )}
      </div>
    </div>
  )
}
