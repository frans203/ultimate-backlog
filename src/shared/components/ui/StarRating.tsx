import { playClick } from '@/shared/lib/sounds'

interface StarRatingProps {
  value: number
  onChange?: (rating: number) => void
  interactive?: boolean
}

export function StarRating({ value, onChange, interactive = false }: StarRatingProps) {
  return (
    <div className="star-rating flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`star ${i <= value ? 'filled' : ''}`}
          onClick={(e) => {
            if (interactive && onChange) {
              e.stopPropagation()
              playClick()
              onChange(i)
            }
          }}
          style={{ cursor: interactive ? 'pointer' : 'default' }}
        >
          ★
        </span>
      ))}
    </div>
  )
}
