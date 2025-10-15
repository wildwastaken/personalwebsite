'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'

interface Photo {
  id: number
  src: string
  alt: string
  filename: string
}

interface PhotoGalleryProps {
  photos: Photo[]
}

export default function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)

  return (
    <>
      {/* Masonry Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-16"
      >
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.05 }}
              className="break-inside-avoid relative overflow-hidden rounded-lg cursor-pointer group bg-zinc-200 dark:bg-zinc-800"
              onClick={() => setSelectedPhoto(photo)}
            >
              <div className="relative">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={800}
                  height={600}
                  className="w-full h-auto transition-transform duration-500 group-hover:scale-110"
                  style={{ display: 'block' }}
                  loading={index < 8 ? "eager" : "lazy"}
                  quality={75}
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center p-4">
                    <p className="text-sm font-medium">{photo.alt}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 sm:p-8"
          onClick={() => setSelectedPhoto(null)}
        >
          {/* Close button - fixed to top right corner */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              setSelectedPhoto(null)
            }}
            className="fixed top-4 right-4 sm:top-8 sm:right-8 z-10 p-2 rounded-full bg-zinc-800/50 hover:bg-zinc-700/50 text-white hover:text-zinc-300 transition-all backdrop-blur-sm"
            aria-label="Close"
          >
            <X className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>

          {/* Image container */}
          <div
            className="relative max-w-7xl max-h-[90vh] w-full h-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={selectedPhoto.src}
                alt={selectedPhoto.alt}
                width={1920}
                height={1080}
                className="max-w-full max-h-[80vh] w-auto h-auto object-contain rounded-lg"
                priority
                quality={90}
              />
            </div>
            <div className="mt-4 text-white text-center">
              <p className="text-lg font-semibold">{selectedPhoto.alt}</p>
              <p className="text-sm text-zinc-400">{selectedPhoto.filename}</p>
            </div>
          </div>
        </motion.div>
      )}
    </>
  )
}
