import { Tabs, Dropdown } from '@/shared/components/ui'
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

  const sortOptions = [
    { value: 'added_at', label: 'Recentes' },
    { value: 'name', label: 'Nome' },
    { value: 'rating', label: 'Avaliação' },
    { value: 'hours', label: 'Horas' },
  ]

  const platformOptions = [
    { value: '', label: 'Plataforma' },
    ...allPlatforms.map((p) => ({ value: p, label: p })),
  ]

  const genreOptions = [
    { value: '', label: 'Gênero' },
    ...allGenres.map((g) => ({ value: g, label: g })),
  ]

  return (
    <>
      <div className="mb-4">
        <Tabs value={activeTab} onChange={(v) => setActiveTab(v as any)} items={tabs} />
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        <Dropdown
          value={sortBy}
          onChange={(v) => setSortBy(v as any)}
          options={sortOptions}
        />
        <Dropdown
          value={filterPlatform}
          onChange={setFilterPlatform}
          options={platformOptions}
        />
        <Dropdown
          value={filterGenre}
          onChange={setFilterGenre}
          options={genreOptions}
        />
      </div>
    </>
  )
}
