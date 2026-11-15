'use client'

import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { useSearchParams } from 'next/navigation'
import GalleryImage from '@/components/GalleryImage'
import PhotoViewer from '@/components/PhotoViewer'
import { hikes, type Hike } from '@/lib/hikes'
import type { MapDestination } from '@/components/ExpeditionMap'

const ExpeditionMap = dynamic(() => import('@/components/ExpeditionMap'), {
  ssr: false,
  loading: () => <div className="h-[380px] sm:h-[460px] grid place-items-center bg-[#F2F0E5] dark:bg-[#1C1B1A] text-sm text-[#6F6E69] dark:text-[#878580]">Opening the map…</div>,
})

const REGIONS = [
  { id: 'all', label: 'All places', lat: 25, lng: -40, zoom: 1.8 },
  { id: 'peru', label: 'Peru', lat: -13.26, lng: -72.44, zoom: 9 },
  { id: 'canada', label: 'Canada', lat: 51.38, lng: -116.2, zoom: 9 },
  { id: 'iceland', label: 'Iceland', lat: 63.9, lng: -19.3, zoom: 6.8 },
  { id: 'usa', label: 'White Mountains', lat: 44.17, lng: -71.58, zoom: 9.5 },
]

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

// "Dec 25, 2025" or "July 31 – Aug 2, 2024" -> pieces for the date column and a sort key.
function parseHikeDate(date: string) {
  const year = date.match(/(\d{4})\s*$/)?.[1] || ''
  const parts = date.replace(/,?\s*\d{4}\s*$/, '').split(/\s*[–-]\s*/)
  const short = (part: string) => {
    const [month, day] = part.trim().split(/\s+/)
    return { month: month.slice(0, 3), day: day || month }
  }
  const start = short(parts[0])
  const end = parts[1] ? short(parts[1]) : null
  const label = end
    ? end.month === end.day ? `${start.month} ${start.day}–${end.day}` : `${start.month} ${start.day} – ${end.month} ${end.day}`
    : `${start.month} ${start.day}`
  const sortKey = Number(year) * 10000 + (MONTHS.indexOf(start.month.toLowerCase()) + 1) * 100 + Number(start.day)
  return { label, year, sortKey }
}

const sortedHikes = [...hikes].sort((a, b) => parseHikeDate(b.date).sortKey - parseHikeDate(a.date).sortKey)

// Only this small child waits for URL parameters; the hikes render immediately.
function TripFromLink({ onSelect }: { onSelect: (hike: Hike, scroll?: boolean) => void }) {
  const trip = useSearchParams().get('trip')
  useEffect(() => {
    const hike = hikes.find(hike => hike.num === trip)
    if (hike) onSelect(hike, false)
  }, [trip, onSelect])
  return null
}

