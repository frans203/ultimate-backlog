interface CoverFrameProps {
  src?: string | null
  alt: string
  fallback?: string
  className?: string
  style?: React.CSSProperties
}

export function CoverFrame({ src, alt, fallback = 'SEM CAPA', className, style }: CoverFrameProps) {
  return (
    <div className={`cover-frame ${className ?? ''}`} style={{ aspectRatio: '3/4', ...style }}>
      {src ? (
        <img src={src} alt={alt} loading="lazy" />
      ) : (
        <div
          className="flex items-center justify-center h-full"
          style={{ color: 'var(--text-muted)', fontSize: '10px' }}
        >
          {fallback}
        </div>
      )}
    </div>
  )
}
