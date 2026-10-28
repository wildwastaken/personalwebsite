export type DitherAlgorithm = 'bayer' | 'floyd-steinberg' | 'threshold' | 'contour'

export interface MountainPreset {
  id: string
  name: string
  location: string
  imageSrc: string
}

export const MOUNTAIN_PRESETS: MountainPreset[] = [
  {
    id: 'salkantay',
    name: 'Salkantay Pass',
    location: 'Peruvian Andes (4,630m)',
    imageSrc: '/images/gallery/peru-salkantay-horse-trek.jpeg',
  },
  {
    id: 'moraine',
    name: 'Valley of Ten Peaks',
    location: 'Canadian Rockies (Banff)',
    imageSrc: '/images/gallery/moraine-lake-fav.jpeg',
  },
  {
    id: 'iceland',
    name: 'Skógá Volcanic Gorge',
    location: 'Highlands of Iceland',
    imageSrc: '/images/gallery/iceland-skogafoss-fav.jpeg',
  },
  {
    id: 'machu-picchu',
    name: 'Machu Picchu Citadel',
    location: 'Andean Cloud Forest',
    imageSrc: '/images/gallery/peru-machu-picchu-clouds.jpeg',
  },
  {
    id: 'lafayette',
    name: 'Mount Lafayette Spine',
    location: 'White Mountains, NH',
    imageSrc: '/images/gallery/lafayette-ridge-fav.jpeg',
  },
]

// 4x4 Bayer Dithering Matrix normalized (0 to 255)
const BAYER_4X4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
].map((row) => row.map((v) => Math.round((v / 16) * 255)))

/**
 * Process an HTMLImageElement through a chosen dithering algorithm
 * and render the pixel art into the provided canvas.
 */
export function ditherImageToCanvas(
  img: HTMLImageElement,
  canvas: HTMLCanvasElement,
  options: {
    algorithm?: DitherAlgorithm
    targetWidth?: number
    targetHeight?: number
    isDarkMode?: boolean
    contrast?: number
  } = {}
) {
  const {
    algorithm = 'bayer',
    targetWidth = 180,
    targetHeight = 90,
    isDarkMode = false,
    contrast = 1.25,
  } = options

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Create temporary sampling canvas
  const sampleCanvas = document.createElement('canvas')
  sampleCanvas.width = targetWidth
  sampleCanvas.height = targetHeight
  const sampleCtx = sampleCanvas.getContext('2d')
  if (!sampleCtx) return

  // Draw image scaled down to target pixel resolution
  sampleCtx.drawImage(img, 0, 0, targetWidth, targetHeight)
  const imgData = sampleCtx.getImageData(0, 0, targetWidth, targetHeight)
  const data = imgData.data

  // Prepare destination canvas
  canvas.width = targetWidth
  canvas.height = targetHeight
  const outputData = ctx.createImageData(targetWidth, targetHeight)
  const out = outputData.data

  // Palette definitions
  // Paper mode: foreground = warm dark ink (#100F0F), background = transparent or warm paper
  // Dark mode: foreground = chalk white (#CECDC3), background = transparent
  const fgR = isDarkMode ? 206 : 16
  const fgG = isDarkMode ? 205 : 15
  const fgB = isDarkMode ? 195 : 15

  // First convert to grayscale with contrast curve
  const gray = new Float32Array(targetWidth * targetHeight)
  for (let i = 0; i < data.length; i += 4) {
    // Relative luminance
    let lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
    // Apply contrast
    lum = (lum - 128) * contrast + 128
    gray[i / 4] = Math.max(0, Math.min(255, lum))
  }

  if (algorithm === 'bayer') {
    for (let y = 0; y < targetHeight; y++) {
      for (let x = 0; x < targetWidth; x++) {
        const idx = y * targetWidth + x
        const outIdx = idx * 4
        const threshold = BAYER_4X4[y % 4][x % 4]
        const isInk = isDarkMode ? gray[idx] > threshold : gray[idx] < threshold

        if (isInk) {
          out[outIdx] = fgR
          out[outIdx + 1] = fgG
          out[outIdx + 2] = fgB
          out[outIdx + 3] = 255
        } else {
          out[outIdx + 3] = 0 // transparent background for seamless blending
        }
      }
    }
  } else if (algorithm === 'floyd-steinberg') {
    // Copy grayscale buffer for error diffusion
    const buffer = new Float32Array(gray)

    for (let y = 0; y < targetHeight; y++) {
      for (let x = 0; x < targetWidth; x++) {
        const idx = y * targetWidth + x
        const oldVal = buffer[idx]
        const newVal = oldVal < 128 ? 0 : 255
        const err = oldVal - newVal
        const isInk = isDarkMode ? newVal === 255 : newVal === 0

        const outIdx = idx * 4
        if (isInk) {
          out[outIdx] = fgR
          out[outIdx + 1] = fgG
          out[outIdx + 2] = fgB
          out[outIdx + 3] = 255
        } else {
          out[outIdx + 3] = 0
        }

        // Diffuse error to neighbors
        if (x + 1 < targetWidth) buffer[idx + 1] += (err * 7) / 16
        if (x - 1 >= 0 && y + 1 < targetHeight)
          buffer[(y + 1) * targetWidth + (x - 1)] += (err * 3) / 16
        if (y + 1 < targetHeight)
          buffer[(y + 1) * targetWidth + x] += (err * 5) / 16
        if (x + 1 < targetWidth && y + 1 < targetHeight)
          buffer[(y + 1) * targetWidth + (x + 1)] += (err * 1) / 16
      }
    }
  } else if (algorithm === 'threshold') {
    for (let i = 0; i < gray.length; i++) {
      const outIdx = i * 4
      const isInk = isDarkMode ? gray[i] > 128 : gray[i] < 128
      if (isInk) {
        out[outIdx] = fgR
        out[outIdx + 1] = fgG
        out[outIdx + 2] = fgB
        out[outIdx + 3] = 255
      } else {
        out[outIdx + 3] = 0
      }
    }
  } else if (algorithm === 'contour') {
    // Simple edge detection contour filter
    for (let y = 0; y < targetHeight - 1; y++) {
      for (let x = 0; x < targetWidth - 1; x++) {
        const idx = y * targetWidth + x
        const dx = Math.abs(gray[idx] - gray[idx + 1])
        const dy = Math.abs(gray[idx] - gray[idx + targetWidth])
        const edge = dx + dy
        const isInk = edge > 35

        const outIdx = idx * 4
        if (isInk) {
          out[outIdx] = fgR
          out[outIdx + 1] = fgG
          out[outIdx + 2] = fgB
          out[outIdx + 3] = 255
        } else {
          out[outIdx + 3] = 0
        }
      }
    }
  }

  ctx.putImageData(outputData, 0, 0)
}
