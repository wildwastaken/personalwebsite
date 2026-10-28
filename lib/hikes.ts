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
    name: 'Machu Picchu & Inca Trail',
    location: 'Sacred Valley, Urubamba Province',
    country: 'Peru',
    distance: '42 km (26 mi)',
    elevation: '4,215m peak pass',
    date: 'Dec 2025',
    lat: -13.1631,
    lng: -72.545,
    coverImage: '/images/gallery/peru-machu-picchu-clouds.jpeg',
    photos: [
      {
        src: '/images/gallery/peru-machu-picchu-clouds.jpeg',
        caption: 'Machu Picchu emerging through morning clouds and fog',
      },
      {
        src: '/images/gallery/peru-machu-picchu-citadel.jpeg',
        caption: 'Panoramic view of the ancient citadel and terraced slopes',
      },
      {
        src: '/images/gallery/peru-ollantaytambo-terraces.jpeg',
        caption: 'Inca fortress and stone terraces at Ollantaytambo',
      },
      {
        src: '/images/gallery/peru-cusco-plaza.jpeg',
        caption: 'Plaza de Armas and historic streets in Cusco',
      },
    ],
    description:
      'Stone paths, cloud forests, and terraces along the route to Machu Picchu.',
  },
  {
    num: 'STA-02',
    name: 'Salkantay Alpine Pass Trek',
    location: 'Vilcabamba Mountain Range',
    country: 'Peru',
    distance: '60 km (37 mi)',
    elevation: '4,630m (Pass)',
    date: 'Dec 2025',
    lat: -13.3869,
    lng: -72.5731,
    coverImage: '/images/gallery/peru-salkantay-horse-trek.jpeg',
    photos: [
      {
        src: '/images/gallery/peru-salkantay-horse-trek.jpeg',
        caption: 'Trekking high-altitude rocky pass beneath Mount Salkantay',
      },
      {
        src: '/images/gallery/peru-salkantay-trail-allen.jpeg',
        caption: 'Allen riding horseback through the Andean mountain trail',
      },
      {
        src: '/images/gallery/peru-salkantay-pack-mule.jpeg',
        caption: 'Pack horse on the rugged Salkantay Pass',
      },
      {
        src: '/images/gallery/peru-salkantay-valley-vista.jpeg',
        caption: 'Glacial meltwater and braided streams across the Vilcabamba valley',
      },
      {
        src: '/images/gallery/peru-humantay-trail-horses.jpeg',
        caption: 'Steep switchbacks toward high alpine ridges',
      },
    ],
    description:
      'An alpine trek beneath Salkantay, over a 4,630m pass and down into glacial valleys.',
  },
  {
    num: 'STA-03',
    name: 'Sentinel Pass & Moraine Lake',
    location: 'Moraine Lake, Banff',
    country: 'Canada',
    distance: '11.6 km',
    elevation: '725m gain (2,611m pass)',
    date: 'Summer 2024',
    lat: 51.3297,
    lng: -116.1847,
    coverImage: '/images/gallery/moraine-lake-fav.jpeg',
    photos: [
      {
        src: '/images/gallery/moraine-lake-fav.jpeg',
        caption: 'Allen at Moraine Lake with the vibrant turquoise waters and the Ten Peaks',
      },
      {
        src: '/images/gallery/moraine.jpeg',
        caption: 'Turquoise waters of Moraine Lake and the Valley of the Ten Peaks',
      },
    ],
    description:
      'Up through Larch Valley to Sentinel Pass, with Moraine Lake and the Ten Peaks below.',
  },
  {
    num: 'STA-04',
    name: 'Plain of Six Glaciers',
    location: 'Lake Louise, Banff',
    country: 'Canada',
    distance: '14 km',
    elevation: '587m gain',
    date: 'Summer 2024',
    lat: 51.4254,
    lng: -116.2291,
    coverImage: '/images/gallery/adam-banff.jpeg',
    photos: [
      {
        src: '/images/gallery/adam-banff.jpeg',
        caption: 'Plain of Six Glaciers alpine trail overlooking Lake Louise valley',
      },
      {
        src: '/images/gallery/jasper-rockies-fav.jpeg',
        caption: 'Dockside view of the Canadian Rockies glaciated peaks',
      },
    ],
    description:
      'Following Lake Louise past moraines to the tea house beneath the glaciers.',
  },
  {
    num: 'STA-05',
    name: 'Fimmvörðuháls Pass',
    location: 'Between Eyjafjallajökull and Mýrdalsjökull',
    country: 'Iceland',
    distance: '25 km',
    elevation: '1,000m gain (1,067m pass)',
    date: '2023',
    lat: 63.6156,
    lng: -19.4547,
    coverImage: '/images/gallery/iceland.jpeg',
    photos: [
      {
        src: '/images/gallery/iceland.jpeg',
        caption: 'Dramatic volcanic canyon and glacial melt along Fimmvörðuháls',
      },
      {
        src: '/images/gallery/iceland-skogafoss-fav.jpeg',
        caption: 'Natural stone arch over misty river canyon in the highlands',
      },
    ],
    description:
      'Across volcanic terrain between two ice caps, past lava fields and steaming craters.',
  },
  {
    num: 'STA-06',
    name: 'Skógafoss to Þórsmörk (Waterfall Way)',
    location: 'Southern Iceland',
    country: 'Iceland',
    distance: '22 km',
    elevation: 'Gorge Traverse',
    date: '2023',
    lat: 63.532,
    lng: -19.5111,
    coverImage: '/images/gallery/iceland-skogafoss-fav.jpeg',
    photos: [
      {
        src: '/images/gallery/iceland-skogafoss-fav.jpeg',
        caption: 'Standing on the natural rock bridge overlooking the canyon gorge',
      },
      {
        src: '/images/gallery/iceland-gullfoss-fav.jpeg',
        caption: 'Glacial turquoise river rapids and grazing sheep',
      },
      {
        src: '/images/gallery/iceland1.jpeg',
        caption: 'Cascading waterfalls along the Skógá River gorge',
      },
    ],
    description:
      'Following the Skógá River past waterfalls and basalt gorges toward Þórsmörk.',
  },
  {
    num: 'STA-07',
    name: 'Laugavegur Highland Trail',
    location: 'Landmannalaugar to Þórsmörk',
    country: 'Iceland',
    distance: '55 km',
    elevation: 'Multi-day Highlands',
    date: '2023',
    lat: 63.9753,
    lng: -19.0569,
    description:
      "A multi-day walk through Iceland's highlands, with colorful mountains, hot springs, and glacial rivers.",
  },
  {
    num: 'STA-08',
    name: 'Pemi Loop & Franconia Ridge',
    location: 'White Mountains, NH',
    country: 'USA',
    distance: '31 miles',
    elevation: '9,000+ ft total gain',
    date: 'Summer 2023',
    lat: 44.1689,
    lng: -71.5533,
    coverImage: '/images/gallery/lafayette-ridge-fav.jpeg',
    photos: [
      {
        src: '/images/gallery/lafayette-ridge-fav.jpeg',
        caption: 'Traversing the open granite spine of Mount Lafayette, Franconia Ridge',
      },
      {
        src: '/images/gallery/pemi-loop.jpeg',
        caption: 'Traversing the open alpine ridge on the Franconia Ridge loop',
      },
      {
        src: '/images/gallery/pemi-loop1.jpeg',
        caption: 'Panoramic views across the Pemigewasset Wilderness',
      },
      {
        src: '/images/gallery/pemi-loop-mark.jpeg',
        caption: 'Rocky scramble along the Mount Lafayette ridge',
      },
      {
        src: '/images/gallery/pemi-loop2.jpeg',
        caption: 'Sunset over alpine huts and ridgeline trails',
      },
    ],
    description:
      'A White Mountains loop over Franconia Ridge, with rocky scrambles and open summit views.',
  },
]

