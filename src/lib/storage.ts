import { defaultState, STORAGE_KEY as STORAGE_KEY_V1 } from '../data/defaults'
import type { AppState } from '../types'

const STORAGE_KEY_V2 = '6footfinance-state-v2'

/** Exact IDs removed once when migrating v1 → v2. Do not expand without a new migration. */
const LEGACY_FIXED_EXPENSE_IDS = new Set(['house-loan', 'car-loan', 'insurance-sinking'])

function mergeWithDefaults(parsed: AppState): AppState {
  return { ...defaultState, ...parsed }
}

/** Idempotent: filtering an already-clean fixedExpenses array is a no-op. */
function migrateV1ToV2(state: AppState): AppState {
  return {
    ...state,
    fixedExpenses: state.fixedExpenses.filter((item) => !LEGACY_FIXED_EXPENSE_IDS.has(item.id)),
  }
}

function readJson(key: string): AppState | null {
  const raw = localStorage.getItem(key)
  if (!raw) return null
  return mergeWithDefaults(JSON.parse(raw) as AppState)
}

export function loadState(): AppState {
  try {
    const v2 = readJson(STORAGE_KEY_V2)
    if (v2) return v2

    const v1 = readJson(STORAGE_KEY_V1)
    if (!v1) return defaultState

    const migrated = migrateV1ToV2(v1)
    localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(migrated))
    // Intentionally leave v1 in place as a backup.
    return migrated
  } catch {
    return defaultState
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(state))
}

export function resetState(): AppState {
  localStorage.removeItem(STORAGE_KEY_V2)
  return defaultState
}
