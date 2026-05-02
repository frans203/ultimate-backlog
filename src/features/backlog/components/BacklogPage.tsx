import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/features/auth/hooks/use-auth'
import { gameQueries } from '../api/game-queries'
import { useStore } from '@/shared/store'
import { PageHeader } from '@/shared/components/layout/PageHeader'
import { Loading, EmptyState } from '@/shared/components/ui'
import { GameFilters } from './GameFilters'
import { GameGrid } from './GameGrid'
import { GameDetailModal } from './GameDetailModal'
import { useBootUp } from '@/shared/hooks/use-boot-up'
import type { Game } from '@/shared/types/database.types'

export function BacklogPage() {
  const { user } = useAuth()
  const { data: games, isLoading } = useQuery(gameQueries.all(user!.id))
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const bootRef = useBootUp()

  const activeTab = useStore((s) => s.activeTab)
  const sortBy = useStore((s) => s.sortBy)
  const filterPlatform = useStore((s) => s.filterPlatform)
  const filterGenre = useStore((s) => s.filterGenre)

  const filtered = useMemo(() => {
    if (!games) return []
    let result = activeTab === 'all' ? [...games] : games.filter((g) => g.status === activeTab)

    if (filterPlatform) {
      result = result.filter((g) => (g.platforms || []).includes(filterPlatform))
    }
    if (filterGenre) {
      result = result.filter((g) => (g.genres || []).includes(filterGenre))
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name)
        case 'rating': return (b.user_rating || 0) - (a.user_rating || 0)
        case 'hours': return (b.estimated_hours || 0) - (a.estimated_hours || 0)
        default: return new Date(b.added_at).getTime() - new Date(a.added_at).getTime()
      }
    })

    return result
  }, [games, activeTab, sortBy, filterPlatform, filterGenre])

  if (isLoading) return <Loading />

  return (
    <section className="page-section" ref={bootRef}>
      <PageHeader title="BACKLOG" subtitle={`${games?.length || 0} JOGOS`} />
      <GameFilters games={games || []} />
      {filtered.length > 0 ? (
        <GameGrid games={filtered} onGameClick={setSelectedGame} />
      ) : (
        <EmptyState message="> NENHUM JOGO ENCONTRADO" />
      )}
      <GameDetailModal
        game={selectedGame}
        isOpen={!!selectedGame}
        onClose={() => setSelectedGame(null)}
      />
    </section>
  )
}
