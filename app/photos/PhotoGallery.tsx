'use client'

import { useState, useCallback } from 'react'
import GalleryImage from '@/components/GalleryImage'
import PhotoViewer from '@/components/PhotoViewer'
import type { Photo } from '@/lib/getPhotos'

interface PhotoGalleryProps {
  photos: Photo[]
}

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'peru', label: 'Peru' },
  { id: 'rockies', label: 'Canadian Rockies' },
  { id: 'iceland', label: 'Iceland' },
  { id: 'white-mountains', label: 'White Mountains' },
  { id: 'pnw', label: 'Pacific Northwest' },
]

export default function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const filteredPhotos =
    selectedCategory === 'all'
      ? photos
      : photos.filter((p) => p.category === selectedCategory)

  const selectedPhoto = selectedIndex !== null ? filteredPhotos[selectedIndex] : null

  const handleClose = useCallback(() => setSelectedIndex(null), [])

  return (
    <div className="space-y-6">
      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 font-mono text-xs border-b border-[#E6E4D9] dark:border-[#282726] pb-3">
        {CATEGORIES.map((cat) => {
          const count =
            cat.id === 'all'
              ? photos.length
              : photos.filter((p) => p.category === cat.id).length

          const isActive = selectedCategory === cat.id

          return (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id)
                setSelectedIndex(null)
              }}
              className={`px-2.5 py-1 transition-colors cursor-pointer text-xs rounded-none border ${
                isActive
                  ? 'bg-[#100F0F] text-[#FFFCF0] border-[#100F0F] dark:bg-[#CECDC3] dark:text-[#161615] dark:border-[#CECDC3] font-bold'
                  : 'bg-transparent text-[#6F6E69] dark:text-[#878580] border-[#E6E4D9] dark:border-[#282726] hover:border-[#100F0F] dark:hover:border-[#CECDC3]'
              }`}
            >
              {cat.label} ({count})
            </button>
          )
        })}
      </div>

      {/* Expanded Breakout Collage (expands past standard container width) */}
      <div className="relative left-1/2 -translate-x-1/2 w-[calc(100vw-2.5rem)] sm:w-[calc(100vw-4rem)] max-w-6xl xl:max-w-7xl transition-all duration-300">
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-2 [column-fill:balance]">
          {filteredPhotos.map((photo, index) => {
            const isPortrait = photo.aspect === 'portrait'
            const isWide = photo.aspect === 'wide'

            return (
              <button
                type="button"
                aria-label={`Open photo: ${photo.alt}`}
                key={photo.filename}
                onClick={() => setSelectedIndex(index)}
                style={{ backgroundColor: photo.placeholder, contentVisibility: 'auto' }}
                className={`group block w-full text-left relative cursor-pointer overflow-hidden break-inside-avoid mb-2 bg-[#F2F0E5] dark:bg-[#1C1B1A] border border-[#E6E4D9]/80 dark:border-[#282726]/80 transition-all duration-300 hover:z-20 hover:scale-[1.025] hover:shadow-2xl rounded-sm ${
                  isPortrait
                    ? 'aspect-[3/4]'
                    : isWide
                    ? 'aspect-[16/9]'
                    : 'aspect-[4/3]'
                }`}
              >
                <GalleryImage
                  src={photo.src}
                  alt={photo.alt}
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 639px) calc(100vw - 40px), (max-width: 767px) calc((100vw - 72px) / 2), (max-width: 1023px) calc((100vw - 80px) / 3), (max-width: 1279px) 280px, 310px"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />

                {/* Hover Caption Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3 sm:p-3.5 text-white">
                  <p className="font-serif text-sm font-semibold leading-snug line-clamp-2">
                    {photo.alt}
                  </p>
                  <div className="flex items-center justify-between font-mono text-[10px] text-zinc-300 mt-1.5">
                    <span className="truncate mr-2">{photo.location}</span>
                    <span className="flex-shrink-0">{photo.date}</span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {selectedPhoto && selectedIndex !== null && (
        <PhotoViewer
          title={selectedPhoto.categoryLabel}
          photos={filteredPhotos.map(photo => ({
            src: photo.src,
            alt: photo.alt,
            detail: `${photo.location} · ${photo.date}`,
            originalSrc: photo.originalSrc,
          }))}
          index={selectedIndex}
          onIndexChange={setSelectedIndex}
          onClose={handleClose}
        />
      )}
    </div>
  )
}
