interface EmptyStateProps {
  message?: string
}

export function EmptyState({ message = '> SEM DADOS' }: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center py-20">
      <p className="terminal-text text-sm text-text-muted">{message}</p>
    </div>
  )
}
