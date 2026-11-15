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
const CAPE_BRETON = { category: 'cape-breton', categoryLabel: 'Cape Breton' }
const HOME = { category: 'northeast', categoryLabel: 'Close to home' }

// Display order. Locations and dates come from each photo's EXIF data.
const catalog: PhotoMeta[] = [
  { file: 'peru-salkantay-dusk-drone.jpeg', ...PERU, alt: 'Salkantay at dusk', location: 'Soraypampa', date: 'Dec 2025', coordinates: '-13.3817, -72.5641' },
  { file: 'iceland-arnarstapi-arch.jpeg', ...ICELAND, alt: 'Arnarstapi', location: 'Arnarstapi, Iceland', date: 'May 2023' },
  { file: 'peru-soraypampa-stars.jpeg', ...PERU, alt: 'Stars over camp', location: 'Soraypampa', date: 'Dec 2025', coordinates: '-13.3883, -72.5738' },
  { file: 'lafayette-ridge-fav.jpeg', ...WHITES, alt: 'Franconia Ridge', location: 'Mount Lafayette, NH', date: 'Aug 2025', coordinates: '44.1412, -71.6447' },
  { file: 'iceland-stykkisholmur-drone.jpeg', ...ICELAND, alt: 'Pano of Stykkishólmur', location: 'Stykkishólmur, Iceland', date: 'May 2023' },
  { file: 'peru-humantay-drone.jpeg', ...PERU, alt: 'Humantay from above', location: 'Humantay Lake', date: 'Dec 2025', coordinates: '-13.3778, -72.5861' },
  { file: 'peru-huayna-picchu-edge.jpeg', ...PERU, alt: 'Huayna Picchu', location: 'Huayna Picchu', date: 'Dec 2025', coordinates: '-13.1567, -72.5461' },
  { file: 'iceland-seljalandsfoss.jpeg', ...ICELAND, alt: 'Behind Seljalandsfoss', location: 'Seljalandsfoss, Iceland', date: 'May 2023' },
  { file: 'iceland-kerid.jpeg', ...ICELAND, alt: 'Kerið', location: 'Kerið, Iceland', date: 'May 2023', coordinates: '64.0398, -20.8854' },
  { file: 'moraine.jpeg', ...ROCKIES, alt: 'Moraine Lake', location: 'Moraine Lake, Banff', date: 'July 2024', coordinates: '51.3275, -116.1814' },
  { file: 'iceland.jpeg', ...ICELAND, alt: 'Fjaðrárgljúfur', location: 'Fjaðrárgljúfur, Iceland', date: 'May 2023', coordinates: '63.7750, -18.1747' },
  { file: 'whistler-above-clouds.jpeg', ...WHISTLER, alt: 'Above the clouds', location: 'Whistler, BC', date: 'Jan 2025', coordinates: '50.0817, -122.9576' },
  { file: 'iceland-river-crossing-drone.jpeg', ...ICELAND, alt: 'Fording a river', location: 'South Iceland', date: 'May 2023' },
  { file: 'lake-louise-sunrise.jpeg', ...ROCKIES, alt: 'Sunrise, Lake Louise', location: 'Lake Louise, Banff', date: 'July 2024', coordinates: '51.4211, -116.2375' },
  { file: 'iceland-skogafoss-fav.jpeg', ...ICELAND, alt: 'Arch in the fog', location: 'Skógá River, Iceland', date: 'May 2023', coordinates: '63.5417, -19.5001' },
  { file: 'iceland-vestrahorn.jpeg', ...ICELAND, alt: 'Vestrahorn', location: 'Stokksnes, Iceland', date: 'May 2023', coordinates: '64.2423, -14.9671' },
  { file: 'pemi-loop1.jpeg', ...WHITES, alt: 'Sunrise on Flume', location: 'White Mountains, NH', date: 'Aug 2025', coordinates: '44.1061, -71.6307' },
  { file: 'emerald-lake.jpeg', ...ROCKIES, alt: 'Emerald Lake', location: 'Emerald Lake, Yoho', date: 'July 2024', coordinates: '51.4397, -116.5409' },
  { file: 'peru-humantay-lake.jpeg', ...PERU, alt: 'Humantay Lake', location: 'Humantay Lake', date: 'Dec 2025', coordinates: '-13.3812, -72.5846' },
  { file: 'peru-machu-picchu-citadel.jpeg', ...PERU, alt: 'Machu Picchu', location: 'Machu Picchu', date: 'Dec 2025', coordinates: '-13.1653, -72.5447' },
  { file: 'cape-breton-coast.jpeg', ...CAPE_BRETON, alt: 'Cape North', location: 'Cape North, Nova Scotia', date: 'July 2026', coordinates: '47.0212, -60.3885' },
  { file: 'iceland-glacier-friends.jpeg', ...ICELAND, alt: 'Glacier crew', location: 'Skaftafell, Iceland', date: 'May 2023' },
  { file: 'jasper-rockies-fav.jpeg', ...ROCKIES, alt: 'Chillin on the dock', location: 'Jasper, Alberta', date: 'July 2024', coordinates: '52.7263, -117.6429' },
  { file: 'cape-breton-bonfire-crew.jpeg', ...CAPE_BRETON, alt: 'Beach fire', location: 'Dingwall, Nova Scotia', date: 'July 2026', coordinates: '46.8976, -60.4486' },
  { file: 'moraine-lake-fav.jpeg', ...ROCKIES, alt: 'Me at Moraine', location: 'Moraine Lake, Banff', date: 'July 2024', coordinates: '51.3276, -116.1800' },
  { file: 'peru-salkantay-horse-trek.jpeg', ...PERU, alt: 'Riding up', location: 'Salkantay trail', date: 'Dec 2025', coordinates: '-13.3571, -72.5602' },
  { file: 'twinway-view.jpeg', ...WHITES, alt: 'Into the Pemi', location: 'Twinway, NH', date: 'Aug 2024', coordinates: '44.1686, -71.5356' },
  { file: 'galehead-hut.jpeg', ...WHITES, alt: 'Made it to Galehead', location: 'Galehead Hut, NH', date: 'Aug 2024', coordinates: '44.1879, -71.5688' },
  { file: 'whistler-powder-fav.jpeg', ...WHISTLER, alt: 'Clouds below', location: 'Whistler, BC', date: 'Jan 2025', coordinates: '50.0791, -122.9583' },
  { file: 'iceland-gullfoss-fav.jpeg', ...ICELAND, alt: 'Brúará', location: 'Brúará, Iceland', date: 'May 2023', coordinates: '64.2566, -20.5147' },
  { file: 'orient-point-fav.jpeg', ...HOME, alt: 'Orient Point', location: 'Orient Point, NY', date: 'May 2025', coordinates: '41.0263, -72.5391' },
  { file: 'peru-salkantay-valley-vista.jpeg', ...PERU, alt: 'Down the valley', location: 'Salkantay trail', date: 'Dec 2025', coordinates: '-13.3767, -72.5642' },
  { file: 'peru-ollantaytambo-edge.jpeg', ...PERU, alt: 'Long way down', location: 'Above Ollantaytambo', date: 'Dec 2025', coordinates: '-13.2636, -72.3103' },
  { file: 'peru-high-andes-pass.jpeg', ...PERU, alt: 'Clouds rolling in', location: 'Salkantay trail', date: 'Dec 2025', coordinates: '-13.3650, -72.5607' },
  { file: 'pemi-loop-mark.jpeg', ...WHITES, alt: 'Top of Lafayette', location: 'Mount Lafayette, NH', date: 'Aug 2025', coordinates: '44.1610, -71.6445' },
  { file: 'pemi-loop2.jpeg', ...WHITES, alt: 'Sunrise through the trees', location: 'White Mountains, NH', date: 'Aug 2025', coordinates: '44.1050, -71.6784' },
  { file: 'adam-banff.jpeg', ...ROCKIES, alt: 'Engine Bridge', location: 'Canmore, Alberta', date: 'July 2024', coordinates: '51.0915, -115.3698' },
  { file: 'iceland1.jpeg', ...ICELAND, alt: 'Vík', location: 'Vík, Iceland', date: 'May 2023' },
  { file: 'whistler.jpeg', ...WHISTLER, alt: 'Snowy trees', location: 'Whistler, BC', date: 'Jan 2025', coordinates: '50.0858, -122.8966' },
  { file: 'beaconfalls.jpeg', ...HOME, alt: 'Beacon Falls at dusk', location: 'Beacon Falls, CT', date: 'Dec 2024', coordinates: '41.4404, -73.0581' },
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
