'use client'

import { motion } from 'framer-motion'
import { Camera } from 'lucide-react'

interface PhotoStatsProps {
  photoCount: number
}

export default function PhotoStats({ photoCount }: PhotoStatsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="grid grid-cols-2 md:grid-cols-2 gap-3 mt-16"
    >
        <div className="bg-zinc-100 dark:bg-zinc-900 rounded-lg p-6 border border-zinc-200 dark:border-zinc-800 text-center">
          <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            {photoCount}
          </div>
          <div className="text-sm text-zinc-600 dark:text-zinc-400">Moments Captured</div>
        </div>
        <div className="bg-zinc-100 dark:bg-zinc-900 rounded-lg p-6 border border-zinc-200 dark:border-zinc-800 text-center">
          <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            ∞
          </div>
          <div className="text-sm text-zinc-600 dark:text-zinc-400">More to Come</div>
        </div>
      </motion.div>
    )
  }
