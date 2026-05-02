import { cn } from '@/shared/lib/utils'
import type { ReactNode } from 'react'

interface StatCardProps {
  children: ReactNode
  animated?: boolean
  className?: string
}

export function StatCard({ children, animated, className }: StatCardProps) {
  return (
    <div className={cn('stat-card', animated && 'animated-border-slow', className)}>
      {children}
    </div>
  )
}
