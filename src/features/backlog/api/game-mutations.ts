import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/shared/lib/supabase'
import { useAuth } from '@/features/auth/hooks/use-auth'
import { showSnackbar } from '@/shared/components/ui'
import { playClick, playStatusChange, playCompleted } from '@/shared/lib/sounds'
import type { BacklogStatus, RawgGame, RawgGameDetail } from '@/shared/types/database.types'
import { STATUS_FLASH_COLORS } from '@/shared/constants'

export function useAddGame() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async (game: { rawg: RawgGame; description?: string }) => {
      if (!user) throw new Error('Not authenticated')
      const { data, error } = await supabase
        .from('games')
        .insert({
          user_id: user.id,
          rawg_id: game.rawg.id,
          title: game.rawg.name,
          cover_url: game.rawg.background_image || '',
          release_date: game.rawg.released || null,
          genres: (game.rawg.genres || []).map((g) => g.name),
          platforms: (game.rawg.platforms || []).map((p) => p.platform.name),
          rawg_rating: game.rawg.rating || null,
          user_rating: 0,
          status: 'backlog' as BacklogStatus,
          notes: '',
          estimated_hours: game.rawg.playtime || 0,
        })
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['games'] })
      playClick()
      showSnackbar(`"${data.title}" adicionado ao backlog`, () => {
        supabase.from('games').delete().eq('id', data.id).then(() => {
          queryClient.invalidateQueries({ queryKey: ['games'] })
        })
      })
    },
  })
}

export function useUpdateStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, status, oldStatus }: { id: string; status: BacklogStatus; oldStatus: BacklogStatus }) => {
      const { error } = await supabase
        .from('games')
        .update({ status })
        .eq('id', id)
      if (error) throw error
      return { id, status, oldStatus }
    },
    onSuccess: ({ id, status, oldStatus }) => {
      queryClient.invalidateQueries({ queryKey: ['games'] })
      if (status === 'completed' && oldStatus !== 'completed') {
        playCompleted()
      } else {
        playStatusChange()
      }
      // Apply flash effect
      setTimeout(() => {
        const card = document.querySelector(`.game-card[data-id="${id}"]`)
        if (card) {
          const el = card as HTMLElement
          el.style.setProperty('--flash-color', STATUS_FLASH_COLORS[status])
          el.classList.add('status-flash')
          el.addEventListener('animationend', () => el.classList.remove('status-flash'), { once: true })
        }
      }, 100)
    },
  })
}

export function useUpdateRating() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, rating }: { id: string; rating: number }) => {
      const { error } = await supabase
        .from('games')
        .update({ user_rating: rating })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] })
      playClick()
    },
  })
}

export function useUpdateNotes() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes: string }) => {
      const { error } = await supabase
        .from('games')
        .update({ notes })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] })
    },
  })
}

export function useUpdateHours() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, hours }: { id: string; hours: number }) => {
      const { error } = await supabase
        .from('games')
        .update({ estimated_hours: hours })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] })
    },
  })
}

export function useRemoveGame() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const { error } = await supabase.from('games').delete().eq('id', id)
      if (error) throw error
      return { id, name }
    },
    onSuccess: ({ name }) => {
      queryClient.invalidateQueries({ queryKey: ['games'] })
      playClick()
      showSnackbar(`"${name}" removido`)
    },
  })
}
