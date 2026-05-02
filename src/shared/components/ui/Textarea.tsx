import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/shared/lib/utils'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, className, ...props }, ref) => {
    return (
      <div>
        {label && (
          <label className="text-xs uppercase tracking-wider block mb-1 text-text-muted">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn('search-input', className)}
          style={{ resize: 'none' }}
          {...props}
        />
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'
