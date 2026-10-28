import Link from 'next/link'

interface Project {
  title: string
  year: string
  tagline: string
  description: string
  stack: string[]
  github: string
  live?: string
  award?: string
}

const projects: Project[] = [
  {
    title: 'tabs',
    year: '2025',
    tagline: 'Clean sheet music & tablature engine',
    description:
      'Built for a musician friend to turn Ultimate Guitar tabs into clean, printable PDFs — with controls for key transposition, font size, spacing, and autoscroll.',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    github: 'https://github.com/wildwastaken/tabs',
    live: 'https://allenstabs.netlify.app',
  },
  {
    title: 'GeomPT',
    year: '2024',
    award: 'HackMIT 2024 — 2nd Place Overall (200+ teams)',
    tagline: 'Computer vision range-of-motion telemetry',
    description:
      'A web platform for physical therapists to track and analyze patient joint mobility over time via consumer webcams, leveraging OpenCV and MediaPipe landmark detection streamed over WebSockets.',
    stack: ['OpenCV', 'MediaPipe', 'Flask', 'WebSockets', 'Next.js'],
    github: 'https://github.com/orgs/GeomPT/repositories',
  },
  {
    title: 'bareshelves & AmznMonitor',
    year: '2019 – 2020',
    tagline: 'Pandemic supply shock notification bot',
    description:
      'Inventory monitoring bots and automated notification relays built to help neighbors in Connecticut find essential items when grocery shelves were stripped bare during the early pandemic.',
    stack: ['Python', 'Selenium', 'Automation'],
    github: 'https://github.com/wildwastaken/bareshelves-website',
    live: 'https://bareshelves.allenliu.dev',
  },
  {
    title: 'gifting',
    year: '2025',
    tagline: 'Minimalist visual essay & data visualization',
    description:
      'Course project for Princeton VIS208 exploring human gift-giving rituals, data visualization, and typography without external heavyweight dependencies.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    github: 'https://github.com/wildwastaken/gifting',
    live: 'https://wildwastaken.github.io/gifting/',
  },
  {
    title: 'TopoPixel',
    year: '2026',
    tagline: 'In-browser pixel art & photo dithering',
    description:
      'Transform photos into pixel art with adjustable resolution, color palettes, Bayer ordered dithering, and Floyd-Steinberg error diffusion. Preview the result live or export your artwork as a PNG.',
    stack: ['TypeScript', 'Canvas API', 'Image Processing', 'Algorithms'],
    github: 'https://github.com/wildwastaken/personalwebsite',
    live: '/artgen',
  },
  {
    title: 'allenliu.dev',
    year: '2023 – 2026',
    tagline: 'Personal website & archive',
    description:
      'The site you are looking at. Built with Next.js App Router, Mapbox GL for trail surveys, and live OAuth telemetry for Spotify listening and Hardcover book reading.',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Mapbox GL'],
    github: 'https://github.com/wildwastaken/personalwebsite',
    live: 'https://allenliu.dev',
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
          Software tools, hackathon prototypes, and side projects.
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
                {p.title}
              </h2>
              <span className="order-3 basis-full sm:order-2 sm:basis-auto font-mono text-xs text-[#6F6E69] dark:text-[#878580]">
                <span className="hidden sm:inline">• </span>{p.tagline}
              </span>
              <span className="order-2 sm:order-3 ml-auto pl-2 font-mono text-xs text-[#6F6E69] dark:text-[#878580] whitespace-nowrap">
                {p.year}
              </span>
            </div>

            {p.award && (
              <div className="font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                ★ {p.award}
              </div>
            )}

            {/* Description */}
            <p className="text-base text-[#282726] dark:text-[#D4D2C9] leading-relaxed max-w-prose">
              {p.description}
            </p>

            {/* Tech stack & Links */}
            <div className="pt-1 flex flex-wrap items-baseline justify-between gap-3 font-mono text-xs">
              <div className="text-[#6F6E69] dark:text-[#878580]">
                {p.stack.join(' • ')}
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={p.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-[#100F0F] dark:hover:text-[#CECDC3] text-[#100F0F] dark:text-[#CECDC3] font-medium"
                >
                  code ↗
                </a>
                {p.live?.startsWith('/') ? (
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
