import { useBudget } from '../context/BudgetContext'
import {
  plannedDebtOverpayments,
  plannedSavings,
  remainingVariableBudget,
  sumFixedExpenses,
  sumIncome,
  sumVariablePlanned,
} from '../lib/calculations'
import { formatCurrency } from '../lib/format'
import { VARIABLE_CATEGORIES } from '../types'
import { Alert, Card, CardTitle, CurrencyInput, PageHeader } from '../components/ui'

export function MonthlyBudget() {
  const { state, updateBudgetCategory, updateIncome, updateFixedExpenses } = useBudget()

  const income = sumIncome(state)
  const fixed = sumFixedExpenses(state)
  const variable = sumVariablePlanned(state)
  const savings = plannedSavings(state)
  const debtExtra = plannedDebtOverpayments(state)
  const balance = remainingVariableBudget(state)

  const variableCategories = state.budgetCategories.filter((c) =>
    VARIABLE_CATEGORIES.includes(c.id),
  )
  const allocationCategories = state.budgetCategories.filter(
    (c) => c.id === 'savings-investments' || c.id === 'debt-overpayments',
  )

  return (
    <div>
      <PageHeader
        title="Monthly budget"
        subtitle="Edit planned amounts. Income and fixed costs are editable here too."
      />

      {balance !== 0 && (
        <Alert variant={balance < 0 ? 'danger' : 'warn'} className="mb-6">
          {balance < 0
            ? `Budget is over-allocated by ${formatCurrency(Math.abs(balance))}.`
            : `${formatCurrency(balance)} unallocated — consider adding to savings or sinking funds.`}
        </Alert>
      )}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <SummaryPill label="Income" value={income} />
        <SummaryPill label="Fixed" value={fixed} />
        <SummaryPill label="Variable" value={variable} />
        <SummaryPill label="Savings" value={savings} accent />
        <SummaryPill label="Balance" value={balance} warn={balance < 0} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardTitle>Income</CardTitle>
          <div className="space-y-3">
            {state.income.map((item, i) => (
              <div key={item.id} className="flex items-end gap-3">
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => {
                    const income = [...state.income]
                    income[i] = { ...item, name: e.target.value }
                    updateIncome(income)
                  }}
                  className="flex-1 rounded-lg border border-border bg-card px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
                <CurrencyInput
                  value={item.amount}
                  onChange={(amount) => {
                    const income = [...state.income]
                    income[i] = { ...item, amount }
                    updateIncome(income)
                  }}
                  className="w-32"
                />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardTitle>Fixed expenses</CardTitle>
          <div className="space-y-3">
            {state.fixedExpenses.map((item, i) => (
              <div key={item.id} className="flex items-end gap-3">
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => {
                    const fixedExpenses = [...state.fixedExpenses]
                    fixedExpenses[i] = { ...item, name: e.target.value }
                    updateFixedExpenses(fixedExpenses)
                  }}
                  className="flex-1 rounded-lg border border-border bg-card px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
                <CurrencyInput
                  value={item.amount}
                  onChange={(amount) => {
                    const fixedExpenses = [...state.fixedExpenses]
                    fixedExpenses[i] = { ...item, amount }
                    updateFixedExpenses(fixedExpenses)
                  }}
                  className="w-32"
                />
              </div>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <CardTitle>Variable spending categories</CardTitle>
          <div className="grid gap-3 sm:grid-cols-2">
            {variableCategories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2"
              >
                <span className="text-sm text-ink-soft">{cat.name}</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={cat.planned || ''}
                  onChange={(e) => updateBudgetCategory(cat.id, parseFloat(e.target.value) || 0)}
                  className="w-24 rounded-md border border-border bg-card px-2 py-1 text-right text-sm tabular-nums text-ink outline-none focus:border-accent"
                />
              </div>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <CardTitle>Savings & debt overpayments</CardTitle>
          <div className="grid gap-3 sm:grid-cols-2">
            {allocationCategories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2"
              >
                <span className="text-sm font-medium text-ink-soft">{cat.name}</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={cat.planned || ''}
                  onChange={(e) => updateBudgetCategory(cat.id, parseFloat(e.target.value) || 0)}
                  className="w-24 rounded-md border border-border bg-card px-2 py-1 text-right text-sm tabular-nums text-ink outline-none focus:border-accent"
                />
              </div>
            ))}
          </div>
          {debtExtra > 0 && (
            <p className="mt-3 text-xs text-muted">
              Debt overpayments of {formatCurrency(debtExtra)}/mo will accelerate payoff.
            </p>
          )}
        </Card>
      </div>
    </div>
  )
}

function SummaryPill({
  label,
  value,
  accent,
  warn,
}: {
  label: string
  value: number
  accent?: boolean
  warn?: boolean
}) {
  return (
    <div className="rounded-lg border border-border bg-card px-4 py-3 text-center">
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      <p
        className={`mt-0.5 text-lg font-semibold tabular-nums ${
          warn ? 'text-danger' : accent ? 'text-accent' : 'text-ink'
        }`}
      >
        {formatCurrency(value)}
      </p>
    </div>
  )
}
