export type BudgetCategory =
  | 'groceries'
  | 'gas-charging-parking'
  | 'child-extras'
  | 'restaurants-cafes'
  | 'subscriptions'
  | 'clothes-beauty'
  | 'health'
  | 'home'
  | 'travel'
  | 'gifts'
  | 'random-bullshit'
  | 'savings-investments'
  | 'debt-overpayments'

export type IncomeSource = {
  id: string
  name: string
  amount: number
}

export type FixedExpense = {
  id: string
  name: string
  amount: number
}

export type BudgetCategoryConfig = {
  id: BudgetCategory
  name: string
  planned: number
}

export type Transaction = {
  id: string
  date: string
  amount: number
  category: BudgetCategory
  note: string
}

export type SinkingFund = {
  id: string
  name: string
  target: number
  balance: number
  monthlyContribution: number
}

export type Debt = {
  id: string
  name: string
  balance: number
  monthlyPayment: number
  interestRate: number
  finalBalloon?: number
  notes?: string
}

export type Goals = {
  minimumMonthlySaving: number
  stretchMonthlySaving: number
  emergencyBufferTarget: number
  indexFundTarget: number
}

export type AppState = {
  income: IncomeSource[]
  fixedExpenses: FixedExpense[]
  budgetCategories: BudgetCategoryConfig[]
  transactions: Transaction[]
  sinkingFunds: SinkingFund[]
  debts: Debt[]
  goals: Goals
  yearToDateSaved: number
}

export const VARIABLE_CATEGORIES: BudgetCategory[] = [
  'groceries',
  'gas-charging-parking',
  'child-extras',
  'restaurants-cafes',
  'subscriptions',
  'clothes-beauty',
  'health',
  'home',
  'travel',
  'gifts',
  'random-bullshit',
]
