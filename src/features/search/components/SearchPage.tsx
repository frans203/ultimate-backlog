import { useState, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { rawgQueries } from '../api/rawg-queries'
import { useAddGame } from '@/features/backlog/api/game-mutations'
import { gameQueries } from '@/features/backlog/api/game-queries'
import { useAuth } from '@/features/auth/hooks/use-auth'
import { PageHeader } from '@/shared/components/layout/PageHeader'
import { Loading, EmptyState } from '@/shared/components/ui'
import { SearchResult } from './SearchResult'
import { SearchDetailModal } from './SearchDetailModal'
import { useBootUp } from '@/shared/hooks/use-boot-up'
import type { RawgGame } from '@/shared/types/database.types'

export function SearchPage() {
  const { user } = useAuth()
  const [query, setQuery] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGame, setSelectedGame] = useState<RawgGame | null>(null)
  const bootRef = useBootUp()
  const addGame = useAddGame()

  const { data: searchData, isLoading } = useQuery(rawgQueries.search(searchTerm))
  const { data: userGames } = useQuery(gameQueries.all(user!.id))

  const handleSearch = useCallback(() => {
    if (query.trim()) setSearchTerm(query.trim())
  }, [query])

  const isAdded = (gameId: number) =>
    (userGames || []).some((g) => g.rawg_id === gameId)

  return (
    <section className="page-section" ref={bootRef}>
      <PageHeader title="BUSCAR JOGOS" />

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          className="search-input flex-1"
          placeholder="> digite o nome do jogo..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          autoFocus
        />
        <button
          className="px-4 border font-mono text-xs uppercase tracking-wider cursor-pointer transition-all hover:bg-white/5"
          style={{ background: 'none', borderColor: 'var(--neon-red)', color: 'var(--neon-red)' }}
          onClick={handleSearch}
        >
          Buscar
        </button>
      </div>

      <div>
        {isLoading ? (
          <Loading />
        ) : searchData && searchData.results.length > 0 ? (
          <>
            <div className="text-xs uppercase tracking-wider mb-4 text-text-muted">
              {searchData.results.length} resultados para "{searchTerm}"
            </div>
            <div className="space-y-2">
              {searchData.results.map((game) => (
                <SearchResult
                  key={game.id}
                  game={game}
                  alreadyAdded={isAdded(game.id)}
                  onAdd={() => addGame.mutate({ rawg: game })}
                  onClick={() => setSelectedGame(game)}
                />
              ))}
            </div>
          </>
        ) : searchTerm ? (
          <EmptyState message="> NENHUM RESULTADO ENCONTRADO" />
        ) : (
          <EmptyState message="> BUSQUE UM JOGO PARA COMEÇAR" />
        )}
      </div>

      <SearchDetailModal
        game={selectedGame}
        isOpen={!!selectedGame}
        onClose={() => setSelectedGame(null)}
        onAdd={(description) => {
          if (selectedGame) {
            addGame.mutate({ rawg: selectedGame, description })
          }
        }}
        alreadyAdded={selectedGame ? isAdded(selectedGame.id) : false}
      />
    </section>
  )
}
