import fs from 'fs'
import path from 'path'

export interface Photo {
  id: number
  src: string
  alt: string
  filename: string
}

export function getPhotos(): Photo[] {
  const galleryDir = path.join(process.cwd(), 'public', 'images', 'gallery')

  // Create directory if it doesn't exist
  if (!fs.existsSync(galleryDir)) {
    fs.mkdirSync(galleryDir, { recursive: true })
    return []
  }

  // Read all files from the gallery directory
  const files = fs.readdirSync(galleryDir)

  // Filter for image files (jpg, jpeg, png, webp)
  const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase()
    return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext)
  })

  // Sort files alphabetically for consistent ordering
  imageFiles.sort()

  // Map files to Photo objects
  const photos: Photo[] = imageFiles.map((file, index) => ({
    id: index + 1,
    src: `/images/gallery/${file}`,
    alt: file.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '), // Convert filename to alt text
    filename: file
  }))

  return photos
}
