import { useRef, useCallback } from 'react'

interface GlitchLogoProps {
  text: string
  className?: string
}

const GLITCH_CHARS = '█▓░╬§¶×÷±≠∞∆◊'

export function GlitchLogo({ text, className }: GlitchLogoProps) {
  const spanRef = useRef<HTMLSpanElement>(null)
  const animatingRef = useRef(false)

  const handleHover = useCallback(() => {
    if (animatingRef.current || !spanRef.current) return
    animatingRef.current = true
    const original = text
    let iterations = 0
    const maxIterations = 8

    const interval = setInterval(() => {
      if (!spanRef.current) { clearInterval(interval); return }
      const chars = original.split('')
      for (let i = 0; i < chars.length; i++) {
        if (chars[i] !== ' ' && chars[i] !== '\n' && Math.random() > iterations / maxIterations) {
          chars[i] = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
        }
      }
      spanRef.current.textContent = chars.join('')
      iterations++
      if (iterations >= maxIterations) {
        clearInterval(interval)
        if (spanRef.current) spanRef.current.textContent = original
        animatingRef.current = false
      }
    }, 50)
  }, [text])

  return (
    <span
      ref={spanRef}
      className={`logo-glitch ${className ?? ''}`}
      data-text={text}
      onMouseEnter={handleHover}
      style={{ fontFamily: "'Deltha', sans-serif" }}
    >
      {text}
    </span>
  )
}
