'use client'

import { motion } from 'framer-motion'
import { Mountain, MapPin, Calendar, Ruler } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import Map, { Marker, Popup, NavigationControl } from '@vis.gl/react-mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'

interface Hike {
  name: string
  location: string
  country: string
  distance: string
  date: string
  lat: number
  lng: number
  description: string
}

const hikes: Hike[] = [
  {
    name: 'Pemi Loop',
    location: 'White Mountains, NH',
    country: 'USA',
    distance: '31 miles',
    date: 'Summer 2023',
    lat: 44.1689,
    lng: -71.5533,
    description: 'A challenging loop through the White Mountains featuring stunning alpine views and multiple peaks over 4,000 feet.'
  },
  {
    name: 'Fimmvörðuháls',
    location: 'Between Eyjafjallajökull and Mýrdalsjökull',
    country: 'Iceland',
    distance: '25 km',
    date: '2023',
    lat: 63.6156,
    lng: -19.4547,
    description: 'Spectacular volcanic landscape trek between two glaciers with views of craters and lava fields.'
  },
  {
    name: 'Laugavegur Trail',
    location: 'Landmannalaugar to Þórsmörk',
    country: 'Iceland',
    distance: '55 km',
    date: '2023',
    lat: 63.9753,
    lng: -19.0569,
    description: 'Iceland\'s most famous trek through colorful rhyolite mountains, hot springs, and glacial valleys.'
  },
  {
    name: 'Plain of Six Glaciers',
    location: 'Lake Louise, Banff',
    country: 'Canada',
    distance: '14 km',
    date: '2024',
    lat: 51.4254,
    lng: -116.2291,
    description: 'Stunning alpine trail with views of six glaciers, ending at a historic tea house.'
  },
  {
    name: 'Sentinel Pass',
    location: 'Moraine Lake, Banff',
    country: 'Canada',
    distance: '11.6 km',
    date: '2024',
    lat: 51.3297,
    lng: -116.1847,
    description: 'Challenging climb to one of the highest trails in Banff with breathtaking panoramic views.'
  },
  {
    name: 'Skógafoss to Þórsmörk',
    location: 'Southern Iceland',
    country: 'Iceland',
    distance: '22 km',
    date: '2023',
    lat: 63.5320,
    lng: -19.5111,
    description: 'Part of the famous Fimmvörðuháls trail, featuring waterfalls and volcanic landscapes.'
  }
]

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGV4YW1wbGUifQ.example' // You'll need to add your token

