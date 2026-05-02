import type { StateCreator } from 'zustand'
import type { BacklogStatus } from '@/shared/types/database.types'

export interface UiSlice {
  crtEnabled: boolean
  activeTab: 'all' | BacklogStatus
  sortBy: 'added_at' | 'name' | 'rating' | 'hours'
  filterPlatform: string
  filterGenre: string
  setCrtEnabled: (v: boolean) => void
  setActiveTab: (v: 'all' | BacklogStatus) => void
  setSortBy: (v: UiSlice['sortBy']) => void
  setFilterPlatform: (v: string) => void
  setFilterGenre: (v: string) => void
}

export const createUiSlice: StateCreator<UiSlice> = (set) => ({
  crtEnabled: localStorage.getItem('ub_crt') !== 'off',
  activeTab: 'all',
  sortBy: 'added_at',
  filterPlatform: '',
  filterGenre: '',
  setCrtEnabled: (v) => {
    localStorage.setItem('ub_crt', v ? 'on' : 'off')
    document.body.classList.toggle('crt-off', !v)
    set({ crtEnabled: v })
  },
  setActiveTab: (v) => set({ activeTab: v }),
  setSortBy: (v) => set({ sortBy: v }),
  setFilterPlatform: (v) => set({ filterPlatform: v }),
  setFilterGenre: (v) => set({ filterGenre: v }),
})
