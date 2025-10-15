import { Camera, Upload } from 'lucide-react'
import { getPhotos } from '@/lib/getPhotos'
import PhotoGallery from './PhotoGallery'
import PhotosHeader from './PhotosHeader'
import PhotoStats from './PhotoStats'

export const dynamic = 'force-dynamic'

export default function Photos() {
  const photos = getPhotos()

  return (
    <div className="min-h-screen px-6 py-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <PhotosHeader />

        {/* Show empty state or gallery */}
        {photos.length === 0 ? (
          <div className="mb-12">
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                No Photos Yet
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                Add photos to <code className="bg-zinc-200 dark:bg-zinc-800 px-2 py-1 rounded text-xs">/public/images/gallery/</code> to see them here.
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-500">
                Supported formats: JPG, JPEG, PNG, WebP
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Photo Gallery */}
            <PhotoGallery photos={photos} />

            {/* Stats */}
            <PhotoStats photoCount={photos.length} />
          </>
        )}
      </div>
    </div>
  )
}
