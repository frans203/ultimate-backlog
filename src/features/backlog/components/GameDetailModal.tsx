import { useState } from 'react'
import { Modal, StarRating, CoverFrame, Button, Dropdown } from '@/shared/components/ui'
import { ConfirmDialog } from '@/shared/components/ui'
import { STATUS_LABELS } from '@/shared/constants'
import { useUpdateStatus, useUpdateRating, useUpdateNotes, useUpdateHours, useRemoveGame } from '../api/game-mutations'
import type { Game, BacklogStatus } from '@/shared/types/database.types'

interface GameDetailModalProps {
  game: Game | null
  isOpen: boolean
  onClose: () => void
}

export function GameDetailModal({ game, isOpen, onClose }: GameDetailModalProps) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const updateStatus = useUpdateStatus()
  const updateRating = useUpdateRating()
  const updateNotes = useUpdateNotes()
  const updateHours = useUpdateHours()
  const removeGame = useRemoveGame()

  if (!game) return null

  const desc = game.description || ''
  const needsTruncate = desc.length > 300
  const displayDesc = expanded || !needsTruncate ? desc : desc.substring(0, 300) + '...'

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="p-4 md:p-6">
          <button
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-white cursor-pointer bg-transparent border-none"
            onClick={onClose}
            style={{ fontFamily: 'inherit' }}
          >
            ✕
          </button>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <CoverFrame
              src={game.cover}
              alt={game.name}
              fallback="?"
              className="flex-shrink-0"
              style={{ width: 140, height: 187, aspectRatio: 'auto' }}
            />
            <div className="flex-1">
              <h2 className="text-lg font-bold mb-2">{game.name}</h2>
              <div className="space-y-1 text-xs text-text-secondary">
                {game.released && <p>Lançamento: {game.released}</p>}
                <p>Gêneros: {(game.genres || []).join(', ') || '?'}</p>
                <p>Plataformas: {(game.platforms || []).join(', ') || '?'}</p>
                <p className="flex items-center gap-1">
                  Horas estimadas: ~
                  <input
                    type="number"
                    min={0}
                    className="search-input w-16 text-xs px-1 py-0.5 inline-block"
                    defaultValue={game.estimated_hours || 0}
                    onBlur={(e) => {
                      const hours = Math.max(0, parseInt(e.target.value) || 0)
                      if (hours !== game.estimated_hours) {
                        updateHours.mutate({ id: game.id, hours })
                      }
                    }}
                  />h
                </p>
              </div>
            </div>
          </div>

          {desc && (
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
          )}

          <div className="mb-4">
            <Dropdown
              label="Status"
              className="w-full"
              value={game.status}
              onChange={(value) =>
                updateStatus.mutate({
                  id: game.id,
                  status: value as BacklogStatus,
                  oldStatus: game.status,
                })
              }
              options={Object.entries(STATUS_LABELS).map(([key, label]) => ({
                value: key,
                label,
              }))}
            />
          </div>

          <div className="mb-4">
            <label className="text-xs uppercase tracking-wider block mb-2 text-text-muted">
              Avaliação
            </label>
            <StarRating
              value={game.user_rating || 0}
              interactive
              onChange={(rating) => updateRating.mutate({ id: game.id, rating })}
            />
          </div>

          <div className="mb-4">
            <label className="text-xs uppercase tracking-wider block mb-2 text-text-muted">
              Notas
            </label>
            <textarea
              className="search-input w-full"
              rows={3}
              style={{ resize: 'none' }}
              placeholder="> suas anotações..."
              defaultValue={game.notes || ''}
              onBlur={(e) => updateNotes.mutate({ id: game.id, notes: e.target.value })}
            />
          </div>

          <Button
            variant="danger"
            className="w-full"
            onClick={() => setShowConfirm(true)}
          >
            Remover do Backlog
          </Button>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={showConfirm}
        title="> CONFIRMAR REMOÇÃO?"
        message={`"${game.name}" será removido do backlog.`}
        onConfirm={() => {
          removeGame.mutate({ id: game.id, name: game.name })
          setShowConfirm(false)
          onClose()
        }}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  )
}
