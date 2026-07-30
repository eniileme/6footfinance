import { defaultState, STORAGE_KEY } from '../data/defaults'
import type { AppState } from '../types'

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState
    const parsed = JSON.parse(raw) as AppState
    return { ...defaultState, ...parsed }
  } catch {
    return defaultState
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function resetState(): AppState {
  localStorage.removeItem(STORAGE_KEY)
  return defaultState
}
