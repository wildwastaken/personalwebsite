import Link from 'next/link'

interface Project {
  title: string
  year: string
  tagline: string
  description: string
  stack: string[]
  github?: string
  live?: string
  award?: string
  status?: string
  /** Has a longer write-up at /projects/[slug]. */
  slug?: string
}

const STANDALONE_APPS = ['/cooksplit', '/calledit', '/wrapped']

const projects: Project[] = [
  {
    title: 'What Survives the Clip?',
    year: '2026',
    status: 'in progress · senior thesis',
    slug: 'thesis',
    tagline: 'What 32M TikToks say about podcasts',
    description:
      'My senior thesis: which moments of long-form podcasts get clipped into TikToks, and which of those clips take off. I’m tracing a research corpus of about 32 million TikToks back to the exact moment they came from in tens of thousands of podcast episodes, then comparing what got clipped with what didn’t. Advised by Manoel Horta Ribeiro.',
    stack: ['Python', 'Whisper', 'LLMs', 'RapidFuzz', 'Slurm'],
  },
  {
    title: 'Called It',
    slug: 'called-it',
    year: '2026',
    tagline: 'Grading 2024 podcast predictions against prediction markets',
    description:
      'Podcasters make a lot of confident calls, so I checked them. It pulls predictions out of thousands of 2024 podcast transcripts with an LLM, matches each one to a settled Polymarket or Kalshi market, and scores every show against what the market thought that day. The shows were right 76% of the time and still did slightly worse than the market.',
    stack: ['Python', 'Claude', 'Polymarket + Kalshi APIs', 'React'],
    github: 'https://github.com/wildwastaken/called-it',
    live: '/calledit',
  },
  {
    title: 'TopoPixel',
    year: '2026',
    tagline: 'Turn photos into pixel art',
    description:
      'Drop in a photo and get a dithered, pixel-art version back. Choose the resolution and palette, then save it as a PNG. It runs entirely in your browser.',
    stack: ['TypeScript', 'Canvas'],
    github: 'https://github.com/wildwastaken/personalwebsite',
    live: '/artgen',
  },
  {
    title: 'Hardcover Wrapped',
    slug: 'hardcover-wrapped',
    year: '2025',
    tagline: 'Spotify Wrapped, but for books',
    description:
      'Paste your Hardcover API key and get a tap-through story of your reading year: books, pages, your busiest month, top authors and genres, favorites, and a summary card you can download and share.',
    stack: ['Next.js', 'TypeScript', 'GraphQL'],
    github: 'https://github.com/wildwastaken/hardcover-wrapped',
    live: '/wrapped',
  },
  {
    title: 'Hut Monitor',
    slug: 'hut-monitor',
    year: '2025',
    tagline: 'Campsite openings, the moment they appear',
    description:
      'Watches Recreation.gov campgrounds for openings on the nights I want and pings Discord or my Mac when one shows up. Basically my old restock bots, pointed at Yosemite instead of hand sanitizer.',
    stack: ['Python', 'httpx', 'Recreation.gov API'],
    github: 'https://github.com/wildwastaken/hut-monitor',
  },
  {
    title: 'Cook Split',
    slug: 'cook-split',
    year: '2025',
    tagline: 'Group dinners without the spreadsheet',
    description:
      'Pick what we’re cooking, set how many people are eating, and it scales the recipes, merges them into one grocery list by store section, and works out who owes whom with Venmo links. Things one person keeps, like a bag of rice, can stay out of the split.',
    stack: ['React', 'TypeScript', 'Vite'],
    github: 'https://github.com/wildwastaken/cook-split',
    live: '/cooksplit',
  },
  {
    title: 'tabs',
    slug: 'tabs',
    year: '2025',
    tagline: 'Guitar tabs you can print',
    description:
      'A friend wanted clean printouts of Ultimate Guitar tabs, so I made this. Paste a link, transpose, adjust the font and spacing, then print or let it autoscroll while you play.',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    github: 'https://github.com/wildwastaken/tabs',
    live: 'https://tabs.allenliu.dev',
  },
  {
    title: 'TigerMail',
    year: '2025',
    tagline: 'Campus emails into calendar events',
    description:
      'Our COS 333 team project. Princeton inboxes are full of event emails; TigerMail pulls out the time and place and puts them on your calendar. Sign in with your Princeton account.',
    stack: ['React', 'Django', 'PostgreSQL'],
    github: 'https://github.com/wildwastaken/TigerMail',
  },
  {
    title: 'gifting',
    year: '2025',
    tagline: 'A visual essay for VIS 208',
    description: 'A small web essay about why we give gifts, made for a Princeton design class.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    github: 'https://github.com/wildwastaken/gifting',
    live: 'https://wildwastaken.github.io/gifting/',
  },
  {
    title: 'Photo Picker',
    slug: 'photo-picker',
    year: '2025',
    tagline: 'The 12 best photos from a 1,300-photo trip',
    description:
      'A command-line tool that scores every photo from a trip, throws out near-duplicates and bursts, and picks a varied set across time and place, with a contact sheet to check its work. It reads straight from the Apple Photos library.',
    stack: ['Python', 'NumPy', 'Pillow', 'SQLite'],
    github: 'https://github.com/wildwastaken/photo-picker',
  },
  {
    title: 'GeomPT',
    slug: 'geompt',
    year: '2024',
    award: '2nd place overall, HackMIT 2024',
    tagline: 'Physical therapy tracking with a webcam',
    description:
      'Built in a weekend at HackMIT. Physical therapists can measure a patient’s range of motion over a webcam and see how it changes between visits.',
    stack: ['OpenCV', 'MediaPipe', 'Flask', 'Next.js'],
    github: 'https://github.com/orgs/GeomPT/repositories',
  },
  {
    title: 'allenliu.dev',
    year: '2023',
    tagline: 'This site',
    description: 'Next.js, a Mapbox globe for the hikes, and a little live widget showing what I’m listening to and reading.',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Mapbox'],
    github: 'https://github.com/wildwastaken/personalwebsite',
    live: 'https://allenliu.dev',
  },
  {
    title: 'Tranquil',
    year: '2021',
    award: '1st place, CT-STEM and CSEF 2021',
    tagline: 'The Whoop before Whoop',
    description:
      'An Apple Watch app I built in high school. It read your heart rate and HRV live, tapped your wrist with each new reading, and kept a week of history on your iPhone.',
    stack: ['Swift', 'watchOS', 'HealthKit', 'Firebase'],
    github: 'https://github.com/wildwastaken/tranquil',
  },
  {
    title: 'bareshelves',
    slug: 'bareshelves',
    year: '2020',
    tagline: 'Restock alerts during the pandemic',
    description:
      'When stores ran out of essentials in 2020, these bots watched Amazon and sent a notification when things came back in stock. It grew out of AmznMonitor, my first real project.',
    stack: ['Python', 'Selenium'],
    github: 'https://github.com/wildwastaken/amznmonitor',
    live: 'https://bareshelves.allenliu.dev',
  },
]

