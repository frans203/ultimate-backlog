import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loading } from '@/shared/components/ui'

export function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    // Supabase handles the OAuth callback automatically via onAuthStateChange
    // Just redirect to home after a brief delay
    const timer = setTimeout(() => navigate('/'), 1000)
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-base)' }}>
      <Loading />
    </div>
  )
}
