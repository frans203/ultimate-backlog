import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { GlitchLogo, Tabs } from '@/shared/components/ui'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'
import { BootUpScreen } from '@/shared/components/BootUpScreen'

export function AuthPage() {
  const [tab, setTab] = useState('login')
  const [showBoot, setShowBoot] = useState(false)
  const navigate = useNavigate()

  const handleSuccess = useCallback(() => {
    setShowBoot(true)
  }, [])

  const handleBootComplete = useCallback(() => {
    navigate('/')
  }, [navigate])

  if (showBoot) {
    return <BootUpScreen onComplete={handleBootComplete} />
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg-base)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <GlitchLogo text="ULTIMATE BACKLOG" className="text-xl md:text-2xl tracking-widest text-neon-red" />
        </div>

        <div className="animated-border p-6">
          <Tabs
            value={tab}
            onChange={setTab}
            items={[
              { key: 'login', label: 'Login' },
              { key: 'register', label: 'Registrar' },
            ]}
          />

          <div className="mt-6">
            {tab === 'login' ? (
              <LoginForm onSuccess={handleSuccess} />
            ) : (
              <RegisterForm onSuccess={handleSuccess} />
            )}
          </div>

          {/* Google OAuth - disabled for now */}
          <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
            <button
              disabled
              className="w-full py-2 text-xs uppercase tracking-wider font-mono cursor-not-allowed opacity-40"
              style={{
                background: 'none',
                border: '1px solid var(--border-color)',
                color: 'var(--text-secondary)',
              }}
              title="Em breve"
            >
              Entrar com Google (em breve)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
