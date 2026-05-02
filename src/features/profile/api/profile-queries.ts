import { queryOptions } from '@tanstack/react-query'
import { supabase } from '@/shared/lib/supabase'

export const profileQueries = {
  me: (userId: string) =>
    queryOptions({
      queryKey: ['profile', userId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single()
        if (error) throw error
        return data
      },
      enabled: !!userId,
    }),
}
