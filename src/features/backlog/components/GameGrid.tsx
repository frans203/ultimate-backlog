import type { Game } from '@/shared/types/database.types'
import { GameCard } from './GameCard'
import { useGameTilt } from '../hooks/use-game-tilt'

interface GameGridProps {
  games: Game[]
  onGameClick: (game: Game) => void
  columns?: string
}

export function GameGrid({ games, onGameClick, columns }: GameGridProps) {
  const tiltRef = useGameTilt()

  return (
    <div
      ref={tiltRef}
      className={columns || 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3'}
    >
      {games.map((game) => (
        <GameCard key={game.id} game={game} onClick={() => onGameClick(game)} />
      ))}
    </div>
  )
}
