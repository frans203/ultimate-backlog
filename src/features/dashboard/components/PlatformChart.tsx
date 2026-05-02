import type { Game } from '@/shared/types/database.types'

interface PlatformChartProps {
  games: Game[]
}

export function PlatformChart({ games }: PlatformChartProps) {
  const platformCounts: Record<string, number> = {}
  games.forEach((g) => {
    (g.platforms || []).forEach((p) => {
      platformCounts[p] = (platformCounts[p] || 0) + 1
    })
  })

  const platforms = Object.entries(platformCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)

  if (platforms.length === 0) return null

  const maxCount = platforms[0][1]

  return (
    <div className="mb-6">
      <h2 className="text-xs uppercase tracking-widest mb-4 text-text-muted">
        Jogos por Plataforma
      </h2>
      <div className="space-y-2">
        {platforms.map(([name, count]) => (
          <div key={name} className="flex items-center gap-3">
            <span className="text-xs w-24 truncate text-text-secondary">{name}</span>
            <div className="flex-1 h-1.5" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div
                className="h-full"
                style={{
                  width: `${(count / maxCount) * 100}%`,
                  background: 'var(--neon-red)',
                  boxShadow: '0 0 6px rgba(255,0,64,0.4)',
                }}
              />
            </div>
            <span className="text-xs font-bold w-6 text-right">{count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