export default function Hikes() {
  const [selectedHike, setSelectedHike] = useState<Hike | null>(null)
  const [destination, setDestination] = useState<MapDestination | null>(null)
  const [activeRegion, setActiveRegion] = useState('all')
  const [photoHike, setPhotoHike] = useState<Hike | null>(null)
  const [photoIndex, setPhotoIndex] = useState(0)
  const requestId = useRef(0)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  const locateHike = useCallback((hike: Hike, scroll = true) => {
    setSelectedHike(hike)
    setActiveRegion(hike.country.toLowerCase())
    setDestination({ lat: hike.lat, lng: hike.lng, zoom: 8.5, requestId: ++requestId.current })
    if (scroll) mapContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const openPhotos = useCallback((hike: Hike, index = 0) => {
    setPhotoHike(hike)
    setPhotoIndex(index)
  }, [])
  const closePhotos = useCallback(() => setPhotoHike(null), [])

  const selectRegion = (region: typeof REGIONS[number]) => {
    setActiveRegion(region.id)
    setSelectedHike(null)
    setDestination({ lat: region.lat, lng: region.lng, zoom: region.zoom, requestId: ++requestId.current })
  }

  return (
    <div className="w-full space-y-8">
      <Suspense fallback={null}><TripFromLink onSelect={locateHike} /></Suspense>
      <div className="border-b border-[#E6E4D9] dark:border-[#282726] pb-4 space-y-2">
        <h1 className="font-serif text-3xl font-bold tracking-tight">Expeditions</h1>
        <p className="text-sm leading-relaxed text-[#6F6E69] dark:text-[#878580]">Some favorite hikes. Tap one to find it on the map.</p>
      </div>

      <section ref={mapContainerRef} aria-label="Hiking destinations" className="scroll-mt-6 rounded-lg overflow-hidden border border-[#E6E4D9] dark:border-[#282726]">
        <div className="px-4 py-3 flex flex-wrap items-center justify-between gap-3 bg-[#FFFCF0] dark:bg-[#161615]">
          <p className="font-serif text-sm">{selectedHike?.name || 'Where I’ve hiked'}</p>
          <div className="flex flex-wrap gap-1.5">
            {REGIONS.map(region => (
              <button key={region.id} type="button" aria-pressed={activeRegion === region.id} onClick={() => selectRegion(region)} className={`rounded-full px-2.5 py-1 text-[11px] transition-colors ${activeRegion === region.id ? 'bg-[#E6E4D9] text-[#100F0F] dark:bg-[#343B34] dark:text-[#CECDC3]' : 'text-[#6F6E69] dark:text-[#878580] hover:bg-[#F2F0E5] dark:hover:bg-[#282726]'}`}>{region.label}</button>
            ))}
          </div>
        </div>
        <ExpeditionMap hikes={hikes} selectedHike={selectedHike} destination={destination} onSelect={hike => locateHike(hike, false)} onPhotos={openPhotos} />
      </section>

      <section aria-labelledby="hike-list-title">
        <div className="flex items-baseline justify-between gap-3 border-b border-[#E6E4D9] dark:border-[#282726] pb-3">
          <h2 id="hike-list-title" className="font-serif text-xl font-bold">The hikes</h2>
          <span className="font-mono text-[11px] text-[#6F6E69] dark:text-[#878580]">{hikes.length} trips</span>
        </div>
        <div className="divide-y divide-[#E6E4D9] dark:divide-[#282726]">
          {sortedHikes.map(hike => {
            const date = parseHikeDate(hike.date)
            const stats = [hike.distance, hike.elevation].filter(Boolean)
            return (
              <article key={hike.num} className={`grid grid-cols-1 sm:grid-cols-[88px_minmax(0,1fr)] gap-x-6 gap-y-2 py-7 sm:py-8 ${selectedHike?.num === hike.num ? 'bg-[#F2F0E5]/40 dark:bg-[#1C1B1A]/40' : ''}`}>
                <div className="flex items-baseline gap-2 sm:block sm:pt-1.5 font-mono">
                  <p className="text-[13px] font-bold uppercase tracking-wider text-[#100F0F] dark:text-[#CECDC3]">{date.label}</p>
                  <p className="text-[12px] text-[#6F6E69] dark:text-[#878580] sm:mt-0.5">{date.year}</p>
                </div>
                <div className="min-w-0 space-y-3">
                  <div className="space-y-1">
                    <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight">{hike.name}</h3>
                    <p className="font-mono text-[11px] text-[#6F6E69] dark:text-[#878580]">
                      {[`${hike.location}, ${hike.country}`, ...stats].join('  ·  ')}
                    </p>
                  </div>
                  <p className="text-[15px] leading-relaxed text-[#282726] dark:text-[#D4D2C9] max-w-prose">{hike.description}</p>
                  {!!hike.photos?.length && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                      {hike.photos.slice(0, 4).map((photo, index) => (
                        <button key={photo.src} type="button" aria-label={`Open photo: ${photo.caption}`} onClick={() => openPhotos(hike, index)} className="group relative aspect-[4/3] rounded-sm overflow-hidden bg-[#F2F0E5] dark:bg-[#282726] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
                          <GalleryImage src={photo.src} alt={photo.caption} sizes="(max-width: 639px) calc((100vw - 50px) / 2), 180px" className="object-cover group-hover:scale-105 transition-transform duration-300" />
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-x-5 gap-y-1 font-mono text-[11px] text-[#6F6E69] dark:text-[#878580]">
                    <button type="button" onClick={() => locateHike(hike)} className="hover:text-[#100F0F] dark:hover:text-[#CECDC3] hover:underline underline-offset-4">show on map ↗</button>
                    {!!hike.photos?.length && <button type="button" onClick={() => openPhotos(hike)} className="hover:text-[#100F0F] dark:hover:text-[#CECDC3] hover:underline underline-offset-4">{hike.photos.length} photo{hike.photos.length === 1 ? '' : 's'} →</button>}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {photoHike?.photos?.length > 0 && (
        <PhotoViewer title={photoHike.name} photos={photoHike.photos.map(photo => ({ src: photo.src, alt: photo.caption, detail: `${photoHike.location}, ${photoHike.country}` }))} index={photoIndex} onIndexChange={setPhotoIndex} onClose={closePhotos} />
      )}
    </div>
  )
}
