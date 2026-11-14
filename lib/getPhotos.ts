import { photoAssets, getPhotoSources } from './photoAssets'

export interface Photo {
  id: number
  src: string
  thumbSrc: string
  originalSrc: string
  placeholder: string
  alt: string
  filename: string
  category: string
  categoryLabel: string
  location: string
  date: string
  coordinates?: string
  aspect: 'portrait' | 'landscape' | 'wide'
}

interface PhotoMeta {
  file: string
  alt: string
  category: string
  categoryLabel: string
  location: string
  date: string
  coordinates?: string
}

const PERU = { category: 'peru', categoryLabel: 'Peru' }
const ROCKIES = { category: 'rockies', categoryLabel: 'Canadian Rockies' }
const ICELAND = { category: 'iceland', categoryLabel: 'Iceland' }
const WHITES = { category: 'white-mountains', categoryLabel: 'White Mountains' }
const WHISTLER = { category: 'whistler', categoryLabel: 'Whistler' }
const HOME = { category: 'northeast', categoryLabel: 'Close to home' }

// Display order. Locations and dates come from each photo's EXIF data.
const catalog: PhotoMeta[] = [
  { file: 'peru-machu-picchu-clouds.jpeg', ...PERU, alt: 'Machu Picchu as the morning clouds lift', location: 'Machu Picchu', date: 'Dec 2025', coordinates: '-13.1651, -72.5437' },
  { file: 'moraine-lake-fav.jpeg', ...ROCKIES, alt: 'Me at Moraine Lake', location: 'Moraine Lake, Banff', date: 'July 2024', coordinates: '51.3276, -116.1800' },
  { file: 'iceland-skogafoss-fav.jpeg', ...ICELAND, alt: 'A rock arch in the fog above the Skógá', location: 'Skógá River, Iceland', date: 'May 2023', coordinates: '63.5417, -19.5001' },
  { file: 'peru-salkantay-horse-trek.jpeg', ...PERU, alt: 'On horseback below Salkantay', location: 'Salkantay trail', date: 'Dec 2025', coordinates: '-13.3571, -72.5602' },
  { file: 'lafayette-ridge-fav.jpeg', ...WHITES, alt: 'Early light on Franconia Ridge', location: 'Mount Lafayette, NH', date: 'Aug 2025', coordinates: '44.1412, -71.6447' },
  { file: 'whistler-powder-fav.jpeg', ...WHISTLER, alt: 'Clouds sitting in the valley below Whistler', location: 'Whistler, BC', date: 'Jan 2025', coordinates: '50.0791, -122.9583' },
  { file: 'peru-machu-picchu-citadel.jpeg', ...PERU, alt: 'The citadel and terraces at Machu Picchu', location: 'Machu Picchu', date: 'Dec 2025', coordinates: '-13.1653, -72.5447' },
  { file: 'jasper-rockies-fav.jpeg', ...ROCKIES, alt: 'Lying on a dock in Jasper', location: 'Jasper, Alberta', date: 'July 2024', coordinates: '52.7263, -117.6429' },
  { file: 'iceland-gullfoss-fav.jpeg', ...ICELAND, alt: 'The Brúará running blue past grazing sheep', location: 'Brúará, Iceland', date: 'May 2023', coordinates: '64.2566, -20.5147' },
  { file: 'peru-salkantay-trail-allen.jpeg', ...PERU, alt: 'Riding up the Salkantay trail', location: 'Salkantay trail', date: 'Dec 2025', coordinates: '-13.3591, -72.5596' },
  { file: 'moraine.jpeg', ...ROCKIES, alt: 'Moraine Lake and the Valley of the Ten Peaks', location: 'Moraine Lake, Banff', date: 'July 2024', coordinates: '51.3275, -116.1814' },
  { file: 'pemi-loop-mark.jpeg', ...WHITES, alt: 'A friend on the ridge north of Lafayette', location: 'Franconia Ridge, NH', date: 'Aug 2025', coordinates: '44.1610, -71.6445' },
  { file: 'adam-banff.jpeg', ...ROCKIES, alt: 'Sitting on the Engine Bridge with the Three Sisters behind', location: 'Canmore, Alberta', date: 'July 2024', coordinates: '51.0915, -115.3698' },
  { file: 'lake-louise-sunrise.jpeg', ...ROCKIES, alt: 'Sunrise on the trail above Lake Louise', location: 'Lake Louise, Banff', date: 'July 2024', coordinates: '51.4211, -116.2375' },
  { file: 'peru-salkantay-valley-vista.jpeg', ...PERU, alt: 'Looking down the valley from the Salkantay trail', location: 'Salkantay trail', date: 'Dec 2025', coordinates: '-13.3767, -72.5642' },
  { file: 'iceland.jpeg', ...ICELAND, alt: 'Fjaðrárgljúfur canyon', location: 'Fjaðrárgljúfur, Iceland', date: 'May 2023', coordinates: '63.7750, -18.1747' },
  { file: 'peru-ollantaytambo-terraces.jpeg', ...PERU, alt: 'The Sacred Valley near Ollantaytambo', location: 'Ollantaytambo', date: 'Dec 2025', coordinates: '-13.2636, -72.3103' },
  { file: 'whistler.jpeg', ...WHISTLER, alt: 'Snow on the trees at Whistler', location: 'Whistler, BC', date: 'Jan 2025', coordinates: '50.0858, -122.8966' },
  { file: 'pemi-loop1.jpeg', ...WHITES, alt: 'Sunrise over the Pemigewasset Wilderness', location: 'White Mountains, NH', date: 'Aug 2025', coordinates: '44.1061, -71.6307' },
  { file: 'peru-humantay-trail-horses.jpeg', ...PERU, alt: 'Our horses at the Salkantay trailhead', location: 'Soraypampa', date: 'Dec 2025', coordinates: '-13.3604, -72.5596' },
  { file: 'peru-high-andes-pass.jpeg', ...PERU, alt: 'Clouds over the Salkantay valley', location: 'Salkantay trail', date: 'Dec 2025', coordinates: '-13.3650, -72.5607' },
  { file: 'peru-salkantay-pack-mule.jpeg', ...PERU, alt: 'A curious horse on the trail', location: 'Salkantay trail', date: 'Dec 2025', coordinates: '-13.3495, -72.5632' },
  { file: 'pemi-loop2.jpeg', ...WHITES, alt: 'The sun coming up through the trees', location: 'White Mountains, NH', date: 'Aug 2025', coordinates: '44.1050, -71.6784' },
  { file: 'iceland1.jpeg', ...ICELAND, alt: 'A town on the south coast from the hill above it', location: 'South Iceland', date: 'May 2023' },
  { file: 'orient-point-fav.jpeg', ...HOME, alt: 'Friends on the rocks at sunset', location: 'Orient Point, NY', date: 'May 2025', coordinates: '41.0263, -72.5391' },
  { file: 'beaconfalls.jpeg', ...HOME, alt: 'Dusk over the Naugatuck valley', location: 'Beacon Falls, CT', date: 'Dec 2024', coordinates: '41.4404, -73.0581' },
]

