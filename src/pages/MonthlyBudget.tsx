import { Link } from 'react-router-dom'
import { useBudget } from '../context/BudgetContext'
import {
  plannedDebtOverpayments,
  plannedSavings,
  remainingBudget,
  sumFixedExpenses,
  sumIncome,
  sumRequiredDebtPayments,
  sumSinkingFundContributions,
  sumVariablePlanned,
  totalPlannedOutflows,
} from '../lib/calculations'
import { formatCurrency } from '../lib/format'
import { VARIABLE_CATEGORIES } from '../types'
import { Alert, Card, CardTitle, CurrencyInput, PageHeader } from '../components/ui'

export function MonthlyBudget() {
  const { state, updateBudgetCategory, updateIncome, updateFixedExpenses } = useBudget()

  const income = sumIncome(state)
  const fixed = sumFixedExpenses(state)
  const debtPayments = sumRequiredDebtPayments(state)
  const sinkingContributions = sumSinkingFundContributions(state)
  const fixedCommitments = fixed + debtPayments + sinkingContributions
  const variable = sumVariablePlanned(state)
  const savings = plannedSavings(state)
  const debtExtra = plannedDebtOverpayments(state)
  const plannedOutflows = totalPlannedOutflows(state)
  const remaining = remainingBudget(state)

  const variableCategories = state.budgetCategories.filter((c) =>
    VARIABLE_CATEGORIES.includes(c.id),
  )
  const allocationCategories = state.budgetCategories.filter(
    (c) => c.id === 'savings-investments' || c.id === 'debt-overpayments',
  )

  const debtsWithPayment = state.debts.filter((d) => d.monthlyPayment > 0)
  const fundsWithContribution = state.sinkingFunds.filter((f) => f.monthlyContribution > 0)

  return (
    <div>
      <PageHeader
        title="Monthly budget"
        subtitle="Edit planned amounts. Income and fixed costs are editable here too."
      />

      {remaining !== 0 && (
        <Alert variant={remaining < 0 ? 'danger' : 'warn'} className="mb-6">
          {remaining < 0
            ? `Planned outflows exceed income by ${formatCurrency(Math.abs(remaining))}. Reduce spending, savings, or commitments.`
            : `${formatCurrency(remaining)} remaining after plan — consider adding to savings or sinking funds.`}
        </Alert>
      )}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <SummaryPill label="Income" value={income} />
        <SummaryPill label="Fixed expenses" value={fixed} />
        <SummaryPill label="Required debt payments" value={debtPayments} />
        <SummaryPill label="Sinking fund contributions" value={sinkingContributions} />
        <SummaryPill label="Total fixed commitments" value={fixedCommitments} />
        <SummaryPill label="Variable spending" value={variable} />
        <SummaryPill label="Planned savings" value={savings} accent />
        {debtExtra > 0 && <SummaryPill label="Debt overpayments" value={debtExtra} />}
        <SummaryPill label="Total planned outflows" value={plannedOutflows} />
        <SummaryPill label="Remaining budget" value={remaining} warn={remaining < 0} />
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
                    const next = [...state.income]
                    next[i] = { ...item, name: e.target.value }
                    updateIncome(next)
                  }}
                  className="flex-1 rounded-lg border border-border bg-card px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
                <CurrencyInput
                  value={item.amount}
                  onChange={(amount) => {
                    const next = [...state.income]
                    next[i] = { ...item, amount }
                    updateIncome(next)
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

        {debtsWithPayment.length > 0 && (
          <Card>
            <div className="mb-3 flex items-center justify-between gap-2">
              <CardTitle>Required debt payments</CardTitle>
              <Link to="/debts" className="text-xs font-medium text-accent hover:underline">
                Manage in Debts
              </Link>
            </div>
            <div className="space-y-2">
              {debtsWithPayment.map((debt) => (
                <div
                  key={debt.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2"
                >
                  <div>
                    <p className="text-sm text-ink-soft">{debt.name}</p>
                    <p className="text-xs text-muted">Managed in Debts</p>
                  </div>
                  <span className="text-sm font-medium tabular-nums text-ink">
                    {formatCurrency(debt.monthlyPayment)}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {fundsWithContribution.length > 0 && (
          <Card>
            <div className="mb-3 flex items-center justify-between gap-2">
              <CardTitle>Sinking fund contributions</CardTitle>
              <Link
                to="/sinking-funds"
                className="text-xs font-medium text-accent hover:underline"
              >
                Manage in Sinking Funds
              </Link>
            </div>
            <div className="space-y-2">
              {fundsWithContribution.map((fund) => (
                <div
                  key={fund.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2"
                >
                  <div>
                    <p className="text-sm text-ink-soft">{fund.name}</p>
                    <p className="text-xs text-muted">Managed in Sinking Funds</p>
                  </div>
                  <span className="text-sm font-medium tabular-nums text-ink">
                    {formatCurrency(fund.monthlyContribution)}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}

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
