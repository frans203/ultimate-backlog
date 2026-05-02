import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string | ReactNode
  subtitle?: string
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="flex items-center gap-3 mb-6">
      {typeof title === 'string' ? (
        <h1 className="text-lg tracking-widest uppercase text-text-primary">{title}</h1>
      ) : (
        title
      )}
      <div className="flex-1 h-px" style={{ background: 'var(--border-color)' }} />
      {subtitle && <span className="text-xs text-text-muted">{subtitle}</span>}
    </div>
  )
}
