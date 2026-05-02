import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/use-auth'
import { profileQueries } from '../api/profile-queries'
import { gameQueries } from '@/features/backlog/api/game-queries'
import { PageHeader } from '@/shared/components/layout/PageHeader'
import { StatCard, Loading, Button } from '@/shared/components/ui'
import { ProfileForm } from './ProfileForm'
import { useCrt } from '@/shared/hooks/use-crt'
import { useBootUp } from '@/shared/hooks/use-boot-up'
import { supabase } from '@/shared/lib/supabase'
import { playClick } from '@/shared/lib/sounds'

export function ProfilePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { data: profile, isLoading: profileLoading } = useQuery(profileQueries.me(user!.id))
  const { data: games } = useQuery(gameQueries.all(user!.id))
  const { crtEnabled, toggleCrt } = useCrt()
  const bootRef = useBootUp()

  const handleLogout = async () => {
    playClick()
    await supabase.auth.signOut()
    navigate('/auth')
  }

  if (profileLoading) return <Loading />

  const allGames = games || []
  const completed = allGames.filter((g) => g.status === 'completed').length
  const pct = allGames.length > 0 ? Math.round((completed / allGames.length) * 100) : 0

  return (
    <section className="page-section" ref={bootRef}>
      <PageHeader title="PERFIL" />

      <div className="max-w-md">
        <div className="stat-card animated-border-slow mb-4">
          <div className="flex items-center gap-4 mb-6">
            <div
              className="w-16 h-16 flex items-center justify-center text-2xl"
              style={{ border: '1px dashed var(--border-hover)', color: 'var(--text-muted)' }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" width="32" height="32">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-bold">{profile?.display_name || profile?.username || 'USUÁRIO'}</div>
              <div className="text-xs text-text-secondary">{user?.email}</div>
            </div>
          </div>

          {profile && <ProfileForm profile={profile} />}
        </div>

        <div className="grid grid-cols-3 gap-3">
          <StatCard className="text-center">
            <div className="text-lg font-bold">{allGames.length}</div>
            <div className="text-xs text-text-muted">Jogos</div>
          </StatCard>
          <StatCard className="text-center">
            <div className="text-lg font-bold">{completed}</div>
            <div className="text-xs text-text-muted">Zerados</div>
          </StatCard>
          <StatCard className="text-center">
            <div className="text-lg font-bold">{pct}%</div>
            <div className="text-xs text-text-muted">Progresso</div>
          </StatCard>
        </div>

        <button
          className="w-full mt-4 py-2 text-xs uppercase tracking-wider cursor-pointer transition-all flex items-center justify-center gap-2 md:hidden"
          style={{
            background: 'none',
            border: `1px solid ${crtEnabled ? 'var(--neon-green)' : 'var(--border-color)'}`,
            color: crtEnabled ? 'var(--neon-green)' : 'var(--text-muted)',
          }}
          onClick={toggleCrt}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
            <rect x="2" y="3" width="20" height="14" rx="1" />
            <path d="M8 21h8M12 17v4" />
            <path d="M5 7h14" strokeDasharray="2 2" opacity="0.5" />
            <path d="M5 10h14" strokeDasharray="2 2" opacity="0.5" />
            <path d="M5 13h14" strokeDasharray="2 2" opacity="0.5" />
          </svg>
          <span>CRT: {crtEnabled ? 'LIGADO' : 'DESLIGADO'}</span>
        </button>

        <Button variant="danger" className="w-full mt-2" onClick={handleLogout}>
          Sair
        </Button>
      </div>
    </section>
  )
}
