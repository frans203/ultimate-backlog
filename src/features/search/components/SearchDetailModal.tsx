import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { rawgQueries } from '../api/rawg-queries'
import { Modal, CoverFrame, Button, Loading } from '@/shared/components/ui'
import type { RawgGame } from '@/shared/types/database.types'

interface SearchDetailModalProps {
  game: RawgGame | null
  isOpen: boolean
  onClose: () => void
  onAdd: (description: string) => void
  alreadyAdded: boolean
  isAdding?: boolean
}

export function SearchDetailModal({ game, isOpen, onClose, onAdd, alreadyAdded, isAdding }: SearchDetailModalProps) {
  const [expanded, setExpanded] = useState(false)
  const { data: details, isLoading } = useQuery({
    ...rawgQueries.details(game?.id || 0),
    enabled: isOpen && !!game,
  })

  if (!game) return null

  const desc = details?.description_raw || ''
  const needsTruncate = desc.length > 300
  const displayDesc = expanded || !needsTruncate ? desc : desc.substring(0, 300) + '...'
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-4 md:p-6">
        <button
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-white cursor-pointer bg-transparent border-none"
          onClick={onClose}
          style={{ fontFamily: 'inherit' }}
        >
          ✕
        </button>

        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <CoverFrame
            src={game.background_image}
            alt={game.name}
            fallback="?"
            className="flex-shrink-0"
            style={{ width: 140, height: 187, aspectRatio: 'auto' }}
          />
          <div>
            <h2 className="text-lg font-bold mb-2">{game.name}</h2>
            <div className="space-y-1 text-xs text-text-secondary">
              {game.released && <p>Lançamento: {game.released}</p>}
              <p>Gêneros: {(game.genres || []).map((g) => g.name).join(', ') || '?'}</p>
              <p>Plataformas: {(game.platforms || []).map((p) => p.platform.name).join(', ') || '?'}</p>
              {game.playtime > 0 && <p>Tempo médio: ~{game.playtime}h</p>}
              {game.rating ? <p>Rating RAWG: {game.rating}/5</p> : null}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="mb-4">
            <p className="loading-pulse text-xs uppercase tracking-wider text-text-muted">
              Carregando descrição...
            </p>
          </div>
        ) : desc ? (
          <div className="mb-4">
            <label className="text-xs uppercase tracking-wider block mb-2 text-text-muted">
              Descrição
            </label>
            <p className="text-xs leading-relaxed text-text-secondary">{displayDesc}</p>
            {needsTruncate && !expanded && (
              <button
                onClick={() => setExpanded(true)}
                className="text-xs mt-1 cursor-pointer bg-transparent border-none text-neon-red uppercase tracking-wider"
                style={{ fontFamily: 'inherit', padding: 0 }}
              >
                Mostrar mais
              </button>
            )}
          </div>
        ) : null}

        {alreadyAdded ? (
          <div
            className="text-xs uppercase tracking-wider text-center py-3"
            style={{ border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}
          >
            Já está no backlog
          </div>
        ) : (
          <Button
            variant="green"
            className="w-full py-3"
            disabled={isAdding}
            onClick={() => onAdd(details?.description_raw || '')}
          >
            {isAdding ? (
              <span className="loading-pulse">Adicionando...</span>
            ) : (
              '+ Adicionar ao Backlog'
            )}
          </Button>
        )}
      </div>
    </Modal>
  )
}
