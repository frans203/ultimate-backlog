import { useEffect, useRef } from 'react'

export function useBootUp() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.classList.add('boot-up')
    }
  }, [])

  return ref
}
