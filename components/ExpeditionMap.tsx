'use client'

import { useEffect, useRef, useState } from 'react'
import Map, { Marker, Popup, NavigationControl, type MapRef } from '@vis.gl/react-mapbox'
import type { Hike } from '@/lib/hikes'
import 'mapbox-gl/dist/mapbox-gl.css'

export interface MapDestination {
  lat: number
  lng: number
  zoom: number
  requestId: number
}

interface ExpeditionMapProps {
  hikes: Hike[]
  selectedHike: Hike | null
  destination: MapDestination | null
  onSelect: (hike: Hike) => void
  onPhotos: (hike: Hike) => void
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
const INITIAL_VIEW = { longitude: -40, latitude: 25, zoom: 1.8 }

export default function ExpeditionMap({ hikes, selectedHike, destination, onSelect, onPhotos }: ExpeditionMapProps) {
  const mapRef = useRef<MapRef>(null)
  const lastFlight = useRef<number | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [attempt, setAttempt] = useState(0)
  const [popupOpen, setPopupOpen] = useState(true)

  useEffect(() => {
    if (status !== 'loading') return
    const timer = window.setTimeout(() => setStatus(current => current === 'loading' ? 'error' : current), 12000)
    return () => window.clearTimeout(timer)
  }, [status, attempt])

  useEffect(() => {
    if (status !== 'ready' || !destination || !mapRef.current || lastFlight.current === destination.requestId) return
    lastFlight.current = destination.requestId
    setPopupOpen(true)
    mapRef.current.flyTo({ center: [destination.lng, destination.lat], zoom: destination.zoom, duration: 4200 })
  }, [status, destination])

  const retry = () => {
    lastFlight.current = null
    setAttempt(value => value + 1)
    setStatus('loading')
  }

  return (
    <div className="relative h-[380px] sm:h-[460px] bg-[#F2F0E5] dark:bg-[#1C1B1A]">
      {status !== 'error' && (
        <Map
          key={attempt}
          ref={mapRef}
          initialViewState={INITIAL_VIEW}
          projection={{ name: 'globe' }}
          onLoad={() => setStatus('ready')}
          onError={() => setStatus(current => current === 'loading' ? 'error' : current)}
          mapStyle="mapbox://styles/mapbox/outdoors-v12"
          mapboxAccessToken={MAPBOX_TOKEN}
          scrollZoom={false}
        >
          <NavigationControl position="top-right" showCompass={false} />
          {hikes.map(hike => (
            <Marker key={hike.num} longitude={hike.lng} latitude={hike.lat} anchor="center">
              <button type="button" aria-label={`Show ${hike.name} on the map`} onClick={event => { event.stopPropagation(); onSelect(hike); setPopupOpen(true) }} className="p-2 group">
                <span className={`block rounded-full border-2 border-white shadow-md transition-transform group-hover:scale-125 group-focus-visible:scale-125 ${selectedHike?.num === hike.num ? 'w-4 h-4 bg-[#405D4A]' : 'w-3 h-3 bg-[#718F7C]'}`} />
              </button>
            </Marker>
          ))}
          {selectedHike && popupOpen && status === 'ready' && (
            <Popup longitude={selectedHike.lng} latitude={selectedHike.lat} anchor="top" closeOnClick={false} onClose={() => setPopupOpen(false)} maxWidth="280px">
              <div className="p-2 font-serif text-[#100F0F]">
                <p className="text-[11px] text-[#6F6E69] mb-1">{selectedHike.location}, {selectedHike.country}</p>
                <h3 className="text-base font-bold leading-snug">{selectedHike.name}</h3>
                <p className="text-xs text-[#6F6E69] mt-2">{selectedHike.distance} · {selectedHike.elevation}</p>
                {!!selectedHike.photos?.length && <button type="button" onClick={() => onPhotos(selectedHike)} className="text-xs underline underline-offset-4 mt-3">View photos →</button>}
              </div>
            </Popup>
          )}
        </Map>
      )}
      {status === 'loading' && <div className="absolute inset-0 z-10 grid place-items-center bg-[#F2F0E5]/90 dark:bg-[#1C1B1A]/90 text-sm text-[#6F6E69] dark:text-[#878580]">Opening the map…</div>}
      {status === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
          <p className="font-serif text-lg">The map couldn&apos;t load.</p>
          <p className="text-sm text-[#6F6E69] dark:text-[#878580]">You can still browse the hikes and photos below.</p>
          <button type="button" onClick={retry} className="text-sm rounded-full border border-[#C8C6BA] dark:border-[#575653] px-4 py-1.5 hover:bg-[#E6E4D9]/50 dark:hover:bg-[#282726]">Try again</button>
        </div>
      )}
    </div>
  )
}
