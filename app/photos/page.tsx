import { getPhotos } from '@/lib/getPhotos'
import PhotoGallery from './PhotoGallery'
import PhotosHeader from './PhotosHeader'
import PhotoStats from './PhotoStats'

export default function Photos() {
  const photos = getPhotos()

  return (
    <div className="space-y-8">
      <PhotosHeader />

      {photos.length === 0 ? (
        <div className="border border-[#E6E4D9] dark:border-[#282726] p-8 text-center font-mono text-xs text-[#6F6E69] dark:text-[#878580]">
          No photos yet.
        </div>
      ) : (
        <>
          <PhotoGallery photos={photos} />
          <PhotoStats photoCount={photos.length} />
        </>
      )}
    </div>
  )
}
