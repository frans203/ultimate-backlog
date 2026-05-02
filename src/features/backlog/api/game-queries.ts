import { queryOptions } from '@tanstack/react-query'
import { supabase } from '@/shared/lib/supabase'
import type { BacklogStatus, Game } from '@/shared/types/database.types'

function mapRow(row: Record<string, unknown>): Game {
  return {
    id: row.id as string,
    user_id: row.user_id as string,
    rawg_id: row.rawg_id as number,
    name: (row.title as string) || '',
    cover: (row.cover_url as string) || '',
    released: (row.release_date as string) || null,
    genres: (row.genres as string[]) || [],
    platforms: (row.platforms as string[]) || [],
    description: '',
    user_rating: (row.user_rating as number) || 0,
    status: row.status as BacklogStatus,
    notes: (row.notes as string) || '',
    estimated_hours: (row.estimated_hours as number) || 0,
    added_at: (row.created_at as string) || '',
    updated_at: (row.updated_at as string) || '',
  }
}

export const gameQueries = {
  all: (userId: string) =>
    queryOptions({
      queryKey: ['games', userId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('games')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
        if (error) throw error
        return (data || []).map(mapRow)
      },
      enabled: !!userId,
    }),
  byStatus: (userId: string, status: BacklogStatus) =>
    queryOptions({
      queryKey: ['games', userId, status],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('games')
          .select('*')
          .eq('user_id', userId)
          .eq('status', status)
          .order('created_at', { ascending: false })
        if (error) throw error
        return (data || []).map(mapRow)
      },
      enabled: !!userId,
    }),
}
