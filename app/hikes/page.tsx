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
  { id: 'peru', label: 'Peru', lat: -13.25, lng: -72.55, zoom: 8.5 },
  { id: 'canada', label: 'Canada', lat: 51.38, lng: -116.2, zoom: 9 },
  { id: 'iceland', label: 'Iceland', lat: 63.75, lng: -19.3, zoom: 8 },
  { id: 'usa', label: 'White Mountains', lat: 44.17, lng: -71.58, zoom: 9.5 },
]

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
        <p className="text-sm leading-relaxed text-[#6F6E69] dark:text-[#878580]">A few favorite hikes through Peru, the Canadian Rockies, Iceland, and the White Mountains.</p>
      </div>

      <section ref={mapContainerRef} aria-label="Hiking destinations" className="scroll-mt-6 rounded-lg overflow-hidden border border-[#E6E4D9] dark:border-[#282726]">
        <div className="px-4 py-3 flex flex-wrap items-center justify-between gap-3 bg-[#FFFCF0] dark:bg-[#161615]">
          <p className="font-serif text-sm">{selectedHike?.name || 'Places I’ve hiked'}</p>
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
          {hikes.map(hike => (
            <article key={hike.num} className={`py-6 sm:py-7 space-y-4 ${selectedHike?.num === hike.num ? 'bg-[#F2F0E5]/40 dark:bg-[#1C1B1A]/40' : ''}`}>
              <div className="flex flex-wrap items-start justify-between gap-x-5 gap-y-2">
                <div className="space-y-1">
                  <h3 className="font-serif text-xl font-bold tracking-tight">{hike.name}</h3>
                  <p className="text-xs text-[#6F6E69] dark:text-[#878580]">{hike.location}, {hike.country}</p>
                </div>
                <span className="font-mono text-[11px] text-[#6F6E69] dark:text-[#878580] pt-1">{hike.date}</span>
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-[#6F6E69] dark:text-[#878580]">
                <span><span className="text-[#100F0F] dark:text-[#CECDC3]">Distance</span> {hike.distance}</span>
                {hike.elevation && <span><span className="text-[#100F0F] dark:text-[#CECDC3]">Elevation</span> {hike.elevation}</span>}
              </div>
              <p className="text-sm leading-relaxed text-[#282726] dark:text-[#D4D2C9] max-w-prose">{hike.description}</p>
              {!!hike.photos?.length && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {hike.photos.slice(0, 4).map((photo, index) => (
                    <button key={photo.src} type="button" aria-label={`Open photo: ${photo.caption}`} onClick={() => openPhotos(hike, index)} className="group relative aspect-[4/3] rounded-md overflow-hidden bg-[#F2F0E5] dark:bg-[#282726] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
                      <GalleryImage src={photo.src} alt={photo.caption} sizes="(max-width: 639px) calc((100vw - 50px) / 2), 200px" className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    </button>
                  ))}
                </div>
              )}
              <div className="flex flex-wrap gap-5 text-xs text-[#6F6E69] dark:text-[#878580]">
                <button type="button" onClick={() => locateHike(hike)} className="underline underline-offset-4 hover:text-[#100F0F] dark:hover:text-[#CECDC3]">Show on map ↗</button>
                {!!hike.photos?.length && <button type="button" onClick={() => openPhotos(hike)} className="underline underline-offset-4 hover:text-[#100F0F] dark:hover:text-[#CECDC3]">View {hike.photos.length} photos →</button>}
              </div>
            </article>
          ))}
        </div>
      </section>

      {photoHike?.photos?.length > 0 && (
        <PhotoViewer title={photoHike.name} photos={photoHike.photos.map(photo => ({ src: photo.src, alt: photo.caption, detail: `${photoHike.location}, ${photoHike.country}` }))} index={photoIndex} onIndexChange={setPhotoIndex} onClose={closePhotos} />
      )}
    </div>
  )
}
