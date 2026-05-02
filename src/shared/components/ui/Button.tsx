import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/shared/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'green'
  size?: 'sm' | 'md' | 'lg'
}

const variants = {
  primary: 'border-neon-red text-neon-red hover:bg-neon-red/10',
  secondary: 'border-border-default text-text-secondary hover:border-border-hover hover:text-text-primary',
  danger: 'border-neon-red/30 text-neon-red hover:bg-red-900/20',
  ghost: 'border-transparent text-text-secondary hover:text-text-primary hover:bg-white/5',
  green: 'border-neon-green bg-neon-green text-black font-bold hover:shadow-[0_0_12px_rgba(34,197,94,0.5)]',
}

const sizes = {
  sm: 'px-3 py-1 text-xs',
  md: 'px-4 py-2 text-xs',
  lg: 'px-6 py-3 text-sm',
}

export function Button({ variant = 'primary', size = 'md', className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'font-mono uppercase tracking-wider cursor-pointer transition-all border disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