export default function Hikes() {
  const [selectedHike, setSelectedHike] = useState<Hike | null>(null)
  const [popupInfo, setPopupInfo] = useState<Hike | null>(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const mapRef = useRef<any>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  const [viewState, setViewState] = useState({
    longitude: -50,
    latitude: 55,
    zoom: 2
  })

  const flyToLocation = (hike: Hike) => {
    setSelectedHike(hike)

    // Scroll to map
    if (mapContainerRef.current) {
      // Scroll a bit further up so the map isn't hidden under any headers
      const OFFSET = 120 // px
      const el = mapContainerRef.current
      const y = el.getBoundingClientRect().top + window.pageYOffset - OFFSET
      window.scrollTo({ top: y, behavior: 'smooth' })
    }

    // Fly to location on map
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [hike.lng, hike.lat],
        zoom: 10,
        duration: 2000
      })
    }
  }

  const resetView = () => {
    setSelectedHike(null)
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [-50, 55],
        zoom: 2,
        duration: 2000
      })
    }
  }

  return (
    <div className="min-h-screen px-6 py-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 mb-16"
        >
          <div className="flex items-center space-x-3">
            <Mountain className="w-8 h-8 text-emerald-600 dark:text-emerald-500" />
            <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-zinc-100">
              Hikes & Adventures
            </h1>
          </div>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl">
            Exploring the world one trail at a time. From volcanic landscapes in Iceland to alpine peaks in the Canadian Rockies.
          </p>
        </motion.div>

        {/* Map */}
        <motion.div
          ref={mapContainerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-16"
        >
          <div className="bg-zinc-100 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <div className="h-[600px] relative">
              {!isMapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 z-10">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-zinc-600 dark:text-zinc-400">Loading map...</p>
                  </div>
                </div>
              )}
              <Map
                ref={mapRef}
                {...viewState}
                onMove={evt => setViewState(evt.viewState)}
                onLoad={() => setIsMapLoaded(true)}
                mapStyle="mapbox://styles/mapbox/outdoors-v12"
                mapboxAccessToken={MAPBOX_TOKEN}
              >
                <NavigationControl position="top-right" />

                {hikes.map((hike) => (
                  <Marker
                    key={hike.name}
                    longitude={hike.lng}
                    latitude={hike.lat}
                    anchor="bottom"
                    onClick={e => {
                      e.originalEvent.stopPropagation()
                      setPopupInfo(hike)
                      setSelectedHike(hike)
                    }}
                  >
                    <div className="cursor-pointer transition-transform hover:scale-110 duration-200">
                      <Mountain
                        className={`w-8 h-8 ${
                          selectedHike?.name === hike.name
                            ? 'text-emerald-500'
                            : 'text-blue-500'
                        }`}
                        fill="currentColor"
                      />
                    </div>
                  </Marker>
                ))}

                {popupInfo && (
                  <Popup
                    longitude={popupInfo.lng}
                    latitude={popupInfo.lat}
                    anchor="top"
                    onClose={() => setPopupInfo(null)}
                    closeButton={true}
                    closeOnClick={false}
                  >
                    <div className="p-2">
                      <h3 className="font-bold text-sm mb-1">{popupInfo.name}</h3>
                      <p className="text-xs text-zinc-600">{popupInfo.location}</p>
                      <p className="text-xs text-zinc-500 mt-1">{popupInfo.distance}</p>
                    </div>
                  </Popup>
                )}
              </Map>
            </div>
            <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-200 dark:border-zinc-700">
              <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center">
                Click markers for details • Drag to explore • Zoom in/out
              </p>
            </div>
          </div>
        </motion.div>

        {/* Selected Hike Details */}
        {selectedHike && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-16"
          >
            <div className="bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-950/20 dark:to-blue-950/20 rounded-lg p-8 border border-emerald-200 dark:border-emerald-800">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                {selectedHike.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center space-x-2 text-zinc-700 dark:text-zinc-300">
                  <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
                  <span>{selectedHike.location}, {selectedHike.country}</span>
                </div>
                <div className="flex items-center space-x-2 text-zinc-700 dark:text-zinc-300">
                  <Ruler className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
                  <span>{selectedHike.distance}</span>
                </div>
                <div className="flex items-center space-x-2 text-zinc-700 dark:text-zinc-300">
                  <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
                  <span>{selectedHike.date}</span>
                </div>
              </div>
              <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {selectedHike.description}
              </p>
            </div>
          </motion.div>
        )}

        {/* Hikes List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-8">
            All Hikes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hikes.map((hike, index) => (
              <motion.div
                key={hike.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                onClick={() => flyToLocation(hike)}
                className={`bg-zinc-100 dark:bg-zinc-900 rounded-lg p-6 border-2 transition-all cursor-pointer hover:scale-105 duration-300 ${
                  selectedHike?.name === hike.name
                    ? 'border-emerald-500 dark:border-emerald-500 shadow-lg'
                    : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                <div className="flex items-start space-x-3 mb-3">
                  <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                      {hike.name}
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {hike.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-500">
                  <span>{hike.distance}</span>
                  <span>{hike.date}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          <div className="bg-zinc-100 dark:bg-zinc-900 rounded-lg p-6 border border-zinc-200 dark:border-zinc-800 text-center transition-transform hover:scale-105 duration-300">
            <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              {hikes.length}
            </div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">Total Hikes</div>
          </div>
          <div className="bg-zinc-100 dark:bg-zinc-900 rounded-lg p-6 border border-zinc-200 dark:border-zinc-800 text-center transition-transform hover:scale-105 duration-300">
            <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              3
            </div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">Countries</div>
          </div>
          <div className="bg-zinc-100 dark:bg-zinc-900 rounded-lg p-6 border border-zinc-200 dark:border-zinc-800 text-center transition-transform hover:scale-105 duration-300">
            <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              127
            </div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">Total Miles</div>
          </div>
          <div className="bg-zinc-100 dark:bg-zinc-900 rounded-lg p-6 border border-zinc-200 dark:border-zinc-800 text-center transition-transform hover:scale-105 duration-300">
            <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              2020
            </div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">Since</div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
