import { RouterProvider } from 'react-router-dom'
import { Providers } from './providers'
import { router } from './router'
import { useEffect } from 'react'
import { useStore } from '@/shared/store'

function CRTInit() {
  const crtEnabled = useStore((s) => s.crtEnabled)
  useEffect(() => {
    document.body.classList.toggle('crt-off', !crtEnabled)
  }, [crtEnabled])
  return null
}

export default function App() {
  return (
    <Providers>
      <CRTInit />
      <RouterProvider router={router} />
    </Providers>
  )
}
