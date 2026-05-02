import { useStore } from '@/shared/store'
import { useSound } from './use-sound'

export function useCrt() {
  const crtEnabled = useStore((s) => s.crtEnabled)
  const setCrtEnabled = useStore((s) => s.setCrtEnabled)
  const { playClick } = useSound()

  const toggleCrt = () => {
    setCrtEnabled(!crtEnabled)
    playClick()
  }

  return { crtEnabled, toggleCrt }
}
