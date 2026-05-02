import { queryOptions } from '@tanstack/react-query'
import { supabase } from '@/shared/lib/supabase'
import type { BacklogStatus } from '@/shared/types/database.types'

export const gameQueries = {
  all: (userId: string) =>
    queryOptions({
      queryKey: ['games', userId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('games')
          .select('*')
          .eq('user_id', userId)
          .order('added_at', { ascending: false })
        if (error) throw error
        return data
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
          .order('added_at', { ascending: false })
        if (error) throw error
        return data
      },
      enabled: !!userId,
    }),
}
