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

const photoMetadataMap: Record<string, {
  alt: string
  category: string
  categoryLabel: string
  location: string
  date: string
  coordinates?: string
}> = {
  // Favorites from Apple Photos Library
  'moraine-lake-fav.jpeg': {
    alt: 'Allen at Moraine Lake with the turquoise waters and Valley of the Ten Peaks',
    category: 'rockies',
    categoryLabel: 'Canadian Rockies',
    location: 'Moraine Lake, Banff',
    date: 'July 2024',
    coordinates: '51.3276, -116.1800'
  },
  'jasper-rockies-fav.jpeg': {
    alt: 'Resting on the wooden pier facing the glaciated peaks of the Canadian Rockies',
    category: 'rockies',
    categoryLabel: 'Canadian Rockies',
    location: 'Jasper National Park, Alberta',
    date: 'July 2024',
    coordinates: '52.7263, -117.6429'
  },
  'lafayette-ridge-fav.jpeg': {
    alt: 'Traversing the open granite spine of Mount Lafayette, Franconia Ridge',
    category: 'white-mountains',
    categoryLabel: 'White Mountains',
    location: 'Mount Lafayette, NH',
    date: 'Aug 2025',
    coordinates: '44.1412, -71.6447'
  },
  'iceland-skogafoss-fav.jpeg': {
    alt: 'Standing atop a natural stone arch overlooking a misty river gorge in Iceland',
    category: 'iceland',
    categoryLabel: 'Iceland',
    location: 'Skógá River Gorge, Iceland',
    date: 'May 2023',
    coordinates: '63.5417, -19.5001'
  },
  'iceland-gullfoss-fav.jpeg': {
    alt: 'Glacial turquoise river rushing past grazing sheep on the canyon banks',
    category: 'iceland',
    categoryLabel: 'Iceland',
    location: 'Hvítá River Basin, Iceland',
    date: 'May 2023',
    coordinates: '64.2566, -20.5147'
  },
  'whistler-powder-fav.jpeg': {
    alt: 'Dramatic cloud inversion rolling across snow-laden firs in Whistler',
    category: 'pnw',
    categoryLabel: 'Pacific Northwest',
    location: 'Whistler Mountain, BC',
    date: 'Jan 2025',
    coordinates: '50.0791, -122.9583'
  },
  'orient-point-fav.jpeg': {
    alt: 'Golden hour sunset with close friends on the rocky shoreline',
    category: 'northeast',
    categoryLabel: 'Northeast',
    location: 'Long Island Sound Coast',
    date: 'May 2025',
    coordinates: '41.0263, -72.5391'
  },

  // Curated Peru Highlights
  'peru-machu-picchu-clouds.jpeg': {
    alt: 'Machu Picchu emerging through morning clouds and peaks',
    category: 'peru',
    categoryLabel: 'Peru',
    location: 'Machu Picchu, Urubamba Province',
    date: 'Dec 2025',
    coordinates: '-13.1651, -72.5437'
  },
  'peru-machu-picchu-citadel.jpeg': {
    alt: 'Ancient citadel and agricultural terraces of Machu Picchu',
    category: 'peru',
    categoryLabel: 'Peru',
    location: 'Machu Picchu, Urubamba Province',
    date: 'Dec 2025',
    coordinates: '-13.1653, -72.5447'
  },
  'peru-salkantay-trail-allen.jpeg': {
    alt: 'Trekking by horseback along the alpine Salkantay trail',
    category: 'peru',
    categoryLabel: 'Peru',
    location: 'Vilcabamba Mountain Range',
    date: 'Dec 2025',
    coordinates: '-13.3591, -72.5596'
  },
  'peru-salkantay-horse-trek.jpeg': {
    alt: 'Navigating high-altitude rocky pass beneath Mount Salkantay',
    category: 'peru',
    categoryLabel: 'Peru',
    location: 'Salkantay Pass Trail',
    date: 'Dec 2025',
    coordinates: '-13.3571, -72.5602'
  },
  'peru-salkantay-pack-mule.jpeg': {
    alt: 'Pack horse pausing on the high Andean pass trail',
    category: 'peru',
    categoryLabel: 'Peru',
    location: 'Salkantay Pass (4,630m)',
    date: 'Dec 2025',
    coordinates: '-13.3537, -72.5606'
  },
  'peru-salkantay-valley-vista.jpeg': {
    alt: 'Braided glacial streams carving through Vilcabamba Valley',
    category: 'peru',
    categoryLabel: 'Peru',
    location: 'Mollepata Valley',
    date: 'Dec 2025',
    coordinates: '-13.3508, -72.5603'
  },
  'peru-ollantaytambo-terraces.jpeg': {
    alt: 'Stone terraces and fortress slopes at Ollantaytambo',
    category: 'peru',
    categoryLabel: 'Peru',
    location: 'Ollantaytambo, Sacred Valley',
    date: 'Dec 2025',
    coordinates: '-13.2636, -72.3103'
  },
  'peru-cusco-plaza.jpeg': {
    alt: 'Historic Andean architecture around Cusco city',
    category: 'peru',
    categoryLabel: 'Peru',
    location: 'Cusco Historic Quarter',
    date: 'Dec 2025',
    coordinates: '-13.5242, -71.9801'
  },
  'peru-humantay-trail-horses.jpeg': {
    alt: 'Mules resting on the switchbacks toward Humantay',
    category: 'peru',
    categoryLabel: 'Peru',
    location: 'Soraypampa to Humantay',
    date: 'Dec 2025',
    coordinates: '-13.3604, -72.5596'
  },
  'peru-high-andes-pass.jpeg': {
    alt: 'Vast grassy Andean foothills leading toward the mountain wall',
    category: 'peru',
    categoryLabel: 'Peru',
    location: 'High Andean Plateau',
    date: 'Dec 2025',
    coordinates: '-13.3650, -72.5607'
  },

  // Existing Gallery Archives
  'adam-banff.jpeg': {
    alt: 'Plain of Six Glaciers alpine trail and tea house overlook',
    category: 'rockies',
    categoryLabel: 'Canadian Rockies',
    location: 'Lake Louise, Banff',
    date: 'Summer 2024',
    coordinates: '51.4254, -116.2291'
  },
  'moraine.jpeg': {
    alt: 'Vibrant turquoise waters of Moraine Lake and the Valley of the Ten Peaks',
    category: 'rockies',
    categoryLabel: 'Canadian Rockies',
    location: 'Moraine Lake, Banff',
    date: 'Summer 2024',
    coordinates: '51.3297, -116.1847'
  },
  'iceland.jpeg': {
    alt: 'Glacial valley and volcanic canyons on Fimmvörðuháls',
    category: 'iceland',
    categoryLabel: 'Iceland',
    location: 'Southern Highlands',
    date: '2023',
    coordinates: '63.6156, -19.4547'
  },
  'iceland1.jpeg': {
    alt: 'Dramatic waterfall and basalt columns along the southern coast',
    category: 'iceland',
    categoryLabel: 'Iceland',
    location: 'Skógafoss Trail',
    date: '2023',
    coordinates: '63.5320, -19.5111'
  },
  'pemi-loop.jpeg': {
    alt: 'Traversing the open alpine ridge on the Franconia Ridge loop',
    category: 'white-mountains',
    categoryLabel: 'White Mountains',
    location: 'Franconia Notch, NH',
    date: 'Summer 2023',
    coordinates: '44.1689, -71.5533'
  },
  'pemi-loop1.jpeg': {
    alt: 'Panoramic summit views across the Pemigewasset Wilderness',
    category: 'white-mountains',
    categoryLabel: 'White Mountains',
    location: 'Mount Garfield Trail, NH',
    date: 'Summer 2023',
    coordinates: '44.1867, -71.6111'
  },
  'pemi-loop2.jpeg': {
    alt: 'Sunset over alpine huts and ridgeline trails',
    category: 'white-mountains',
    categoryLabel: 'White Mountains',
    location: 'White Mountains, NH',
    date: 'Summer 2023',
    coordinates: '44.1500, -71.5600'
  },
  'pemi-loop-mark.jpeg': {
    alt: 'High elevation rocky scramble along the Pemi Loop trail',
    category: 'white-mountains',
    categoryLabel: 'White Mountains',
    location: 'Mount Lafayette, NH',
    date: 'Summer 2023',
    coordinates: '44.1607, -71.6444'
  },
  'whistler.jpeg': {
    alt: 'Coast Mountain alpine ridges and summer wildflower slopes',
    category: 'pnw',
    categoryLabel: 'Pacific Northwest',
    location: 'Whistler, BC, Canada',
    date: '2024',
    coordinates: '50.1163, -122.9574'
  },
  'whistler1.jpeg': {
    alt: 'Glacial valley vista from the high alpine trail at Whistler',
    category: 'pnw',
    categoryLabel: 'Pacific Northwest',
    location: 'Whistler Mountain, BC',
    date: '2024',
    coordinates: '50.0600, -122.9500'
  },
  'beaconfalls.jpeg': {
    alt: 'Beacon Falls forest and river walking trail',
    category: 'northeast',
    categoryLabel: 'Northeast',
    location: 'Beacon Falls, CT',
    date: '2023',
    coordinates: '41.4432, -73.0601'
  }
}

