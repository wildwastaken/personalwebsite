'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useTheme } from '@/components/ThemeProvider'

// Palette Definitions
interface Palette {
  id: string
  name: string
  colors: [number, number, number][] // RGB triples
  description: string
}

const PRESET_PALETTES: Palette[] = [
  {
    id: 'alpine-sunset',
    name: 'Alpine Sunset (Alpenglow)',
    description: 'Peach, amber, deep indigo, dusty lavender, and cream',
    colors: [
      [255, 252, 240], // Paper cream
      [250, 218, 175], // Amber peach
      [237, 165, 121], // Warm alpenglow
      [189, 107, 114], // Dusty rose
      [112, 74, 110],  // Twilight violet
      [58, 48, 86],    // Indigo shadow
      [28, 26, 46],    // Night blue
      [16, 15, 15],    // Darkest ink
    ],
  },
  {
    id: 'misty-forest',
    name: 'Misty Pine Forest',
    description: 'Emerald, sage, moss, dawn gold, and morning fog',
    colors: [
      [255, 252, 240], // Pale fog
      [232, 224, 185], // Dawn mist
      [184, 199, 168], // Sage green
      [122, 158, 126], // Moss green
      [68, 112, 92],   // Deep pine
      [41, 74, 62],    // Shadow spruce
      [23, 46, 38],    // Forest floor
      [16, 26, 20],    // Deep ink
    ],
  },
  {
    id: 'glacial-lake',
    name: 'Glacial Tarn & Peaks',
    description: 'Turquoise, sapphire, ice blue, pine, and granite',
    colors: [
      [255, 252, 240], // Ivory snow
      [205, 230, 237], // Glacial ice
      [130, 186, 204], // Turquoise water
      [73, 137, 168],  // Deep lake
      [48, 88, 125],   // Mountain shadow
      [36, 56, 82],    // Abyssal blue
      [31, 41, 43],    // Granite shoreline
      [16, 20, 25],    // Midnight
    ],
  },
  {
    id: 'pc98-retro',
    name: 'Classic PC-98 / 16-Color',
    description: 'Authentic 1980s PC adventure game 16-color palette',
    colors: [
      [0, 0, 0],
      [0, 0, 170],
      [0, 170, 0],
      [0, 170, 170],
      [170, 0, 0],
      [170, 0, 170],
      [170, 85, 0],
      [170, 170, 170],
      [85, 85, 85],
      [85, 85, 255],
      [85, 255, 85],
      [85, 255, 255],
      [255, 85, 85],
      [255, 85, 255],
      [255, 255, 85],
      [255, 255, 255],
    ],
  },
  {
    id: 'gameboy-mono',
    name: 'Game Boy Monochrome',
    description: 'Classic 4-shade retro handheld palette',
    colors: [
      [255, 252, 240], // Lightest cream
      [180, 178, 160], // Mid-light
      [90, 88, 80],    // Mid-dark
      [16, 15, 15],    // Ink black
    ],
  },
]

const SAMPLE_IMAGES = [
  { name: 'Salkantay Andes', src: '/images/gallery/peru-salkantay-trail-allen.jpeg' },
  { name: 'Moraine Lake', src: '/images/gallery/moraine-lake-fav.jpeg' },
  { name: 'Lafayette Ridge', src: '/images/gallery/lafayette-ridge-fav.jpeg' },
  { name: 'Skógafoss Gorge', src: '/images/gallery/iceland-skogafoss-fav.jpeg' },
  { name: 'Andean Horses', src: '/images/gallery/peru-salkantay-horse-trek.jpeg' },
]