export default function Projects() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-[#E6E4D9] dark:border-[#282726] pb-4 space-y-1">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-[#100F0F] dark:text-[#CECDC3]">
          Projects
        </h1>
        <p className="text-sm text-[#6F6E69] dark:text-[#878580]">
          Things I’ve built for friends, classes, hackathons, and research.
        </p>
      </div>

      {/* Projects List */}
      <div className="divide-y divide-[#E6E4D9] dark:divide-[#282726]">
        {projects.map((p) => (
          <article key={p.title} className="py-6 space-y-2">
            {/* Top row: Title, Year, Award */}
            {/* On phones the tagline drops below the title instead of wrapping beside it. */}
            <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
              <h2 className="font-serif text-xl font-bold text-[#100F0F] dark:text-[#CECDC3]">
                {p.slug ? (
                  <Link href={`/projects/${p.slug}`} className="hover:underline underline-offset-4">
                    {p.title}
                  </Link>
                ) : (
                  p.title
                )}
              </h2>
              <span className="order-3 basis-full sm:order-2 sm:basis-auto font-mono text-xs text-[#6F6E69] dark:text-[#878580]">
                <span className="hidden sm:inline">• </span>{p.tagline}
              </span>
              <span className="order-2 sm:order-3 ml-auto pl-2 font-mono text-xs text-[#6F6E69] dark:text-[#878580] whitespace-nowrap">
                {p.year}
              </span>
            </div>

            {p.status && (
              <div className="font-mono text-xs font-semibold text-amber-700 dark:text-amber-400">
                ◐ {p.status}
              </div>
            )}

            {p.award && (
              <div className="font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                ★ {p.award}
              </div>
            )}

            {/* Description */}
            <p className="text-base text-[#282726] dark:text-[#D4D2C9] leading-relaxed max-w-prose">
              {p.description}
            </p>

            {p.slug && (
              <Link
                href={`/projects/${p.slug}`}
                className="group inline-flex items-center gap-2 rounded-full border border-[#100F0F]/70 dark:border-[#CECDC3]/60 px-3.5 py-1.5 font-mono text-xs font-medium text-[#100F0F] dark:text-[#CECDC3] hover:bg-[#100F0F] hover:text-[#FFFCF0] dark:hover:bg-[#CECDC3] dark:hover:text-[#100F0F] transition-colors"
              >
                <span aria-hidden="true">✎</span>
                Read the write-up
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
              </Link>
            )}

            {/* Tech stack & Links */}
            <div className="pt-1 flex flex-wrap items-baseline justify-between gap-3 font-mono text-xs">
              <div className="text-[#6F6E69] dark:text-[#878580]">
                {p.stack.join(' • ')}
              </div>

              <div className="flex items-center gap-3">
                {p.github && <a
                  href={p.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-[#100F0F] dark:hover:text-[#CECDC3] text-[#100F0F] dark:text-[#CECDC3] font-medium"
                >
                  code ↗
                </a>}
                {/* Apps served from public/ or another deployment need a full page load, not client routing. */}
                {p.live?.startsWith('/') && !STANDALONE_APPS.includes(p.live) ? (
                  <Link
                    href={p.live}
                    className="underline hover:text-[#100F0F] dark:hover:text-[#CECDC3] text-[#100F0F] dark:text-[#CECDC3] font-medium"
                  >
                    try it →
                  </Link>
                ) : p.live && (
                  <a
                    href={p.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-[#100F0F] dark:hover:text-[#CECDC3] text-[#100F0F] dark:text-[#CECDC3] font-medium"
                  >
                    live demo ↗
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
