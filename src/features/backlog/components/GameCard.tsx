import { Badge } from '@/shared/components/ui'
import { CoverFrame } from '@/shared/components/ui'
import type { Game } from '@/shared/types/database.types'

interface GameCardProps {
  game: Game
  onClick: () => void
}

export function GameCard({ game, onClick }: GameCardProps) {
  return (
    <div
      className={`game-card status-${game.status}`}
      onClick={onClick}
      data-id={game.id}
    >
      <div style={{ position: 'relative' }}>
        <CoverFrame src={game.cover} alt={game.name} />
        <div className="card-overlay">
          <div className="text-xs mb-1 text-text-secondary">
            {(game.genres || []).slice(0, 2).join(', ')}
          </div>
          <div className="text-xs text-text-secondary">
            {(game.platforms || []).slice(0, 3).join(', ')}
          </div>
          {game.released && (
            <div className="text-xs mt-1 text-text-muted">
              {game.released.substring(0, 4)}
            </div>
          )}
          <div className="text-xs mt-1 text-text-secondary">
            ~{game.estimated_hours}h
          </div>
        </div>
      </div>
      <div className="p-2">
        <Badge status={game.status} />
        <h3 className="text-xs font-medium truncate mt-1" title={game.name}>
          {game.name}
        </h3>
        {game.user_rating > 0 && (
          <div className="mt-1" style={{ fontSize: '10px', color: 'var(--neon-amber)' }}>
            {'★'.repeat(game.user_rating)}
            {'☆'.repeat(5 - game.user_rating)}
          </div>
        )}
      </div>
    </div>
  )
}
