export interface HikePhoto {
  src: string
  caption: string
}

export interface Hike {
  num: string
  name: string
  location: string
  country: string
  distance: string
  elevation?: string
  date: string
  lat: number
  lng: number
  description: string
  coverImage?: string
  photos?: HikePhoto[]
}

export const hikes: Hike[] = [
  {
    num: 'STA-01',
    name: 'Machu Picchu',
    location: 'Sacred Valley',
    country: 'Peru',
    distance: '42 km (26 mi)',
    elevation: '4,215 m high point',
    date: 'Dec 2025',
    lat: -13.1631,
    lng: -72.545,
    coverImage: '/images/gallery/peru-machu-picchu-clouds.jpeg',
    photos: [
      { src: '/images/gallery/peru-machu-picchu-clouds.jpeg', caption: 'Machu Picchu as the morning clouds lift' },
      { src: '/images/gallery/peru-machu-picchu-citadel.jpeg', caption: 'The citadel and its terraces' },
      { src: '/images/gallery/peru-ollantaytambo-terraces.jpeg', caption: 'The Sacred Valley near Ollantaytambo' },
    ],
    description: 'Old Inca stone paths through the Sacred Valley, ending at Machu Picchu early in the morning, before the clouds burned off.',
  },
  {
    num: 'STA-02',
    name: 'Salkantay',
    location: 'Cordillera Vilcabamba',
    country: 'Peru',
    distance: '60 km (37 mi)',
    elevation: '4,630 m pass',
    date: 'Dec 2025',
    lat: -13.3869,
    lng: -72.5731,
    coverImage: '/images/gallery/peru-salkantay-horse-trek.jpeg',
    photos: [
      { src: '/images/gallery/peru-salkantay-horse-trek.jpeg', caption: 'On horseback below Salkantay' },
      { src: '/images/gallery/peru-salkantay-trail-allen.jpeg', caption: 'Riding up the trail' },
      { src: '/images/gallery/peru-salkantay-valley-vista.jpeg', caption: 'Looking back down the valley' },
      { src: '/images/gallery/peru-high-andes-pass.jpeg', caption: 'Clouds coming over the ridge' },
      { src: '/images/gallery/peru-humantay-trail-horses.jpeg', caption: 'Our horses at the trailhead' },
    ],
    description: 'Up toward the Salkantay pass on horseback, with the peak hidden in cloud most of the way.',
  },
  {
    num: 'STA-03',
    name: 'Sentinel Pass',
    location: 'Moraine Lake, Banff',
    country: 'Canada',
    distance: '11.6 km',
    elevation: '725 m gain',
    date: 'July 2024',
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
    num: 'STA-04',
    name: 'Plain of Six Glaciers',
    location: 'Lake Louise, Banff',
    country: 'Canada',
    distance: '14 km',
    elevation: '587 m gain',
    date: 'July 2024',
    lat: 51.4254,
    lng: -116.2291,
    coverImage: '/images/gallery/lake-louise-sunrise.jpeg',
    photos: [
      { src: '/images/gallery/lake-louise-sunrise.jpeg', caption: 'Sunrise above Lake Louise' },
    ],
    description: 'Along Lake Louise and up the valley to the old tea house, with the glaciers right in front of you.',
  },
  {
    num: 'STA-05',
    name: 'Fimmvörðuháls',
    location: 'Between Eyjafjallajökull and Mýrdalsjökull',
    country: 'Iceland',
    distance: '25 km',
    elevation: '1,000 m gain',
    date: 'May 2023',
    lat: 63.6156,
    lng: -19.4547,
    description: 'Over the pass between two glaciers, past the craters left by the 2010 eruption.',
  },
  {
    num: 'STA-06',
    name: 'Skógafoss to Þórsmörk',
    location: 'South Iceland',
    country: 'Iceland',
    distance: '22 km',
    date: 'May 2023',
    lat: 63.532,
    lng: -19.5111,
    coverImage: '/images/gallery/iceland-skogafoss-fav.jpeg',
    photos: [
      { src: '/images/gallery/iceland-skogafoss-fav.jpeg', caption: 'A rock arch in the fog above the Skógá' },
    ],
    description: 'Up the stairs at Skógafoss and along the river, one waterfall after another.',
  },
  {
    num: 'STA-07',
    name: 'Laugavegur',
    location: 'Landmannalaugar to Þórsmörk',
    country: 'Iceland',
    distance: '55 km',
    date: '2023',
    lat: 63.9753,
    lng: -19.0569,
    description: 'Several days through Iceland’s highlands: colorful rhyolite hills, hot springs, and a lot of river crossings.',
  },
  {
    num: 'STA-08',
    name: 'Pemi Loop',
    location: 'White Mountains, NH',
    country: 'USA',
    distance: '31 mi',
    elevation: '9,000+ ft gain',
    date: 'Aug 2025',
    lat: 44.1689,
    lng: -71.5533,
    coverImage: '/images/gallery/lafayette-ridge-fav.jpeg',
    photos: [
      { src: '/images/gallery/lafayette-ridge-fav.jpeg', caption: 'Early light on Franconia Ridge' },
      { src: '/images/gallery/pemi-loop1.jpeg', caption: 'Sunrise over the Pemigewasset Wilderness' },
      { src: '/images/gallery/pemi-loop-mark.jpeg', caption: 'On the ridge north of Lafayette' },
      { src: '/images/gallery/pemi-loop2.jpeg', caption: 'The sun coming up through the trees' },
    ],
    description: 'A long loop over a string of 4,000-footers, starting before sunrise. Franconia Ridge is the best part.',
  },
]
