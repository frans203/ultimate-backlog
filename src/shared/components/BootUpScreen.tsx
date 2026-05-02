import { useEffect, useState } from 'react'

const BOOT_LINES = [
  '> Inicializando sistema...',
  '> Carregando módulos...',
  '> Conectando ao servidor...',
  '> Sincronizando dados...',
  '> Sistema pronto.',
]

interface BootUpScreenProps {
  onComplete: () => void
}

export function BootUpScreen({ onComplete }: BootUpScreenProps) {
  const [visibleLines, setVisibleLines] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleLines((prev) => {
        if (prev >= BOOT_LINES.length) {
          clearInterval(interval)
          setTimeout(onComplete, 400)
          return prev
        }
        return prev + 1
      })
    }, 300)
    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <div className="boot-screen">
      <div className="text-center mb-8">
        <h1
          className="text-2xl md:text-4xl tracking-widest text-neon-red logo-glitch"
          data-text="ULTIMATE BACKLOG"
          style={{ fontFamily: "'Deltha'" }}
        >
          ULTIMATE BACKLOG
        </h1>
      </div>
      <div className="space-y-2 text-xs text-text-secondary">
        {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
          <div
            key={i}
            className="boot-line"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            {line}
            {i === visibleLines - 1 && i < BOOT_LINES.length - 1 && (
              <span className="loading-pulse"> _</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
