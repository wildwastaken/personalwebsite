import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProjectPost, projectPosts } from '@/lib/projectPosts'
import { Bars, CodeBlock, Figures, ThesisPipeline } from './PostBlocks'

export const dynamicParams = false

export function generateStaticParams() {
  return projectPosts.map((p) => ({ slug: p.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getProjectPost(params.slug)
  if (!post) return {}
  return { title: post.title, description: post.subtitle }
}

const muted = 'text-[#6F6E69] dark:text-[#878580]'
const ink = 'text-[#100F0F] dark:text-[#CECDC3]'
const body = 'text-[#282726] dark:text-[#D4D2C9]'
const rule = 'border-[#E6E4D9] dark:border-[#282726]'

export default function ProjectPostPage({ params }: { params: { slug: string } }) {
  const post = getProjectPost(params.slug)
  if (!post) notFound()

  return (
    <article className="space-y-8">
      <Link href="/projects" className={`font-mono text-xs ${muted} hover:underline`}>
        ← projects
      </Link>

      <header className={`border-b ${rule} pb-6 space-y-3`}>
        <p className={`font-mono text-xs ${muted}`}>{post.meta}</p>
        <h1 className={`font-serif text-3xl font-bold tracking-tight ${ink}`}>{post.title}</h1>
        <p className={`text-lg leading-relaxed ${body} max-w-prose`}>{post.subtitle}</p>

        {post.facts && (
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4 pt-3">
            {post.facts.map((f) => (
              <div key={f.label}>
                <dt className={`font-serif text-2xl font-bold ${ink}`}>{f.value}</dt>
                <dd className={`font-mono text-[11px] leading-snug ${muted}`}>{f.label}</dd>
              </div>
            ))}
          </dl>
        )}
      </header>

      <div className="space-y-8">
        {post.sections.map((section) => (
          <section key={section.heading} className="space-y-4">
            <h2 className={`font-mono text-xs uppercase tracking-wider ${muted}`}>{section.heading}</h2>
            {section.paragraphs.map((para, i) => (
              <p key={i} className={`text-base leading-relaxed ${body} max-w-prose`}>
                {para}
              </p>
            ))}
            {section.bullets && (
              <ul className={`list-disc pl-5 space-y-1.5 text-base leading-relaxed ${body} max-w-prose marker:text-[#878580]`}>
                {section.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            )}
            {section.diagram === 'thesis-pipeline' && <ThesisPipeline />}
            {section.bars && <Bars bars={section.bars} />}
            {section.code && <CodeBlock code={section.code} />}
            {section.figures && <Figures figures={section.figures} />}
          </section>
        ))}
      </div>

      {post.links && (
        <footer className={`border-t ${rule} pt-5 flex flex-wrap gap-4 font-mono text-xs`}>
          {post.links.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className={`underline font-medium ${ink}`}>
              {l.label} ↗
            </a>
          ))}
        </footer>
      )}
    </article>
  )
}
