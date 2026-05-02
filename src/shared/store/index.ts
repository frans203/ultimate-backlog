import { create } from 'zustand'
import { createUiSlice, type UiSlice } from './ui-slice'

export type StoreState = UiSlice

export const useStore = create<StoreState>()((...a) => ({
  ...createUiSlice(...a),
}))
