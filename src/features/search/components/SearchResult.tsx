import { CoverFrame } from '@/shared/components/ui'
import type { RawgGame } from '@/shared/types/database.types'

interface SearchResultProps {
  game: RawgGame
  alreadyAdded: boolean
  onAdd: () => void
  onClick: () => void
  isAdding?: boolean
}

export function SearchResult({ game, alreadyAdded, onAdd, onClick, isAdding }: SearchResultProps) {
  return (
    <div
      className="search-result scan-hover flex items-center gap-3 p-3 cursor-pointer transition-all hover:bg-white/[0.02]"
      style={{ border: '1px solid var(--border-color)' }}
      onClick={onClick}
    >
      <CoverFrame
        src={game.background_image}
        alt={game.name}
        fallback="?"
        className="flex-shrink-0"
        style={{ width: 48, height: 64, aspectRatio: 'auto' }}
      />
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium truncate">{game.name}</h3>
        <p className="text-xs truncate text-text-secondary">
          {game.released ? game.released.substring(0, 4) : '?'}
          {(game.genres || []).length > 0 &&
            ' · ' + game.genres.slice(0, 2).map((g) => g.name).join(', ')}
        </p>
        <p className="text-xs truncate text-text-muted">
          {(game.platforms || []).slice(0, 4).map((p) => p.platform.name).join(', ')}
          {game.playtime > 0 && ` · ~${game.playtime}h`}
        </p>
      </div>
      {alreadyAdded ? (
        <span
          className="text-xs uppercase tracking-wider px-2 py-1 flex-shrink-0"
          style={{ color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}
        >
          Adicionado
        </span>
      ) : isAdding ? (
        <span
          className="add-btn flex-shrink-0 loading-pulse pointer-events-none"
          style={{ color: 'var(--neon-green)', borderColor: 'var(--neon-green)' }}
        >
          ···
        </span>
      ) : (
        <button
          className="add-btn flex-shrink-0"
          onClick={(e) => {
            e.stopPropagation()
            onAdd()
          }}
        >
          +
        </button>
      )}
    </div>
  )
}
