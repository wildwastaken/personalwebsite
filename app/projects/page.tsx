'use client'

import { motion } from 'framer-motion'
import { Github, ExternalLink, Calendar, Star } from 'lucide-react'
import Link from 'next/link'

const projects = [
  {
    id: 1,
    title: 'tabs',
    description: 'Built for a friend to turn Ultimate Guitar tabs into clean, printable PDFs — with controls for font, spacing, transposition, and autoscroll.',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Vercel'],
    github: 'https://github.com/wildwastaken/tabs',
    live: 'https://allenstabs.netlify.app',
    date: '2025',
    status: 'Updating',
    featured: true
  },
  {
    id: 2,
    title: 'GeomPT (HackMIT 2024)',
    description: 'An AI-powered web platform for physical therapy providers to track and analyze patients\' range of motion (ROM) over time. Leverages OpenCV and MediaPipe for real-time pose analysis via websockets, with Firebase for secure data storage and LLM-powered insights. Placed 2nd overall out of 200+ teams.',
    tech: ['OpenCV', 'MediaPipe', 'Flask', 'Firebase', 'Next.js', 'React', 'WebSockets'],
    github: 'https://github.com/orgs/GeomPT/repositories',
    date: '2024',
    status: 'Completed'
  },
  {
    id: 3,
    title: 'Personal Website',
    description: 'My portfolio site (allenliu.dev). Built with Next.js, TypeScript, and Tailwind CSS, featuring dynamic photo galleries, interactive hiking maps, and Spotify integration. Actively maintained.',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    github: 'https://github.com/wildwastaken/personalwebsite',
    live: 'https://allenliu.dev',
    date: '2023',
    status: 'Updating'
  },
  {
    id: 4,
    title: 'gifting',
    description: 'Course project (VIS208) published via GitHub Pages with multiple themed subfolders. A small static site showcasing intentional design and data visualization.',
    tech: ['HTML', 'CSS', 'JavaScript', 'GitHub Pages'],
    github: 'https://github.com/wildwastaken/gifting',
    live: 'https://wildwastaken.github.io/gifting/',
    date: '2025',
    status: 'Completed'
  },
  {
    id: 5,
    title: 'BareShelves',
    description: 'A COVID-era tracker that notified people when essential items came back in stock on Amazon. Followed my earlier AmznMonitor work, expanding notifications and heuristics.',
    tech: ['Python', 'Web Scraping', 'Automation', 'Notifications'],
    github: 'https://github.com/wildwastaken/bareshelves',
    date: '2020',
    status: 'Completed'
  },
  {
    id: 6,
    title: 'AmznMonitor',
    description: 'An early monitoring/automation system that polled Amazon listings and sent notifications while handling anti-bot constraints. Precursor to BareShelves.',
    tech: ['Python', 'Selenium', 'Web Scraping', 'Automation'],
    github: 'https://github.com/wildwastaken/amznmonitor',
    date: '2019',
    status: 'Completed'
  }
]

export default function Projects() {
  const featuredProjects = projects.filter(p => p.featured)
  const otherProjects = projects.filter(p => !p.featured)

  return (
    <div className="min-h-screen px-6 py-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-zinc-100">
            Projects
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl">
            A collection of things I've built while learning and exploring new technologies.
          </p>
        </motion.div>

        {/* Stats */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          <div className="bg-zinc-100 dark:bg-zinc-900 rounded-lg p-4 border border-zinc-200 dark:border-zinc-800 text-center">
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">{projects.length}</div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">Total Projects</div>
          </div>
          <div className="bg-zinc-100 dark:bg-zinc-900 rounded-lg p-4 border border-zinc-200 dark:border-zinc-800 text-center">
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">
              {projects.filter(p => p.status === 'Completed').length}
            </div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">Completed</div>
          </div>
          <div className="bg-zinc-100 dark:bg-zinc-900 rounded-lg p-4 border border-zinc-200 dark:border-zinc-800 text-center">
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">
              {featuredProjects.length}
            </div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">Featured</div>
          </div>
          <div className="bg-zinc-100 dark:bg-zinc-900 rounded-lg p-4 border border-zinc-200 dark:border-zinc-800 text-center">
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">2020</div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">Since</div>
          </div>
        </motion.div> */}

        {/* Featured Projects */}
        {featuredProjects.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-8 flex items-center">
              <Star className="w-6 h-6 mr-2 text-yellow-500" />
              Featured Projects
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              {featuredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="bg-zinc-100 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors h-full"
                >
                  <div className="p-6 h-full flex flex-col">
                    {/* Project Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                          {project.title}
                        </h2>
                        <div className="flex items-center space-x-4 text-sm text-zinc-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{project.date}</span>
                          </div>
                          <div className={`px-2 py-1 rounded text-xs ${
                            project.status === 'Completed'
                              ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                              : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                          }`}>
                            {project.status}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-zinc-700 dark:text-zinc-300 mb-4 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Links */}
                    <div className="mt-auto flex space-x-4">
                      <Link
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all duration-300 hover:scale-110"
                      >
                        <Github className="w-4 h-4" />
                        <span className="text-sm">Code</span>
                      </Link>
                      {project.live && (
                        <Link
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all duration-300 hover:scale-110"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span className="text-sm">Live Demo</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Other Projects */}
        {otherProjects.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-8">
              Other Projects
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              {otherProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="bg-zinc-100 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors h-full"
                >
                  <div className="p-6 h-full flex flex-col">
                    {/* Project Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                          {project.title}
                        </h2>
                        <div className="flex items-center space-x-4 text-sm text-zinc-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{project.date}</span>
                          </div>
                          <div className={`px-2 py-1 rounded text-xs ${
                            project.status === 'Completed'
                              ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                              : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                          }`}>
                            {project.status}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-zinc-700 dark:text-zinc-300 mb-4 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Links */}
                    <div className="mt-auto flex space-x-4">
                      <Link
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all duration-300 hover:scale-110"
                      >
                        <Github className="w-4 h-4" />
                        <span className="text-sm">Code</span>
                      </Link>
                      {project.live && (
                        <Link
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all duration-300 hover:scale-110"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span className="text-sm">Live Demo</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-zinc-100 dark:bg-zinc-900 rounded-lg p-8 border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              Interested in Collaborating?
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6 max-w-2xl mx-auto">
              I'm always open to working on interesting projects and learning from others.
              Feel free to reach out if you'd like to collaborate or just chat about technology.
            </p>
            <Link
              href="mailto:allenliu@princeton.edu"
              className="inline-flex items-center px-6 py-3 bg-zinc-900 dark:bg-zinc-800 text-zinc-100 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
