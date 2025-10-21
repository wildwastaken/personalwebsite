'use client'

import { useState, useEffect } from 'react'

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    const onMouseEnter = () => setIsHovering(true)
    const onMouseLeave = () => setIsHovering(false)

    document.addEventListener('mousemove', onMouseMove)
    document.querySelectorAll('a, button').forEach((el) => {
      el.addEventListener('mouseenter', onMouseEnter)
      el.addEventListener('mouseleave', onMouseLeave)
    })

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.querySelectorAll('a, button').forEach((el) => {
        el.removeEventListener('mouseenter', onMouseEnter)
        el.removeEventListener('mouseleave', onMouseLeave)
      })
    }
  }, [])

  return (
    <div
      className={`custom-cursor ${isHovering ? 'hover' : ''}`}
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    />
  )
}
