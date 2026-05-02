const RAWG_KEY = import.meta.env.VITE_RAWG_API_KEY
const RAWG_BASE = 'https://api.rawg.io/api'

import type { RawgSearchResponse, RawgGameDetail } from '@/shared/types/database.types'

export async function searchGames(query: string): Promise<RawgSearchResponse> {
  const res = await fetch(
    `${RAWG_BASE}/games?key=${RAWG_KEY}&search=${encodeURIComponent(query)}&page_size=12`
  )
  if (!res.ok) throw new Error('RAWG search failed')
  return res.json()
}

export async function fetchGameDetails(gameId: number): Promise<RawgGameDetail> {
  const res = await fetch(`${RAWG_BASE}/games/${gameId}?key=${RAWG_KEY}`)
  if (!res.ok) throw new Error('RAWG detail failed')
  return res.json()
}
