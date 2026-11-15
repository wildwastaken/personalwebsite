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
  { file: 'peru-salkantay-dusk-drone.jpeg', ...PERU, alt: 'Salkantay catching the last light, from the drone', location: 'Soraypampa', date: 'Dec 2025', coordinates: '-13.3817, -72.5641' },
  { file: 'iceland-stykkisholmur-drone.jpeg', ...ICELAND, alt: 'Stykkishólmur and its lighthouse island from the drone', location: 'Stykkishólmur, Iceland', date: 'May 2023' },
  { file: 'peru-humantay-drone.jpeg', ...PERU, alt: 'Humantay Lake from above', location: 'Humantay Lake', date: 'Dec 2025', coordinates: '-13.3778, -72.5861' },
  { file: 'moraine-lake-fav.jpeg', ...ROCKIES, alt: 'Me at Moraine Lake', location: 'Moraine Lake, Banff', date: 'July 2024', coordinates: '51.3276, -116.1800' },
  { file: 'iceland-skogafoss-fav.jpeg', ...ICELAND, alt: 'A rock arch in the fog above the Skógá', location: 'Skógá River, Iceland', date: 'May 2023', coordinates: '63.5417, -19.5001' },
  { file: 'peru-salkantay-horse-trek.jpeg', ...PERU, alt: 'On horseback below Salkantay', location: 'Salkantay trail', date: 'Dec 2025', coordinates: '-13.3571, -72.5602' },
  { file: 'lafayette-ridge-fav.jpeg', ...WHITES, alt: 'Early light on Franconia Ridge', location: 'Mount Lafayette, NH', date: 'Aug 2025', coordinates: '44.1412, -71.6447' },
  { file: 'iceland-river-crossing-drone.jpeg', ...ICELAND, alt: 'Our rental fording a glacial river, from the drone', location: 'South Iceland', date: 'May 2023' },
  { file: 'galehead-sunset.jpeg', ...WHITES, alt: 'Sunset from Galehead Hut', location: 'Galehead Hut, NH', date: 'Aug 2024', coordinates: '44.1889, -71.5686' },
  { file: 'whistler-powder-fav.jpeg', ...WHISTLER, alt: 'Clouds sitting in the valley below Whistler', location: 'Whistler, BC', date: 'Jan 2025', coordinates: '50.0791, -122.9583' },
  { file: 'lake-louise-from-above.jpeg', ...ROCKIES, alt: 'Me above Lake Louise on the way up to Lake Agnes', location: 'Lake Louise, Banff', date: 'July 2024', coordinates: '51.4206, -116.2386' },
  { file: 'cape-breton-coast.jpeg', ...CAPE_BRETON, alt: 'Grassy cliffs at the north tip of Cape Breton', location: 'Cape North, Nova Scotia', date: 'July 2026', coordinates: '47.0212, -60.3885' },
  { file: 'peru-machu-picchu-citadel.jpeg', ...PERU, alt: 'The citadel and terraces at Machu Picchu', location: 'Machu Picchu', date: 'Dec 2025', coordinates: '-13.1653, -72.5447' },
  { file: 'peru-huayna-picchu-edge.jpeg', ...PERU, alt: 'Feet over the edge on top of Huayna Picchu', location: 'Huayna Picchu', date: 'Dec 2025', coordinates: '-13.1567, -72.5461' },
  { file: 'iceland-seljalandsfoss.jpeg', ...ICELAND, alt: 'Behind Seljalandsfoss', location: 'Seljalandsfoss, Iceland', date: 'May 2023' },
  { file: 'jasper-rockies-fav.jpeg', ...ROCKIES, alt: 'Lying on a dock in Jasper', location: 'Jasper, Alberta', date: 'July 2024', coordinates: '52.7263, -117.6429' },
  { file: 'iceland-gullfoss-fav.jpeg', ...ICELAND, alt: 'The Brúará running blue past grazing sheep', location: 'Brúará, Iceland', date: 'May 2023', coordinates: '64.2566, -20.5147' },
  { file: 'iceland-glacier-friends.jpeg', ...ICELAND, alt: 'Friends in front of the glacier near Skaftafell', location: 'Skaftafell, Iceland', date: 'May 2023' },
  { file: 'peru-salkantay-trail-allen.jpeg', ...PERU, alt: 'Riding up the Salkantay trail', location: 'Salkantay trail', date: 'Dec 2025', coordinates: '-13.3591, -72.5596' },
  { file: 'peru-humantay-lake.jpeg', ...PERU, alt: 'Humantay Lake under the glacier', location: 'Humantay Lake', date: 'Dec 2025', coordinates: '-13.3812, -72.5846' },
  { file: 'moraine.jpeg', ...ROCKIES, alt: 'Moraine Lake and the Valley of the Ten Peaks', location: 'Moraine Lake, Banff', date: 'July 2024', coordinates: '51.3275, -116.1814' },
  { file: 'pemi-loop-mark.jpeg', ...WHITES, alt: 'A friend on top of Mount Lafayette', location: 'Mount Lafayette, NH', date: 'Aug 2025', coordinates: '44.1610, -71.6445' },
  { file: 'galehead-hut.jpeg', ...WHITES, alt: 'Three of us outside Galehead Hut', location: 'Galehead Hut, NH', date: 'Aug 2024', coordinates: '44.1879, -71.5688' },
  { file: 'whistler-above-clouds.jpeg', ...WHISTLER, alt: 'Skiing above the clouds at Whistler', location: 'Whistler, BC', date: 'Jan 2025', coordinates: '50.0817, -122.9576' },
  { file: 'adam-banff.jpeg', ...ROCKIES, alt: 'Sitting on the Engine Bridge with the Three Sisters behind', location: 'Canmore, Alberta', date: 'July 2024', coordinates: '51.0915, -115.3698' },
  { file: 'lake-louise-sunrise.jpeg', ...ROCKIES, alt: 'Sunrise on the trail above Lake Louise', location: 'Lake Louise, Banff', date: 'July 2024', coordinates: '51.4211, -116.2375' },
  { file: 'peru-salkantay-valley-vista.jpeg', ...PERU, alt: 'Looking down the valley from the Salkantay trail', location: 'Salkantay trail', date: 'Dec 2025', coordinates: '-13.3767, -72.5642' },
  { file: 'peru-soraypampa-stars.jpeg', ...PERU, alt: 'Stars over camp at Soraypampa', location: 'Soraypampa', date: 'Dec 2025', coordinates: '-13.3883, -72.5738' },
  { file: 'iceland.jpeg', ...ICELAND, alt: 'Fjaðrárgljúfur canyon', location: 'Fjaðrárgljúfur, Iceland', date: 'May 2023', coordinates: '63.7750, -18.1747' },
  { file: 'whistler.jpeg', ...WHISTLER, alt: 'Snow on the trees at Whistler', location: 'Whistler, BC', date: 'Jan 2025', coordinates: '50.0858, -122.8966' },
  { file: 'pemi-loop1.jpeg', ...WHITES, alt: 'Sunrise over the Pemigewasset Wilderness', location: 'White Mountains, NH', date: 'Aug 2025', coordinates: '44.1061, -71.6307' },
  { file: 'twinway-view.jpeg', ...WHITES, alt: 'Looking into the Pemi from the Twinway', location: 'Twinway, NH', date: 'Aug 2024', coordinates: '44.1686, -71.5356' },
  { file: 'peru-humantay-trail-horses.jpeg', ...PERU, alt: 'Our horses at the Salkantay trailhead', location: 'Soraypampa', date: 'Dec 2025', coordinates: '-13.3604, -72.5596' },
  { file: 'peru-high-andes-pass.jpeg', ...PERU, alt: 'Clouds over the Salkantay valley', location: 'Salkantay trail', date: 'Dec 2025', coordinates: '-13.3650, -72.5607' },
  { file: 'peru-salkantay-pack-mule.jpeg', ...PERU, alt: 'A curious horse on the trail', location: 'Salkantay trail', date: 'Dec 2025', coordinates: '-13.3495, -72.5632' },
  { file: 'pemi-loop2.jpeg', ...WHITES, alt: 'The sun coming up through the trees', location: 'White Mountains, NH', date: 'Aug 2025', coordinates: '44.1050, -71.6784' },
  { file: 'iceland1.jpeg', ...ICELAND, alt: 'Vík from the hill above town', location: 'Vík, Iceland', date: 'May 2023' },
  { file: 'cape-breton-bonfire.jpeg', ...CAPE_BRETON, alt: 'A beach fire in Dingwall', location: 'Dingwall, Nova Scotia', date: 'July 2026', coordinates: '46.8976, -60.4487' },
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
