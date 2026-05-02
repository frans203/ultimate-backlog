import { useEffect, useRef, useState, useCallback } from 'react'
import { playClick } from '@/shared/lib/sounds'

interface SnackbarMessage {
  text: string
  undoFn?: () => void
}

let showSnackbarFn: ((msg: SnackbarMessage) => void) | null = null

export function showSnackbar(text: string, undoFn?: () => void) {
  showSnackbarFn?.({ text, undoFn })
}

export function Snackbar() {
  const [message, setMessage] = useState<SnackbarMessage | null>(null)
  const [visible, setVisible] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  const hide = useCallback(() => {
    setVisible(false)
    setTimeout(() => setMessage(null), 300)
  }, [])

  useEffect(() => {
    showSnackbarFn = (msg) => {
      clearTimeout(timerRef.current)
      setMessage(msg)
      setVisible(true)
      timerRef.current = setTimeout(hide, 5000)
    }
    return () => {
      showSnackbarFn = null
    }
  }, [hide])

  if (!message) return null

  return (
    <div className={`snackbar max-w-[calc(100vw-2rem)] md:max-w-[52rem] ${visible ? 'show' : ''}`}>
      <span className="truncate max-w-[240px] md:max-w-none">{message.text}</span>
      {message.undoFn && (
        <button
          className="text-xs uppercase tracking-wider px-3 py-1 border border-white/20 hover:border-white/40 bg-transparent text-white font-mono cursor-pointer"
          onClick={() => {
            message.undoFn?.()
            playClick()
            hide()
          }}
        >
          Desfazer
        </button>
      )}
    </div>
  )
}
