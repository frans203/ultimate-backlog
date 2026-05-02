import { useState, useRef, useEffect, useCallback } from 'react'

interface DropdownOption {
  value: string
  label: string
}

interface DropdownProps {
  value: string
  onChange: (value: string) => void
  options: DropdownOption[]
  placeholder?: string
  className?: string
  label?: string
}

export function Dropdown({ value, onChange, options, placeholder, className = '', label }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const selected = options.find((o) => o.value === value)
  const displayLabel = selected?.label || placeholder || ''

  const handleSelect = useCallback(
    (val: string) => {
      onChange(val)
      setOpen(false)
    },
    [onChange],
  )

  useEffect(() => {
    if (!open) return

    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [open])

  return (
    <div ref={ref} className={`relative ${className}`}>
      {label && (
        <label className="text-xs uppercase tracking-wider block mb-2 text-text-muted">
          {label}
        </label>
      )}
      <button
        type="button"
        className="cyber-select w-full flex items-center justify-between gap-2 cursor-pointer text-left"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="truncate">{displayLabel}</span>
        <span
          className="text-[10px] transition-transform duration-200 flex-shrink-0"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          ▼
        </span>
      </button>

      {open && (
        <ul
          className="absolute left-0 right-0 mt-1 max-h-60 overflow-y-auto border z-50"
          style={{
            background: 'var(--bg-surface)',
            borderColor: 'var(--neon-red)',
          }}
        >
          {options.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                className={`w-full text-left px-3 py-2 text-xs font-mono uppercase tracking-wider cursor-pointer border-none transition-colors ${
                  opt.value === value
                    ? 'text-neon-red bg-white/[0.08]'
                    : 'text-text-primary hover:text-neon-red hover:bg-white/[0.05]'
                }`}
                style={{ background: opt.value === value ? 'rgba(255,255,255,0.08)' : 'transparent', fontFamily: 'inherit' }}
                onClick={() => handleSelect(opt.value)}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
