import { createPortal } from 'react-dom'
import { playClick } from '@/shared/lib/sounds'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel }: ConfirmDialogProps) {
  if (!isOpen) return null

  return createPortal(
    <div
      className="confirm-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          playClick()
          onCancel()
        }
      }}
    >
      <div
        className="p-6 max-w-sm w-full"
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--neon-red)',
          boxShadow: '0 0 30px rgba(255,0,64,0.15)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-sm font-bold mb-2 text-neon-red">{title}</p>
        <p className="text-xs mb-6 text-text-secondary">{message}</p>
        <div className="flex gap-3">
          <button
            className="flex-1 py-2 text-xs uppercase tracking-wider cursor-pointer font-mono"
            style={{
              background: 'rgba(255,0,64,0.15)',
              border: '1px solid var(--neon-red)',
              color: 'var(--neon-red)',
            }}
            onClick={() => {
              playClick()
              onConfirm()
            }}
          >
            [SIM]
          </button>
          <button
            className="flex-1 py-2 text-xs uppercase tracking-wider cursor-pointer font-mono"
            style={{
              background: 'none',
              border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)',
            }}
            onClick={() => {
              playClick()
              onCancel()
            }}
          >
            [NÃO]
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
