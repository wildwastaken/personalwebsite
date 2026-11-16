import type { PostSection } from '@/lib/projectPosts'

const muted = 'text-[#6F6E69] dark:text-[#878580]'
const rule = 'border-[#E6E4D9] dark:border-[#282726]'

export function Figures({ figures }: { figures: NonNullable<PostSection['figures']> }) {
  // Phone screenshots (paths containing a known tall set) go in a row; wide ones stack.
  const tall = figures.length > 1 && figures.every((f) => f.src.includes('hardcover-wrapped/'))
  return (
    <div className={tall ? 'grid grid-cols-2 sm:grid-cols-4 gap-3' : 'space-y-5'}>
      {figures.map((f) => (
        <figure key={f.src} className="space-y-1.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={f.src}
            alt={f.alt}
            loading="lazy"
            className={`w-full rounded-lg border ${rule} bg-[#F2F0E5] dark:bg-[#1C1B1A]`}
          />
          {f.caption && <figcaption className={`font-mono text-[11px] leading-snug ${muted}`}>{f.caption}</figcaption>}
        </figure>
      ))}
    </div>
  )
}

// Highlighted once at build time (these pages are static), with light and dark colors
// switched by the site's .dark class in globals.css.
const LANGS: Record<string, string> = { python: 'python', ts: 'typescript', toml: 'toml', text: 'text' }

export async function CodeBlock({ code }: { code: NonNullable<PostSection['code']> }) {
  const { codeToHtml } = await import('shiki')
  const html = await codeToHtml(code.text.trim(), {
    lang: LANGS[code.lang] ?? 'text',
    themes: { light: 'vitesse-light', dark: 'vitesse-dark' },
    defaultColor: false,
  })
  return (
    <figure className="space-y-1.5">
      <div
        className={`code-block overflow-x-auto rounded-lg border ${rule} bg-[#F2F0E5] dark:bg-[#1C1B1A] p-4 text-[12.5px] leading-relaxed font-mono`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <figcaption className={`font-mono text-[11px] ${muted}`}>
        {code.lang}
        {code.caption ? ` · ${code.caption}` : ''}
      </figcaption>
    </figure>
  )
}

export function Bars({ bars }: { bars: NonNullable<PostSection['bars']> }) {
  return (
    <figure className={`rounded-lg border ${rule} p-4 space-y-2.5`}>
      {bars.rows.map((r) => (
        <div key={r.label} className="grid grid-cols-[7.5rem_1fr_3rem] items-center gap-3 font-mono text-xs">
          <span className={muted}>{r.label}</span>
          <span className="h-2.5 rounded-full bg-[#E6E4D9] dark:bg-[#282726] overflow-hidden">
            <span className="block h-full rounded-full bg-[#3A6B4F] dark:bg-[#8FB79C]" style={{ width: `${r.value * 100}%` }} />
          </span>
          <span className="text-right text-[#100F0F] dark:text-[#CECDC3]">{r.display}</span>
        </div>
      ))}
      <figcaption className={`pt-1 font-mono text-[11px] leading-snug ${muted}`}>{bars.caption}</figcaption>
    </figure>
  )
}

// Clip → source pipeline, drawn inline so it follows the site's light/dark colors.
export function ThesisPipeline() {
  const steps = [
    { title: '~32M TikToks', body: 'speech-to-text' },
    { title: 'Query windows', body: '80 words, every 40' },
    { title: 'Rare-feature lookup', body: '12 rarest words + 12 rarest trigrams' },
    { title: '~290 candidates', body: 'out of millions of passages' },
    { title: 'Fuzzy alignment', body: 'exact span + timestamp' },
  ]
  return (
    <figure className="space-y-1.5">
      <ol className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {steps.map((s, i) => (
          <li
            key={s.title}
            className={`relative rounded-lg border ${rule} p-3 bg-[#F2F0E5]/60 dark:bg-[#1C1B1A]`}
          >
            <span className={`font-mono text-[10px] ${muted}`}>0{i + 1}</span>
            <p className="font-serif text-sm font-bold text-[#100F0F] dark:text-[#CECDC3] leading-tight mt-0.5">{s.title}</p>
            <p className={`font-mono text-[10.5px] leading-snug mt-1 ${muted}`}>{s.body}</p>
          </li>
        ))}
      </ol>
      <figcaption className={`font-mono text-[11px] ${muted}`}>
        Podcast side: tens of thousands of episodes, transcribed and cut into overlapping 240-word passages, then indexed by word and character trigram.
      </figcaption>
    </figure>
  )
}
