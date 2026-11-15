export interface HikePhoto {
  src: string
  caption: string
}

export interface Hike {
  num: string
  name: string
  location: string
  country: string
  distance?: string
  elevation?: string
  date: string
  lat: number
  lng: number
  description: string
  coverImage?: string
  photos?: HikePhoto[]
}

// Dates, places, and heights come from the GPS data in the photos.
export const hikes: Hike[] = [
  {
    num: 'STA-01',
    name: 'Machu Picchu',
    location: 'Urubamba Province',
    country: 'Peru',
    elevation: '2,450 m',
    date: 'Dec 22, 2025',
    lat: -13.1631,
    lng: -72.545,
    coverImage: '/images/gallery/peru-machu-picchu-clouds.jpeg',
    photos: [
      { src: '/images/gallery/peru-machu-picchu-clouds.jpeg', caption: 'Machu Picchu as the morning clouds lift' },
      { src: '/images/gallery/peru-machu-picchu-citadel.jpeg', caption: 'The citadel and its terraces' },
    ],
    description: 'Up at the ruins by 6:30 in the morning, while the clouds were still sitting in the valley.',
  },
  {
    num: 'STA-02',
    name: 'Salkantay Pass',
    location: 'Soraypampa, Cordillera Vilcabamba',
    country: 'Peru',
    elevation: '4,577 m',
    date: 'Dec 25, 2025',
    lat: -13.3495,
    lng: -72.5632,
    coverImage: '/images/gallery/peru-salkantay-horse-trek.jpeg',
    photos: [
      { src: '/images/gallery/peru-salkantay-horse-trek.jpeg', caption: 'On horseback below Salkantay, 4,451 m' },
      { src: '/images/gallery/peru-salkantay-trail-allen.jpeg', caption: 'Riding up the trail' },
      { src: '/images/gallery/peru-salkantay-pack-mule.jpeg', caption: 'The highest photo of the day, 4,577 m' },
      { src: '/images/gallery/peru-salkantay-valley-vista.jpeg', caption: 'Heading back down the valley' },
      { src: '/images/gallery/peru-humantay-trail-horses.jpeg', caption: 'Our horses' },
    ],
    description: 'Christmas morning on horseback, climbing toward the 4,630 m pass under Salkantay. We got up near 4,600 m before heading back down.',
  },
  {
    num: 'STA-03',
    name: 'Above Ollantaytambo',
    location: 'Sacred Valley',
    country: 'Peru',
    elevation: '3,710 m',
    date: 'Dec 20, 2025',
    lat: -13.2636,
    lng: -72.3103,
    coverImage: '/images/gallery/peru-ollantaytambo-terraces.jpeg',
    photos: [
      { src: '/images/gallery/peru-ollantaytambo-terraces.jpeg', caption: 'Looking across the Sacred Valley, 3,710 m' },
    ],
    description: 'A climb out of the Sacred Valley, about 900 m above the town, for the view back across the valley.',
  },
  {
    num: 'STA-04',
    name: 'Sentinel Pass',
    location: 'Moraine Lake, Banff',
    country: 'Canada',
    distance: '11.6 km',
    elevation: '725 m gain',
    date: 'July 18, 2024',
    lat: 51.3297,
    lng: -116.1847,
    coverImage: '/images/gallery/moraine-lake-fav.jpeg',
    photos: [
      { src: '/images/gallery/moraine-lake-fav.jpeg', caption: 'Me at Moraine Lake' },
      { src: '/images/gallery/moraine.jpeg', caption: 'Moraine Lake and the Ten Peaks' },
    ],
    description: 'From Moraine Lake up through Larch Valley to the pass. It’s steep at the end, and the lake is unreal from above.',
  },
  {
    num: 'STA-05',
    name: 'Plain of Six Glaciers',
    location: 'Lake Louise, Banff',
    country: 'Canada',
    distance: '14 km',
    elevation: '587 m gain',
    date: 'July 18, 2024',
    lat: 51.4254,
    lng: -116.2291,
    coverImage: '/images/gallery/lake-louise-sunrise.jpeg',
    photos: [
      { src: '/images/gallery/lake-louise-sunrise.jpeg', caption: 'Sunrise at 2,227 m above Lake Louise' },
    ],
    description: 'A sunrise start above Lake Louise, then up the valley to the old tea house under the glaciers.',
  },
  {
    num: 'STA-06',
    name: 'Skógá River',
    location: 'Skógafoss',
    country: 'Iceland',
    date: 'May 12, 2023',
    lat: 63.5417,
    lng: -19.5001,
    coverImage: '/images/gallery/iceland-skogafoss-fav.jpeg',
    photos: [
      { src: '/images/gallery/iceland-skogafoss-fav.jpeg', caption: 'A rock arch in the fog above the Skógá' },
    ],
    description: 'Up the stairs beside Skógafoss and along the river, where there’s a new waterfall every few minutes.',
  },
  {
    num: 'STA-07',
    name: 'Fjaðrárgljúfur',
    location: 'Near Kirkjubæjarklaustur',
    country: 'Iceland',
    date: 'May 13, 2023',
    lat: 63.775,
    lng: -18.1747,
    coverImage: '/images/gallery/iceland.jpeg',
    photos: [
      { src: '/images/gallery/iceland.jpeg', caption: 'Looking down into the canyon' },
    ],
    description: 'Along the rim of a mossy canyon that the river has cut about 100 m deep.',
  },
  {
    num: 'STA-08',
    name: 'Brúarfoss',
    location: 'Brúará river, Golden Circle',
    country: 'Iceland',
    date: 'May 17, 2023',
    lat: 64.2566,
    lng: -20.5147,
    coverImage: '/images/gallery/iceland-gullfoss-fav.jpeg',
    photos: [
      { src: '/images/gallery/iceland-gullfoss-fav.jpeg', caption: 'The Brúará, bright blue the whole way' },
    ],
    description: 'Along the Brúará to Brúarfoss. The water is a blue that doesn’t look real.',
  },
  {
    num: 'STA-09',
    name: 'Pemi Loop',
    location: 'White Mountains, NH',
    country: 'USA',
    distance: '31 mi',
    elevation: '9,000+ ft gain',
    date: 'Aug 23, 2025',
    lat: 44.1689,
    lng: -71.5533,
    coverImage: '/images/gallery/lafayette-ridge-fav.jpeg',
    photos: [
      { src: '/images/gallery/pemi-loop1.jpeg', caption: 'Sunrise near Mount Flume, 5:58 a.m.' },
      { src: '/images/gallery/lafayette-ridge-fav.jpeg', caption: 'Franconia Ridge in the early light' },
      { src: '/images/gallery/pemi-loop-mark.jpeg', caption: 'On top of Lafayette by 8:30' },
      { src: '/images/gallery/pemi-loop2.jpeg', caption: 'The sun coming up through the trees' },
    ],
    description: 'Started in the dark, watched the sun come up near Mount Flume, and was on top of Lafayette by 8:30. Franconia Ridge is the best part.',
  },
]
