import manifest from './generated/photo-assets.json'

interface PhotoVariant {
  src: string
  width: number
  height: number
  bytes: number
}

interface PhotoAsset {
  width: number
  height: number
  originalSrc: string
  placeholder: string
  variants: PhotoVariant[]
}

export const photoAssets: Record<string, PhotoAsset> = manifest.photos
const aliases: Record<string, string> = manifest.aliases

export function getPhotoAsset(src: string) {
  const filename = decodeURIComponent(src.split('/').pop() || '')
  return photoAssets[aliases[filename] || filename]
}

interface PhotoSources {
  src: string
  srcSet?: string
  width?: number
  height?: number
  placeholder?: string
}

export function getPhotoSources(src: string, mode: 'thumbnail' | 'display' = 'thumbnail'): PhotoSources {
  const asset = getPhotoAsset(src)
  if (!asset) return { src }
  const candidates = asset.variants.filter(variant => mode === 'thumbnail' ? variant.width <= 960 : variant.width >= 960)
  const variants = candidates.length ? candidates : asset.variants
  const fallback = variants.find(variant => variant.width >= (mode === 'thumbnail' ? 640 : 1600)) || variants[variants.length - 1]
  return {
    src: fallback.src,
    srcSet: variants.map(variant => `${variant.src} ${variant.width}w`).join(', '),
    width: asset.width,
    height: asset.height,
    placeholder: asset.placeholder,
  }
}
