'use client'

import { useEffect, useId, useRef } from 'react'
import GalleryImage from './GalleryImage'

export interface ViewerPhoto {
  src: string
  alt: string
  detail?: string
  originalSrc?: string
}

interface PhotoViewerProps {
  photos: ViewerPhoto[]
  index: number
  title: string
  onIndexChange: (index: number) => void
  onClose: () => void
}

export default function PhotoViewer({ photos, index, title, onIndexChange, onClose }: PhotoViewerProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()
  const photo = photos[index]

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus({ preventScroll: true })
    return () => {
      document.body.style.overflow = previousOverflow
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true })
    }
  }, [])

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (['Escape', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        // Capture before the map or a focused control can consume these keys.
        event.preventDefault()
        event.stopPropagation()
        if (event.key === 'Escape') onClose()
        else if (photos.length) onIndexChange((index + (event.key === 'ArrowRight' ? 1 : -1) + photos.length) % photos.length)
      } else if (event.key === 'Tab') {
        const controls = dialogRef.current?.querySelectorAll<HTMLElement>('button, a[href]')
        if (!controls?.length) return
        const first = controls[0], last = controls[controls.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', handleKey, true)
    return () => window.removeEventListener('keydown', handleKey, true)
  }, [index, photos.length, onIndexChange, onClose])

  if (!photo) return null

  return (
    <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={titleId} className="fixed inset-0 z-50 bg-black/95 flex flex-col p-4 sm:p-6" onClick={onClose}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/15 pb-3 text-zinc-300" onClick={event => event.stopPropagation()}>
        <div className="min-w-0">
          <h2 id={titleId} className="font-serif text-sm sm:text-base text-white">{title}</h2>
          <p className="font-mono text-[10px] text-zinc-400 mt-1">{index + 1} / {photos.length}</p>
        </div>
        <div className="flex items-center gap-4 font-mono text-xs">
          <button type="button" title="Previous (Left Arrow)" onClick={() => onIndexChange((index - 1 + photos.length) % photos.length)} className="hover:text-white">← Previous</button>
          <button type="button" title="Next (Right Arrow)" onClick={() => onIndexChange((index + 1) % photos.length)} className="hover:text-white">Next →</button>
          <button ref={closeRef} type="button" title="Close (Escape)" onClick={onClose} className="text-white rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">Close ×</button>
        </div>
      </div>
      <div className="relative flex-1 min-h-0 my-4" onClick={event => event.stopPropagation()}>
        <GalleryImage key={`preview-${photo.src}`} src={photo.src} alt="" sizes="(max-width: 640px) calc(100vw - 32px), calc(100vw - 48px)" className="object-contain" loading="eager" />
        <GalleryImage key={photo.src} src={photo.src} alt={photo.alt} mode="display" sizes="(max-width: 640px) calc(100vw - 32px), calc(100vw - 48px)" className="object-contain" loading="eager" />
      </div>
      <div className="flex flex-wrap items-end justify-between gap-3 border-t border-white/15 pt-3" onClick={event => event.stopPropagation()}>
        <div>
          <p className="font-serif text-sm sm:text-base text-white">{photo.alt}</p>
          {photo.detail && <p className="font-mono text-[10px] text-zinc-400 mt-1">{photo.detail}</p>}
        </div>
        {photo.originalSrc && <a href={photo.originalSrc} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-zinc-400 hover:text-white">Original photo ↗</a>}
      </div>
    </div>
  )
}
