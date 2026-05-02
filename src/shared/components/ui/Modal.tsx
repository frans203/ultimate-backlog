import { useEffect, useCallback, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { playClick } from '@/shared/lib/sounds'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  const handleEsc = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', handleEsc)
    }
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleEsc)
    }
  }, [isOpen, handleEsc])

  if (!isOpen) return null

  return createPortal(
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          playClick()
          onClose()
        }
      }}
    >
      <div className="modal-content animated-border">{children}</div>
    </div>,
    document.body
  )
}
