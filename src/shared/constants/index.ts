import type { BacklogStatus } from '@/shared/types/database.types'

export const STATUS_LABELS: Record<BacklogStatus, string> = {
  backlog: 'Backlog',
  playing: 'Jogando',
  completed: 'Completo',
  dropped: 'Dropado',
  on_hold: 'Em Espera',
}

export const STATUS_COLORS: Record<BacklogStatus, string> = {
  backlog: 'var(--neon-gray)',
  playing: 'var(--neon-blue)',
  completed: 'var(--neon-green)',
  dropped: 'var(--neon-red)',
  on_hold: 'var(--neon-amber)',
}

export const STATUS_FLASH_COLORS: Record<BacklogStatus, string> = {
  completed: 'rgba(34, 197, 94, 0.3)',
  dropped: 'rgba(255, 0, 64, 0.3)',
  playing: 'rgba(14, 165, 233, 0.3)',
  on_hold: 'rgba(245, 158, 11, 0.3)',
  backlog: 'rgba(107, 114, 128, 0.3)',
}
