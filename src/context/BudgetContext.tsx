import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { loadState, saveState, resetState as resetStorage } from '../lib/storage'
import type {
  AppState,
  BudgetCategory,
  Debt,
  FixedExpense,
  Goals,
  IncomeSource,
  SinkingFund,
  Transaction,
} from '../types'

type BudgetContextValue = {
  state: AppState
  updateIncome: (income: IncomeSource[]) => void
  updateFixedExpenses: (expenses: FixedExpense[]) => void
  updateBudgetCategory: (id: BudgetCategory, planned: number) => void
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void
  deleteTransaction: (id: string) => void
  updateSinkingFund: (id: string, updates: Partial<SinkingFund>) => void
  updateDebt: (id: string, updates: Partial<Debt>) => void
  updateGoals: (goals: Goals) => void
  setYearToDateSaved: (amount: number) => void
  resetAll: () => void
}

const BudgetContext = createContext<BudgetContextValue | null>(null)

function uid(): string {
  return crypto.randomUUID()
}

export function BudgetProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => loadState())

  useEffect(() => {
    saveState(state)
  }, [state])

  const update = useCallback((fn: (prev: AppState) => AppState) => {
    setState(fn)
  }, [])

  const value = useMemo<BudgetContextValue>(
    () => ({
      state,
      updateIncome: (income) => update((s) => ({ ...s, income })),
      updateFixedExpenses: (fixedExpenses) => update((s) => ({ ...s, fixedExpenses })),
      updateBudgetCategory: (id, planned) =>
        update((s) => ({
          ...s,
          budgetCategories: s.budgetCategories.map((c) =>
            c.id === id ? { ...c, planned } : c,
          ),
        })),
      addTransaction: (transaction) =>
        update((s) => ({
          ...s,
          transactions: [{ ...transaction, id: uid() }, ...s.transactions],
        })),
      deleteTransaction: (id) =>
        update((s) => ({
          ...s,
          transactions: s.transactions.filter((t) => t.id !== id),
        })),
      updateSinkingFund: (id, updates) =>
        update((s) => ({
          ...s,
          sinkingFunds: s.sinkingFunds.map((f) => (f.id === id ? { ...f, ...updates } : f)),
        })),
      updateDebt: (id, updates) =>
        update((s) => ({
          ...s,
          debts: s.debts.map((d) => (d.id === id ? { ...d, ...updates } : d)),
        })),
      updateGoals: (goals) => update((s) => ({ ...s, goals })),
      setYearToDateSaved: (yearToDateSaved) => update((s) => ({ ...s, yearToDateSaved })),
      resetAll: () => setState(resetStorage()),
    }),
    [state, update],
  )

  return <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>
}

export function useBudget(): BudgetContextValue {
  const ctx = useContext(BudgetContext)
  if (!ctx) throw new Error('useBudget must be used within BudgetProvider')
  return ctx
}
