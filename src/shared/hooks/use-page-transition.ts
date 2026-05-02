import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

export function usePageTransition() {
  const location = useLocation()
  const containerRef = useRef<HTMLDivElement>(null)
  const prevPath = useRef(location.pathname)

  useEffect(() => {
    if (prevPath.current === location.pathname) return
    prevPath.current = location.pathname

    const el = containerRef.current
    if (!el) return

    el.classList.add('page-glitch')
    const timer = setTimeout(() => {
      el.classList.remove('page-glitch')
      el.classList.add('boot-up')
      const cleanup = setTimeout(() => {
        el.classList.remove('boot-up')
      }, 800)
      return () => clearTimeout(cleanup)
    }, 250)

    return () => clearTimeout(timer)
  }, [location.pathname])

  return containerRef
}