export function getPhotos(): Photo[] {
  const imageFiles = Object.keys(photoAssets)

  // Curated editorial ordering highlighting the finest captures
  const priorityOrder = [
    'peru-machu-picchu-clouds.jpeg',
    'moraine-lake-fav.jpeg',
    'iceland-skogafoss-fav.jpeg',
    'peru-salkantay-horse-trek.jpeg',
    'jasper-rockies-fav.jpeg',
    'lafayette-ridge-fav.jpeg',
    'whistler-powder-fav.jpeg',
    'peru-machu-picchu-citadel.jpeg',
    'iceland-gullfoss-fav.jpeg',
    'peru-salkantay-trail-allen.jpeg',
    'moraine.jpeg',
    'orient-point-fav.jpeg',
    'adam-banff.jpeg',
    'pemi-loop.jpeg',
    'peru-salkantay-pack-mule.jpeg',
    'peru-salkantay-valley-vista.jpeg',
    'iceland.jpeg',
    'iceland1.jpeg',
    'peru-ollantaytambo-terraces.jpeg',
    'whistler.jpeg',
    'pemi-loop1.jpeg',
    'peru-humantay-trail-horses.jpeg',
    'peru-high-andes-pass.jpeg',
    'peru-cusco-plaza.jpeg',
    'pemi-loop2.jpeg',
    'whistler1.jpeg',
    'pemi-loop-mark.jpeg',
    'beaconfalls.jpeg'
  ]

  imageFiles.sort((a, b) => {
    const idxA = priorityOrder.indexOf(a)
    const idxB = priorityOrder.indexOf(b)
    if (idxA !== -1 && idxB !== -1) return idxA - idxB
    if (idxA !== -1) return -1
    if (idxB !== -1) return 1
    return a.localeCompare(b)
  })

  const portraitFiles = new Set([
    'connecticut-coast-fav.jpeg',
    'jasper-rockies-fav.jpeg',
    'lafayette-ridge-fav.jpeg',
    'orient-point-fav.jpeg',
    'pemi-loop.jpeg',
    'pemi-loop2.jpeg',
    'peru-high-andes-pass.jpeg',
    'peru-salkantay-horse-trek.jpeg',
    'peru-salkantay-pack-mule.jpeg',
    'peru-salkantay-trail-allen.jpeg',
    'peru-salkantay-valley-vista.jpeg',
    'princeton-campus-fav.jpeg',
  ])

  const wideFiles = new Set([
    'iceland.jpeg',
  ])

  const photos: Photo[] = imageFiles.map((file, index) => {
    const meta = photoMetadataMap[file] || {
      alt: file.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
      category: 'other',
      categoryLabel: 'Other',
      location: 'Various',
      date: '2023-2025'
    }

    const aspect: 'portrait' | 'landscape' | 'wide' = portraitFiles.has(file)
      ? 'portrait'
      : wideFiles.has(file)
      ? 'wide'
      : 'landscape'

    const src = `/images/gallery/${encodeURIComponent(file)}`

    return {
      id: index + 1,
      src,
      thumbSrc: getPhotoSources(src).src,
      originalSrc: photoAssets[file].originalSrc,
      placeholder: photoAssets[file].placeholder,
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

  return photos
}
