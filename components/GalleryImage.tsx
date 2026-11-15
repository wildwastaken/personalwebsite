import { getPhotoSources } from '@/lib/photoAssets'

interface GalleryImageProps {
  src: string
  alt: string
  sizes: string
  className?: string
  mode?: 'thumbnail' | 'display'
  loading?: 'lazy' | 'eager'
}

export default function GalleryImage({ src, alt, sizes, className = '', mode = 'thumbnail', loading = 'lazy' }: GalleryImageProps) {
  const source = getPhotoSources(src, mode)
  return (
    // These responsive files are generated at build time; serving them directly avoids request-time resizing.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={source.src}
      srcSet={source.srcSet}
      sizes={sizes}
      alt={alt}
      width={source.width}
      height={source.height}
      loading={loading}
      decoding="async"
      className={`absolute inset-0 w-full h-full ${className}`}
    />
  )
}
