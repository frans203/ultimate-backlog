import { StatCard, ProgressBar } from '@/shared/components/ui'
import type { Game } from '@/shared/types/database.types'

interface GameStatsProps {
  games: Game[]
}

export function GameStats({ games }: GameStatsProps) {
  const total = games.length
  const playing = games.filter((g) => g.status === 'playing').length
  const completed = games.filter((g) => g.status === 'completed').length
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0

  const remaining = games.filter((g) => g.status !== 'completed' && g.status !== 'dropped')
  const hoursRemaining = remaining.reduce((sum, g) => sum + (g.estimated_hours || 0), 0)
  const hoursCompleted = games
    .filter((g) => g.status === 'completed')
    .reduce((sum, g) => sum + (g.estimated_hours || 0), 0)

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-2.5">
        <StatCard animated>
          <div className="text-xs uppercase tracking-wider mb-2 text-text-muted">Total</div>
          <div className="text-2xl font-bold">{total}</div>
          <div className="text-xs mt-1 text-text-secondary">jogos</div>
        </StatCard>
        <StatCard>
          <div className="text-xs uppercase tracking-wider mb-2 text-neon-blue">Jogando</div>
          <div className="text-2xl font-bold">{playing}</div>
          <div className="text-xs mt-1 text-text-secondary">ativos</div>
        </StatCard>
        <StatCard>
          <div className="text-xs uppercase tracking-wider mb-2 text-neon-green">Completos</div>
          <div className="text-2xl font-bold">{completed}</div>
          <div className="text-xs mt-1 text-text-secondary">zerados</div>
        </StatCard>
        <StatCard animated>
          <div className="text-xs uppercase tracking-wider mb-2 text-neon-red">Progresso</div>
          <div className="text-2xl font-bold">
            {pct}<span className="text-sm">%</span>
          </div>
          <ProgressBar value={pct} />
        </StatCard>
      </div>

      <div className="grid grid-cols-2 gap-2.5 mb-4">
        <StatCard>
          <div className="text-xs uppercase tracking-wider mb-1 text-text-muted">Horas Restantes</div>
          <div className="text-xl font-bold">
            ~{hoursRemaining}<span className="text-xs font-normal">h</span>
          </div>
        </StatCard>
        <StatCard>
          <div className="text-xs uppercase tracking-wider mb-1 text-text-muted">Horas Completas</div>
          <div className="text-xl font-bold">
            ~{hoursCompleted}<span className="text-xs font-normal">h</span>
          </div>
        </StatCard>
      </div>
    </>
  )
}