const metadata = new Map(catalog.map(entry => [entry.file, entry]))

export function getPhotos(): Photo[] {
  const order = catalog.map(entry => entry.file)
  const imageFiles = Object.keys(photoAssets).sort((a, b) => {
    const idxA = order.indexOf(a)
    const idxB = order.indexOf(b)
    if (idxA !== -1 && idxB !== -1) return idxA - idxB
    if (idxA !== -1) return -1
    if (idxB !== -1) return 1
    return a.localeCompare(b)
  })

  return imageFiles.map((file, index) => {
    const meta = metadata.get(file) || {
      alt: file.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
      category: 'other',
      categoryLabel: 'Other',
      location: '',
      date: '',
      coordinates: undefined,
    }
    const asset = photoAssets[file]
    const ratio = asset.width / asset.height
    const aspect: Photo['aspect'] = ratio < 1 ? 'portrait' : ratio > 2 ? 'wide' : 'landscape'
    const src = `/images/gallery/${encodeURIComponent(file)}`

    return {
      id: index + 1,
      src,
      thumbSrc: getPhotoSources(src).src,
      originalSrc: asset.originalSrc,
      placeholder: asset.placeholder,
      alt: meta.alt,
      filename: file,
      category: meta.category,
      categoryLabel: meta.categoryLabel,
      location: meta.location,
      date: meta.date,
      coordinates: meta.coordinates,
      aspect,
    }
  })
}
