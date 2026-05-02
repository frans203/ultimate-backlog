import { useCallback } from 'react'
import { playClick, playStatusChange, playCompleted, playTabClick } from '@/shared/lib/sounds'

export function useSound() {
  return {
    playClick: useCallback(() => playClick(), []),
    playStatusChange: useCallback(() => playStatusChange(), []),
    playCompleted: useCallback(() => playCompleted(), []),
    playTabClick: useCallback(() => playTabClick(), []),
  }
}
