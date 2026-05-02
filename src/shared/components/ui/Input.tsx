import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/shared/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, className, ...props }, ref) => {
    return (
      <div>
        {label && (
          <label className="text-xs uppercase tracking-wider block mb-1 text-text-muted">
            {label}
          </label>
        )}
        <input ref={ref} className={cn('search-input', className)} {...props} />
      </div>
    )
  }
)
Input.displayName = 'Input'
