import { Tabs, Select } from '@/shared/components/ui'
import { useStore } from '@/shared/store'
import type { Game } from '@/shared/types/database.types'

interface GameFiltersProps {
  games: Game[]
}

export function GameFilters({ games }: GameFiltersProps) {
  const activeTab = useStore((s) => s.activeTab)
  const setActiveTab = useStore((s) => s.setActiveTab)
  const sortBy = useStore((s) => s.sortBy)
  const setSortBy = useStore((s) => s.setSortBy)
  const filterPlatform = useStore((s) => s.filterPlatform)
  const setFilterPlatform = useStore((s) => s.setFilterPlatform)
  const filterGenre = useStore((s) => s.filterGenre)
  const setFilterGenre = useStore((s) => s.setFilterGenre)

  const tabs = [
    { key: 'all', label: 'Todos', count: games.length },
    { key: 'playing', label: 'Jogando', count: games.filter((g) => g.status === 'playing').length },
    { key: 'backlog', label: 'Backlog', count: games.filter((g) => g.status === 'backlog').length },
    { key: 'completed', label: 'Completos', count: games.filter((g) => g.status === 'completed').length },
    { key: 'dropped', label: 'Dropados', count: games.filter((g) => g.status === 'dropped').length },
    { key: 'on_hold', label: 'Em Espera', count: games.filter((g) => g.status === 'on_hold').length },
  ]

  const allPlatforms = [...new Set(games.flatMap((g) => g.platforms || []))].sort()
  const allGenres = [...new Set(games.flatMap((g) => g.genres || []))].sort()

  return (
    <>
      <div className="mb-4">
        <Tabs value={activeTab} onChange={(v) => setActiveTab(v as any)} items={tabs} />
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        <select
          className="cyber-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
        >
          <option value="added_at">Recentes</option>
          <option value="name">Nome</option>
          <option value="rating">Avaliação</option>
          <option value="hours">Horas</option>
        </select>
        <select
          className="cyber-select"
          value={filterPlatform}
          onChange={(e) => setFilterPlatform(e.target.value)}
        >
          <option value="">Plataforma</option>
          {allPlatforms.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <select
          className="cyber-select"
          value={filterGenre}
          onChange={(e) => setFilterGenre(e.target.value)}
        >
          <option value="">Gênero</option>
          {allGenres.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>
    </>
  )
}
