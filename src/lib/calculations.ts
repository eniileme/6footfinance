import type { AppState, BudgetCategory } from '../types'
import { VARIABLE_CATEGORIES } from '../types'
import { isCurrentMonth, monthsRemainingInYear } from './format'

/** Coerce to a finite non-negative number; missing/invalid/negative → 0. */
function nonNegativeAmount(value: unknown): number {
  const n = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(n) || n < 0) return 0
  return n
}

export function sumIncome(state: AppState): number {
  return state.income.reduce((sum, i) => sum + i.amount, 0)
}

/** Genuine non-debt fixed expenses from the Monthly Budget owner. */
export function sumFixedExpenses(state: AppState): number {
  return state.fixedExpenses.reduce((sum, e) => sum + e.amount, 0)
}

/** Required contractual payments from Debts (canonical owner). */
export function sumRequiredDebtPayments(state: AppState): number {
  return state.debts.reduce((sum, d) => sum + nonNegativeAmount(d.monthlyPayment), 0)
}

/** Planned monthly contributions from Sinking Funds (canonical owner). */
export function sumSinkingFundContributions(state: AppState): number {
  return state.sinkingFunds.reduce(
    (sum, f) => sum + nonNegativeAmount(f.monthlyContribution),
    0,
  )
}

/** Fixed monthly commitments = genuine fixed + required debt + sinking contributions. */
export function sumFixedCommitments(state: AppState): number {
  return (
    sumFixedExpenses(state) +
    sumRequiredDebtPayments(state) +
    sumSinkingFundContributions(state)
  )
}

export function getCategoryPlanned(state: AppState, category: BudgetCategory): number {
  return state.budgetCategories.find((c) => c.id === category)?.planned ?? 0
}

export function sumVariablePlanned(state: AppState): number {
  return state.budgetCategories
    .filter((c) => VARIABLE_CATEGORIES.includes(c.id))
    .reduce((sum, c) => sum + c.planned, 0)
}

export function plannedSavings(state: AppState): number {
  return getCategoryPlanned(state, 'savings-investments')
}

/**
 * Residual of the total monthly savings target after planned sinking contributions.
 * `plannedSavings` is the total target; sinking contributions are included inside it.
 * Available for investments = max(target − sinking contributions, 0).
 */
export function plannedInvestmentAllocation(state: AppState): number {
  return Math.max(plannedSavings(state) - sumSinkingFundContributions(state), 0)
}

/** How much planned sinking contributions exceed the total monthly savings target. */
export function savingsTargetShortfall(state: AppState): number {
  return Math.max(sumSinkingFundContributions(state) - plannedSavings(state), 0)
}

/**
 * Actual savings-related allocation in the plan:
 * sinking contributions + residual investment allocation.
 * Equals the savings target when sinking ≤ target; equals sinking when sinking > target.
 */
export function totalPlannedSavingsAllocation(state: AppState): number {
  return sumSinkingFundContributions(state) + plannedInvestmentAllocation(state)
}

export function plannedDebtOverpayments(state: AppState): number {
  return getCategoryPlanned(state, 'debt-overpayments')
}

/**
 * Canonical total planned monthly outflows:
 * fixed expenses + required debt + sinking contributions
 * + variable + residual investment allocation + debt overpayments.
 *
 * Sinking contributions are part of the savings target (`plannedSavings`), so only
 * `plannedInvestmentAllocation` is added on top of sinking — not the full target again.
 */
export function totalPlannedOutflows(state: AppState): number {
  return (
    sumFixedCommitments(state) +
    sumVariablePlanned(state) +
    plannedInvestmentAllocation(state) +
    plannedDebtOverpayments(state)
  )
}

/** Canonical remaining budget = income − total planned outflows. */
export function remainingBudget(state: AppState): number {
  return sumIncome(state) - totalPlannedOutflows(state)
}

/**
 * @deprecated Legacy — omits required debt payments and sinking contributions.
 * UI still imports this; replace with `totalPlannedOutflows` in a later step.
 */
export function totalPlannedOutflow(state: AppState): number {
  return (
    sumFixedExpenses(state) +
    sumVariablePlanned(state) +
    plannedSavings(state) +
    plannedDebtOverpayments(state)
  )
}

/**
 * @deprecated Legacy — omits required debt payments and sinking contributions.
 * UI still imports this; replace with `remainingBudget` in a later step.
 */
