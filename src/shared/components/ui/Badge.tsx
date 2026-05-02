import type { BacklogStatus } from '@/shared/types/database.types'
import { STATUS_LABELS, STATUS_COLORS } from '@/shared/constants'

interface BadgeProps {
  status: BacklogStatus
}

export function Badge({ status }: BadgeProps) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`status-dot dot-${status}`} />
      <span className="text-xs" style={{ color: STATUS_COLORS[status] }}>
        {STATUS_LABELS[status]}
      </span>
    </div>
  )
}
