import { useEffect, useRef } from 'react'

export function useGameTilt() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleMouseMove = (e: MouseEvent) => {
      const card = (e.target as HTMLElement).closest('.game-card') as HTMLElement | null
      if (!card) return
      const rect = card.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      card.style.transform = `perspective(800px) rotateX(${y * -8}deg) rotateY(${x * 8}deg) scale(1.03)`
    }

    const handleMouseLeave = (e: MouseEvent) => {
      const card = (e.target as HTMLElement).closest('.game-card') as HTMLElement | null
      if (card) card.style.transform = ''
    }

    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseleave', handleMouseLeave, true)
    return () => {
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseleave', handleMouseLeave, true)
    }
  }, [])

  return containerRef
}
