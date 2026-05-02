import { queryOptions } from '@tanstack/react-query'
import { searchGames, fetchGameDetails } from '@/shared/lib/rawg'

export const rawgQueries = {
  search: (query: string) =>
    queryOptions({
      queryKey: ['rawg', 'search', query],
      queryFn: () => searchGames(query),
      enabled: query.length > 0,
      staleTime: 1000 * 60 * 5,
    }),
  details: (gameId: number) =>
    queryOptions({
      queryKey: ['rawg', 'details', gameId],
      queryFn: () => fetchGameDetails(gameId),
      staleTime: 1000 * 60 * 10,
    }),
}
