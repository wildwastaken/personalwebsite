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

// Dates, times, places, and heights come from the GPS data in my photos.
export const hikes: Hike[] = [
  {
    num: 'STA-01',
    name: 'Machu Picchu & Huayna Picchu',
    location: 'Urubamba Province',
    country: 'Peru',
    elevation: '2,690 m summit',
    date: 'Dec 22, 2025',
    lat: -13.1631,
    lng: -72.545,
    coverImage: '/images/gallery/peru-machu-picchu-citadel.jpeg',
    photos: [
      { src: '/images/gallery/peru-machu-picchu-citadel.jpeg', caption: 'The citadel and its terraces' },
      { src: '/images/gallery/peru-huayna-picchu-edge.jpeg', caption: 'On top of Huayna Picchu' },
    ],
    description: 'Through the gates by 6:40, then up the stone stairs of Huayna Picchu, the peak behind the ruins. On top by 9:40.',
  },
  {
    num: 'STA-02',
    name: 'Salkantay Pass',
    location: 'From Soraypampa, Cordillera Vilcabamba',
    country: 'Peru',
    elevation: '4,630 m pass',
    date: 'Dec 25, 2025',
    lat: -13.3494,
    lng: -72.563,
    coverImage: '/images/gallery/peru-salkantay-horse-trek.jpeg',
    photos: [
      { src: '/images/gallery/peru-salkantay-horse-trek.jpeg', caption: 'On horseback below Salkantay' },
      { src: '/images/gallery/peru-salkantay-valley-vista.jpeg', caption: 'Heading back down the valley' },
    ],
    description: 'Christmas morning. Left Soraypampa on horseback at dawn, stood on the pass at 8:30, and was back down by 11.',
  },
  {
    num: 'STA-03',
    name: 'Humantay Lake',
    location: 'Soraypampa, Cordillera Vilcabamba',
    country: 'Peru',
    elevation: '4,200 m lake',
    date: 'Dec 24, 2025',
    lat: -13.3808,
    lng: -72.5863,
    coverImage: '/images/gallery/peru-humantay-lake.jpeg',
    photos: [
      { src: '/images/gallery/peru-humantay-lake.jpeg', caption: 'Humantay Lake under the glacier' },
      { src: '/images/gallery/peru-humantay-drone.jpeg', caption: 'The lake from above' },
      { src: '/images/gallery/peru-salkantay-dusk-drone.jpeg', caption: 'Salkantay at dusk from above camp' },
      { src: '/images/gallery/peru-soraypampa-stars.jpeg', caption: 'Stars over camp that night' },
    ],
    description: 'Up from camp to the glacier lake under Humantay the afternoon before Salkantay. Good for getting used to the altitude.',
  },
  {
    num: 'STA-04',
    name: 'Above Ollantaytambo',
    location: 'Sacred Valley',
    country: 'Peru',
    elevation: '1,000 m gain',
    date: 'Dec 20, 2025',
    lat: -13.2559,
    lng: -72.3142,
    description: 'From town up past the old Inca quarries to about 3,900 m, for the view back across the valley.',
  },
  {
    num: 'STA-05',
    name: 'Lake Agnes & the Beehive',
    location: 'Lake Louise, Banff',
    country: 'Canada',
    elevation: '490 m gain',
    date: 'July 18, 2024',
    lat: 51.4207,
    lng: -116.2386,
    coverImage: '/images/gallery/lake-louise-sunrise.jpeg',
    photos: [
      { src: '/images/gallery/lake-louise-sunrise.jpeg', caption: 'Sunrise above Lake Louise' },
      { src: '/images/gallery/lake-louise-from-above.jpeg', caption: 'Lake Louise from the way down' },
    ],
    description: 'Started at the lake at 5 a.m., up past Mirror Lake and Lake Agnes, sunrise up on the Beehive, and back down by 8:20.',
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
    name: 'Pemi Loop in a day',
    location: 'White Mountains, NH',
    country: 'USA',
    distance: '31 mi',
    elevation: '9,000+ ft gain',
    date: 'Aug 23, 2025',
    lat: 44.1689,
    lng: -71.5533,
    coverImage: '/images/gallery/lafayette-ridge-fav.jpeg',
    photos: [
      { src: '/images/gallery/pemi-loop1.jpeg', caption: 'Sunrise from Mount Flume, 5:58 a.m.' },
      { src: '/images/gallery/lafayette-ridge-fav.jpeg', caption: 'Franconia Ridge in the early light' },
      { src: '/images/gallery/pemi-loop-mark.jpeg', caption: 'On top of Lafayette at 8:30' },
      { src: '/images/gallery/pemi-loop2.jpeg', caption: 'The sun coming up through the trees' },
    ],
    description: 'Left Lincoln Woods at 3:30 a.m., watched the sun come up on Mount Flume, crossed Franconia Ridge to Lafayette by 8:30, and got back to the car at 7:50 p.m.',
  },
  {
    num: 'STA-10',
    name: 'The Bonds & the Twins',
    location: 'Pemigewasset Wilderness, NH',
    country: 'USA',
    date: 'July 31 – Aug 2, 2024',
    lat: 44.1612,
    lng: -71.535,
    coverImage: '/images/gallery/twinway-view.jpeg',
    photos: [
      { src: '/images/gallery/twinway-view.jpeg', caption: 'Looking into the Pemi from the Twinway' },
      { src: '/images/gallery/galehead-hut.jpeg', caption: 'Made it to Galehead Hut' },
      { src: '/images/gallery/galehead-sunset.jpeg', caption: 'Sunset from the hut' },
    ],
    description: 'Three days out of Lincoln Woods: Bondcliff the first evening, a night near Guyot, over South Twin, and a last night at Galehead Hut.',
  },
]
