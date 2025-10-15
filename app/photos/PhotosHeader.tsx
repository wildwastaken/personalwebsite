'use client'

import { motion } from 'framer-motion'
import { Camera } from 'lucide-react'

export default function PhotosHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 mb-16"
    >
      <div className="flex items-center space-x-3">
        <Camera className="w-8 h-8 text-blue-600 dark:text-blue-500" />
        <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-zinc-100">
          Places and People
        </h1>
      </div>
      <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl">
        Moments that I love.
      </p>
    </motion.div>
  )
}