export default function ArtGenPage() {
  const { theme } = useTheme()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // Configuration state
  const [currentImageSrc, setCurrentImageSrc] = useState<string>(SAMPLE_IMAGES[0].src)
  const [pixelWidth, setPixelWidth] = useState<number>(128)
  const [selectedPaletteId, setSelectedPaletteId] = useState<string>('alpine-sunset')
  const [ditherMode, setDitherMode] = useState<'none' | 'bayer' | 'floyd'>('none')
  const [contrast, setContrast] = useState<number>(1.25)
  const [brightness, setBrightness] = useState<number>(1.0)
  const [saturation, setSaturation] = useState<number>(1.1)
  const [maskMode, setMaskMode] = useState<'u-shape' | 'sky-fade' | 'none'>('u-shape')
  const [previewBg, setPreviewBg] = useState<'paper' | 'dark'>('paper')
  const [statusMessage, setStatusMessage] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState<boolean>(false)

  // Color distance helper
  const findClosestColor = (
    r: number,
    g: number,
    b: number,
    palette: [number, number, number][]
  ): [number, number, number] => {
    let bestDist = Infinity
    let best = palette[0]
    for (const c of palette) {
      // Perceptual color weighting
      const dr = r - c[0]
      const dg = g - c[1]
      const db = b - c[2]
      const dist = 0.299 * dr * dr + 0.587 * dg * dg + 0.114 * db * db
      if (dist < bestDist) {
        bestDist = dist
        best = c
      }
    }
    return best
  }

  // Bayer 4x4 matrix
  const bayerMatrix4x4 = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5],
  ]

  // Render generator logic
  const generatePixelArt = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    setIsProcessing(true)
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = currentImageSrc

    img.onload = () => {
      const aspect = img.height / img.width
      const targetW = pixelWidth
      const targetH = Math.round(targetW * aspect)

      // Offscreen low-res canvas
      const offscreen = document.createElement('canvas')
      offscreen.width = targetW
      offscreen.height = targetH
      const offCtx = offscreen.getContext('2d')
      if (!offCtx) return

      // Draw and apply adjustments
      offCtx.drawImage(img, 0, 0, targetW, targetH)
      const imgData = offCtx.getImageData(0, 0, targetW, targetH)
      const data = imgData.data

      const palette =
        PRESET_PALETTES.find((p) => p.id === selectedPaletteId)?.colors ||
        PRESET_PALETTES[0].colors

      // 1. Adjust brightness, contrast, saturation
      for (let i = 0; i < data.length; i += 4) {
        let r = data[i]
        let g = data[i + 1]
        let b = data[i + 2]

        // Brightness
        r *= brightness
        g *= brightness
        b *= brightness

        // Contrast
        r = (r - 128) * contrast + 128
        g = (g - 128) * contrast + 128
        b = (b - 128) * contrast + 128

        // Saturation
        const gray = 0.299 * r + 0.587 * g + 0.114 * b
        r = gray + (r - gray) * saturation
        g = gray + (g - gray) * saturation
        b = gray + (b - gray) * saturation

        data[i] = Math.max(0, Math.min(255, r))
        data[i + 1] = Math.max(0, Math.min(255, g))
        data[i + 2] = Math.max(0, Math.min(255, b))
      }

      // 2. Dithering & Color Quantization
      if (ditherMode === 'bayer') {
        const spread = 24
        for (let y = 0; y < targetH; y++) {
          for (let x = 0; x < targetW; x++) {
            const idx = (y * targetW + x) * 4
            const bayerVal = (bayerMatrix4x4[y % 4][x % 4] / 16 - 0.5) * spread
            const r = Math.max(0, Math.min(255, data[idx] + bayerVal))
            const g = Math.max(0, Math.min(255, data[idx + 1] + bayerVal))
            const b = Math.max(0, Math.min(255, data[idx + 2] + bayerVal))

            const matched = findClosestColor(r, g, b, palette)
            data[idx] = matched[0]
            data[idx + 1] = matched[1]
            data[idx + 2] = matched[2]
          }
        }
      } else if (ditherMode === 'floyd') {
        for (let y = 0; y < targetH; y++) {
          for (let x = 0; x < targetW; x++) {
            const idx = (y * targetW + x) * 4
            const oldR = data[idx]
            const oldG = data[idx + 1]
            const oldB = data[idx + 2]

            const matched = findClosestColor(oldR, oldG, oldB, palette)
            data[idx] = matched[0]
            data[idx + 1] = matched[1]
            data[idx + 2] = matched[2]

            const errR = oldR - matched[0]
            const errG = oldG - matched[1]
            const errB = oldB - matched[2]

            const distribute = (nx: number, ny: number, factor: number) => {
              if (nx >= 0 && nx < targetW && ny >= 0 && ny < targetH) {
                const nIdx = (ny * targetW + nx) * 4
                data[nIdx] += errR * factor
                data[nIdx + 1] += errG * factor
                data[nIdx + 2] += errB * factor
              }
            }

            distribute(x + 1, y, 7 / 16)
            distribute(x - 1, y + 1, 3 / 16)
            distribute(x, y + 1, 5 / 16)
            distribute(x + 1, y + 1, 1 / 16)
          }
        }
      } else {
        // Clean cluster quantization (no dither)
        for (let i = 0; i < data.length; i += 4) {
          const matched = findClosestColor(data[i], data[i + 1], data[i + 2], palette)
          data[i] = matched[0]
          data[i + 1] = matched[1]
          data[i + 2] = matched[2]
        }
      }

      offCtx.putImageData(imgData, 0, 0)

      // 3. Render onto final display canvas (upscaled with crisp nearest neighbor)
      const displayW = 960
      const displayH = Math.round(displayW * aspect)
      canvas.width = displayW
      canvas.height = displayH
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.imageSmoothingEnabled = false
      ctx.drawImage(offscreen, 0, 0, displayW, displayH)
      setIsProcessing(false)
    }
  }, [
    currentImageSrc,
    pixelWidth,
    selectedPaletteId,
    ditherMode,
    contrast,
    brightness,
    saturation,
  ])

  useEffect(() => {
    generatePixelArt()
  }, [generatePixelArt])

  // Handle image upload from user
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setCurrentImageSrc(event.target.result as string)
          setStatusMessage('Loaded custom image!')
          setTimeout(() => setStatusMessage(''), 3000)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  // Export / Download PNG
  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `pixel-scape-${selectedPaletteId}-${pixelWidth}px.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      {/* Studio Header */}
      <div className="border-b border-[#E6E4D9] dark:border-[#282726] pb-4 space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase px-1.5 py-0.5 bg-[#100F0F] text-[#FFFCF0] dark:bg-[#CECDC3] dark:text-[#161615] font-bold">
              LAB / 001
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#100F0F] dark:text-[#CECDC3]">
              TopoPixel
            </h1>
          </div>
          <Link
            href="/projects"
            className="font-mono text-xs text-[#6F6E69] dark:text-[#878580] hover:text-[#100F0F] dark:hover:text-[#CECDC3] underline"
          >
            &larr; projects
          </Link>
        </div>
        <p className="text-sm text-[#6F6E69] dark:text-[#878580] leading-relaxed">
          Upload any photo to generate stylized 16-bit retro pixel art landscapes. Tweak pixel resolution,
          color palettes, and dithering, then download your artwork as a PNG.
        </p>
      </div>

      {/* Main Studio Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Canvas Preview */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between font-mono text-xs text-[#6F6E69] dark:text-[#878580]">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#100F0F] dark:text-[#CECDC3]">Canvas Preview</span>
              {isProcessing && <span className="animate-pulse text-amber-600">rendering...</span>}
            </div>
            <div className="flex items-center gap-2">
              <span>preview bg:</span>
              <button
                onClick={() => setPreviewBg('paper')}
                className={`cursor-pointer px-1.5 py-0.5 border ${
                  previewBg === 'paper'
                    ? 'border-[#100F0F] font-bold bg-[#FFFCF0] text-[#100F0F]'
                    : 'border-transparent text-[#6F6E69]'
                }`}
              >
                paper
              </button>
              <button
                onClick={() => setPreviewBg('dark')}
                className={`cursor-pointer px-1.5 py-0.5 border ${
                  previewBg === 'dark'
                    ? 'border-[#CECDC3] font-bold bg-[#161615] text-[#CECDC3]'
                    : 'border-transparent text-[#6F6E69]'
                }`}
              >
                dark
              </button>
            </div>
          </div>

          {/* Interactive Screen Preview Container with U-shape mask support */}
          <div
            className={`border border-[#E6E4D9] dark:border-[#282726] p-4 transition-colors ${
              previewBg === 'paper' ? 'bg-[#FFFCF0]' : 'bg-[#161615]'
            }`}
          >
            <div
              className={`relative overflow-hidden w-full transition-all ${
                maskMode === 'u-shape'
                  ? '[mask-image:radial-gradient(ellipse_75%_85%_at_50%_-15%,transparent_45%,rgba(0,0,0,0.4)_65%,black_88%)]'
                  : maskMode === 'sky-fade'
                  ? '[mask-image:linear-gradient(to_top,black_50%,rgba(0,0,0,0.8)_70%,transparent_100%)]'
                  : ''
              }`}
            >
              <canvas
                ref={canvasRef}
                className={`w-full h-auto block [image-rendering:pixelated] ${
                  previewBg === 'paper'
                    ? 'mix-blend-multiply'
                    : 'mix-blend-screen brightness-90'
                }`}
              />
            </div>
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 font-mono text-xs text-emerald-800 dark:text-emerald-200">
              {statusMessage}
            </div>
          )}

          {/* Quick Sample Photos */}
          <div className="pt-2">
            <span className="font-mono text-xs text-[#6F6E69] dark:text-[#878580] mr-2">
              Sample photos:
            </span>
            <div className="inline-flex flex-wrap gap-1.5 mt-1 font-mono text-xs">
              {SAMPLE_IMAGES.map((sample) => (
                <button
                  key={sample.name}
                  onClick={() => setCurrentImageSrc(sample.src)}
                  className={`px-2 py-0.5 border text-xs cursor-pointer ${
                    currentImageSrc === sample.src
                      ? 'border-[#100F0F] bg-[#100F0F] text-white dark:border-[#CECDC3] dark:bg-[#CECDC3] dark:text-black font-bold'
                      : 'border-[#E6E4D9] dark:border-[#282726] hover:border-[#100F0F] dark:hover:border-[#CECDC3]'
                  }`}
                >
                  {sample.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Controls & Studio Settings */}
        <div className="lg:col-span-4 space-y-5 font-mono text-xs">
          {/* File Upload Box */}
          <div className="p-3 border border-[#E6E4D9] dark:border-[#282726] bg-[#F2F0E5]/40 dark:bg-[#1C1B1A]/40 space-y-2">
            <div className="font-bold text-[#100F0F] dark:text-[#CECDC3]">
              1. Source Image
            </div>
            <label className="block">
              <span className="sr-only">Choose image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="block w-full text-xs text-[#6F6E69] dark:text-[#878580] file:mr-2 file:py-1 file:px-2 file:border file:border-[#E6E4D9] dark:file:border-[#282726] file:text-xs file:bg-white dark:file:bg-[#1C1B1A] file:cursor-pointer hover:file:bg-black hover:file:text-white"
              />
            </label>
          </div>

          {/* Pixel Resolution / Chunkiness */}
          <div className="p-3 border border-[#E6E4D9] dark:border-[#282726] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#100F0F] dark:text-[#CECDC3]">
                2. Pixel Density
              </span>
              <span className="text-[#6F6E69] dark:text-[#878580]">{pixelWidth}px width</span>
            </div>
            <input
              type="range"
              min="48"
              max="256"
              step="16"
              value={pixelWidth}
              onChange={(e) => setPixelWidth(Number(e.target.value))}
              className="w-full cursor-pointer accent-[#100F0F] dark:accent-[#CECDC3]"
            />
            <div className="flex justify-between text-[10px] text-[#6F6E69] dark:text-[#878580]">
              <button
                onClick={() => setPixelWidth(64)}
                className="underline cursor-pointer bg-transparent border-0 p-0"
              >
                Chunky (64)
              </button>
              <button
                onClick={() => setPixelWidth(128)}
                className="underline cursor-pointer bg-transparent border-0 p-0"
              >
                16-Bit (128)
              </button>
              <button
                onClick={() => setPixelWidth(200)}
                className="underline cursor-pointer bg-transparent border-0 p-0"
              >
                Fine (200)
              </button>
            </div>
          </div>

          {/* Color Palette Theme */}
          <div className="p-3 border border-[#E6E4D9] dark:border-[#282726] space-y-2">
            <div className="font-bold text-[#100F0F] dark:text-[#CECDC3]">
              3. Color Palette
            </div>
            <select
              value={selectedPaletteId}
              onChange={(e) => setSelectedPaletteId(e.target.value)}
              className="w-full p-1 bg-transparent border border-[#E6E4D9] dark:border-[#282726] text-xs font-mono cursor-pointer"
            >
              {PRESET_PALETTES.map((p) => (
                <option key={p.id} value={p.id} className="dark:bg-[#161615]">
                  {p.name}
                </option>
              ))}
            </select>
            <div className="text-[11px] text-[#6F6E69] dark:text-[#878580]">
              {PRESET_PALETTES.find((p) => p.id === selectedPaletteId)?.description}
            </div>
          </div>

          {/* Dither Mode */}
          <div className="p-3 border border-[#E6E4D9] dark:border-[#282726] space-y-2">
            <div className="font-bold text-[#100F0F] dark:text-[#CECDC3]">
              4. Dithering
            </div>
            <div className="grid grid-cols-3 gap-1">
              {(['none', 'bayer', 'floyd'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setDitherMode(mode)}
                  className={`py-1 text-center border cursor-pointer ${
                    ditherMode === mode
                      ? 'border-[#100F0F] bg-[#100F0F] text-white dark:border-[#CECDC3] dark:bg-[#CECDC3] dark:text-black font-bold'
                      : 'border-[#E6E4D9] dark:border-[#282726]'
                  }`}
                >
                  {mode === 'none' ? 'Flat' : mode === 'bayer' ? 'Bayer 4x4' : 'Diffusion'}
                </button>
              ))}
            </div>
          </div>

          {/* Horizon Integration Mask */}
          <div className="p-3 border border-[#E6E4D9] dark:border-[#282726] space-y-2">
            <div className="font-bold text-[#100F0F] dark:text-[#CECDC3]">
              5. Horizon Mask
            </div>
            <div className="grid grid-cols-3 gap-1">
              {(['u-shape', 'sky-fade', 'none'] as const).map((mask) => (
                <button
                  key={mask}
                  onClick={() => setMaskMode(mask)}
                  className={`py-1 text-center border cursor-pointer ${
                    maskMode === mask
                      ? 'border-[#100F0F] bg-[#100F0F] text-white dark:border-[#CECDC3] dark:bg-[#CECDC3] dark:text-black font-bold'
                      : 'border-[#E6E4D9] dark:border-[#282726]'
                  }`}
                >
                  {mask === 'u-shape' ? 'U-Valley' : mask === 'sky-fade' ? 'Sky Fade' : 'Full Banner'}
                </button>
              ))}
            </div>
          </div>

          {/* Image Adjustments (Sliders) */}
          <div className="p-3 border border-[#E6E4D9] dark:border-[#282726] space-y-2">
            <div className="font-bold text-[#100F0F] dark:text-[#CECDC3]">
              6. Adjustments
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span>Contrast:</span>
                <span>{contrast.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.6"
                max="2.0"
                step="0.05"
                value={contrast}
                onChange={(e) => setContrast(Number(e.target.value))}
                className="w-full cursor-pointer accent-[#100F0F] dark:accent-[#CECDC3]"
              />

              <div className="flex justify-between text-[11px] pt-1">
                <span>Saturation:</span>
                <span>{saturation.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="2.2"
                step="0.1"
                value={saturation}
                onChange={(e) => setSaturation(Number(e.target.value))}
                className="w-full cursor-pointer accent-[#100F0F] dark:accent-[#CECDC3]"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={handleDownload}
              className="w-full py-1.5 bg-transparent border border-[#E6E4D9] dark:border-[#282726] hover:border-[#100F0F] dark:hover:border-[#CECDC3] text-[#100F0F] dark:text-[#CECDC3] cursor-pointer"
            >
              ↓ Download PNG Image
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
