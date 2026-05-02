import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/features/auth/hooks/use-auth'
import { gameQueries } from '@/features/backlog/api/game-queries'
import { PageHeader } from '@/shared/components/layout/PageHeader'
import { GlitchLogo, Loading, EmptyState } from '@/shared/components/ui'
import { GameStats } from './GameStats'
import { PlatformChart } from './PlatformChart'
import { GameGrid } from '@/features/backlog/components/GameGrid'
import { useBootUp } from '@/shared/hooks/use-boot-up'
import { useState } from 'react'
import { GameDetailModal } from '@/features/backlog/components/GameDetailModal'
import type { Game } from '@/shared/types/database.types'

export function DashboardPage() {
  const { user } = useAuth()
  const { data: games, isLoading } = useQuery(gameQueries.all(user!.id))
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const bootRef = useBootUp()

  if (isLoading) return <Loading />

  const allGames = games || []
  const recentGames = allGames.slice(0, 6)

  return (
    <section className="page-section" ref={bootRef}>
      <PageHeader
        title={
          <GlitchLogo
            text="Ultimate Backlog"
            className="text-lg md:text-xl tracking-widest text-neon-red"
          />
        }
        subtitle="DASHBOARD"
      />

      <GameStats games={allGames} />
      <PlatformChart games={allGames} />

      <div>
        <h2 className="text-xs uppercase tracking-widest mb-4 text-text-muted">
          Jogos Recentes
        </h2>
        {recentGames.length > 0 ? (
          <GameGrid
            games={recentGames}
            onGameClick={setSelectedGame}
            columns="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3"
          />
        ) : (
          <EmptyState message="> SEM JOGOS ADICIONADOS" />
        )}
      </div>

      <GameDetailModal
        game={selectedGame}
        isOpen={!!selectedGame}
        onClose={() => setSelectedGame(null)}
      />
    </section>
  )
}
