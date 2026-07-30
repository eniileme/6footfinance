import { useBudget } from '../context/BudgetContext'
import {
  actualSpendingThisMonth,
  actualVariableSpendingThisMonth,
  plannedSavings,
  projectedYearEndSavings,
  remainingVariableBudget,
  savingTargetProgress,
  savingsRate,
  sumFixedExpenses,
  sumIncome,
  sumVariablePlanned,
  variableSpendingWarning,
} from '../lib/calculations'
import { formatCurrency, formatPercent } from '../lib/format'
import { Alert, Card, CardTitle, PageHeader, ProgressBar, StatCard } from '../components/ui'

export function Dashboard() {
  const { state } = useBudget()

  const income = sumIncome(state)
  const fixed = sumFixedExpenses(state)
  const savings = plannedSavings(state)
  const variablePlanned = sumVariablePlanned(state)
  const variableRemaining = remainingVariableBudget(state)
  const actualTotal = actualSpendingThisMonth(state)
  const actualVariable = actualVariableSpendingThisMonth(state)
  const rate = savingsRate(state)
  const target = savingTargetProgress(state)
  const warning = variableSpendingWarning(state)
  const yearEnd = projectedYearEndSavings(state)

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Your monthly financial snapshot — plan aggressively, spend intentionally."
      />

      {warning.message && (
        <Alert variant={warning.isOverBudget ? 'danger' : 'warn'} className="mb-6">
          {warning.message}
        </Alert>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total income" value={formatCurrency(income)} />
        <StatCard label="Fixed expenses" value={formatCurrency(fixed)} />
        <StatCard
          label="Planned savings"
          value={formatCurrency(savings)}
          variant="success"
          sub={`${formatPercent(rate)} savings rate`}
        />
        <StatCard
          label="Variable budget left"
          value={formatCurrency(variablePlanned - actualVariable)}
          variant={variablePlanned - actualVariable < 0 ? 'danger' : 'default'}
          sub={`${formatCurrency(variablePlanned)} planned`}
        />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Actual spending (this month)"
          value={formatCurrency(actualTotal)}
          sub={`Variable: ${formatCurrency(actualVariable)}`}
        />
        <StatCard
          label="Budget balance"
          value={formatCurrency(variableRemaining)}
          variant={variableRemaining < 0 ? 'danger' : 'default'}
          sub={variableRemaining < 0 ? 'Over-allocated — adjust your budget' : 'Unallocated after all plans'}
        />
        <StatCard
          label="Projected year-end savings"
          value={formatCurrency(yearEnd)}
          variant="success"
          sub="Based on planned monthly savings"
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardTitle>Monthly saving target</CardTitle>
          <div className="space-y-4">
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-muted">Minimum ({formatCurrency(target.minimum)})</span>
                <span className="font-medium tabular-nums">
                  {formatCurrency(target.planned)} · {formatPercent(target.percentOfMinimum)}
                </span>
              </div>
              <ProgressBar
                value={target.planned}
                max={target.minimum}
                variant={target.metMinimum ? 'success' : 'warn'}
              />
            </div>
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-muted">Stretch ({formatCurrency(target.stretch)})</span>
                <span className="font-medium tabular-nums">
                  {formatPercent(target.percentOfStretch)}
                </span>
              </div>
              <ProgressBar
                value={target.planned}
                max={target.stretch}
                variant={target.metStretch ? 'success' : 'default'}
              />
            </div>
            {target.metStretch ? (
              <p className="text-sm text-accent">Stretch target reached in your budget plan.</p>
            ) : target.metMinimum ? (
              <p className="text-sm text-muted">
                Minimum met. {formatCurrency(target.stretch - target.planned)} to stretch goal.
              </p>
            ) : (
              <p className="text-sm text-warn">
                {formatCurrency(target.minimum - target.planned)} below minimum saving target.
              </p>
            )}
          </div>
        </Card>

        <Card>
          <CardTitle>Monthly allocation</CardTitle>
          <div className="space-y-3">
            <AllocationRow label="Fixed expenses" amount={fixed} total={income} />
            <AllocationRow label="Variable spending" amount={variablePlanned} total={income} />
            <AllocationRow label="Savings / investments" amount={savings} total={income} color="accent" />
            {variableRemaining !== 0 && (
              <AllocationRow
                label={variableRemaining > 0 ? 'Unallocated' : 'Over budget'}
                amount={Math.abs(variableRemaining)}
                total={income}
                color={variableRemaining < 0 ? 'danger' : 'muted'}
              />
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

function AllocationRow({
  label,
  amount,
  total,
  color = 'default',
}: {
  label: string
  amount: number
  total: number
  color?: 'default' | 'accent' | 'danger' | 'muted'
}) {
  const pct = total > 0 ? (amount / total) * 100 : 0
  const barColor =
    color === 'accent'
      ? 'bg-accent'
      : color === 'danger'
        ? 'bg-danger'
        : color === 'muted'
          ? 'bg-border'
          : 'bg-muted'

  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span className="text-ink-soft">{label}</span>
        <span className="tabular-nums text-ink">
          {formatCurrency(amount)}{' '}
          <span className="text-muted">({formatPercent(pct)})</span>
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-subtle">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${Math.min(100, pct)}%` }} />
      </div>
    </div>
  )
}
