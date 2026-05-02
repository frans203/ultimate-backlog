import { forwardRef, type SelectHTMLAttributes } from 'react'
import { cn } from '@/shared/lib/utils'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, className, children, ...props }, ref) => {
    return (
      <div>
        {label && (
          <label className="text-xs uppercase tracking-wider block mb-1 text-text-muted">
            {label}
          </label>
        )}
        <select ref={ref} className={cn('cyber-select', className)} {...props}>
          {children}
        </select>
      </div>
    )
  }
)
Select.displayName = 'Select'