export function remainingVariableBudget(state: AppState): number {
  return (
    sumIncome(state) -
    sumFixedExpenses(state) -
    plannedSavings(state) -
    plannedDebtOverpayments(state) -
    sumVariablePlanned(state)
  )
}

export function currentMonthTransactions(state: AppState) {
  return state.transactions.filter((t) => isCurrentMonth(t.date))
}

export function actualSpendingThisMonth(state: AppState): number {
  return currentMonthTransactions(state).reduce((sum, t) => sum + t.amount, 0)
}

export function actualVariableSpendingThisMonth(state: AppState): number {
  return currentMonthTransactions(state)
    .filter((t) => VARIABLE_CATEGORIES.includes(t.category))
    .reduce((sum, t) => sum + t.amount, 0)
}

export function spendingByCategory(state: AppState): Record<BudgetCategory, number> {
  const totals = {} as Record<BudgetCategory, number>
  for (const t of currentMonthTransactions(state)) {
    totals[t.category] = (totals[t.category] ?? 0) + t.amount
  }
  return totals
}

export function savingsRate(state: AppState): number {
  const income = sumIncome(state)
  if (income === 0) return 0
  return (plannedSavings(state) / income) * 100
}

export function savingTargetProgress(state: AppState): {
  planned: number
  minimum: number
  stretch: number
  percentOfMinimum: number
  percentOfStretch: number
  metMinimum: boolean
  metStretch: boolean
} {
  const planned = plannedSavings(state)
  const minimum = state.goals.minimumMonthlySaving
  const stretch = state.goals.stretchMonthlySaving
  return {
    planned,
    minimum,
    stretch,
    percentOfMinimum: minimum > 0 ? (planned / minimum) * 100 : 0,
    percentOfStretch: stretch > 0 ? (planned / stretch) * 100 : 0,
    metMinimum: planned >= minimum,
    metStretch: planned >= stretch,
  }
}

export function variableSpendingWarning(state: AppState): {
  isOverBudget: boolean
  planned: number
  actual: number
  remaining: number
  message: string | null
} {
  const planned = sumVariablePlanned(state)
  const actual = actualVariableSpendingThisMonth(state)
  const remaining = planned - actual
  const isOverBudget = actual > planned

  let message: string | null = null
  if (isOverBudget) {
    message = `Variable spending is ${formatOverage(actual - planned)} over budget this month.`
  } else if (planned > 0 && actual / planned > 0.85) {
    message = `You've used ${((actual / planned) * 100).toFixed(0)}% of your variable budget.`
  }

  return { isOverBudget, planned, actual, remaining, message }
}

function formatOverage(amount: number): string {
  return new Intl.NumberFormat('fi-FI', { style: 'currency', currency: 'EUR' }).format(amount)
}

export function projectedYearEndSavings(state: AppState): number {
  const monthlySavings = plannedSavings(state)
  const monthsLeft = monthsRemainingInYear()
  return state.yearToDateSaved + monthlySavings * monthsLeft
}

export function estimateDebtRemainingPayments(debt: AppState['debts'][0]): {
  monthsRemaining: number
  totalRemaining: number
} {
  const { balance, monthlyPayment, interestRate, finalBalloon = 0 } = debt
  if (monthlyPayment <= 0) {
    return { monthsRemaining: 0, totalRemaining: balance + finalBalloon }
  }

  let remaining = balance
  let months = 0
  let totalPaid = 0
  const monthlyRate = interestRate / 100 / 12

  while (remaining > 0.01 && months < 600) {
    const interest = remaining * monthlyRate
    const principal = monthlyPayment - interest
    if (principal <= 0) {
      return { monthsRemaining: Infinity, totalRemaining: Infinity }
    }
    remaining -= principal
    totalPaid += monthlyPayment
    months++
  }

  totalPaid += finalBalloon
  return { monthsRemaining: months, totalRemaining: totalPaid + finalBalloon }
}

export function totalSinkingFundBalance(state: AppState): number {
  return state.sinkingFunds.reduce((sum, f) => sum + f.balance, 0)
}

export function emergencyFundProgress(state: AppState): number {
  const target = state.goals.emergencyBufferTarget
  if (target <= 0) return 0
  const emergencyFund = state.sinkingFunds.find((f) => f.id === 'insurance')?.balance ?? 0
  return Math.min(100, (emergencyFund / target) * 100)
}
