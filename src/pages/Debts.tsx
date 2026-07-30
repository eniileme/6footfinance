import { useBudget } from '../context/BudgetContext'
import { estimateDebtRemainingPayments } from '../lib/calculations'
import { formatCurrency } from '../lib/format'
import { Card, CardTitle, CurrencyInput, PageHeader, TextInput } from '../components/ui'

export function Debts() {
  const { state, updateDebt } = useBudget()

  const totalBalance = state.debts.reduce((s, d) => s + d.balance, 0)
  const totalMonthly = state.debts.reduce((s, d) => s + d.monthlyPayment, 0)

  return (
    <div>
      <PageHeader
        title="Debts"
        subtitle="Track balances and payments manually. Update from your statements."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card px-4 py-3">
          <p className="text-xs uppercase tracking-wide text-muted">Total outstanding</p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-ink">{formatCurrency(totalBalance)}</p>
        </div>
        <div className="rounded-xl border border-border bg-card px-4 py-3">
          <p className="text-xs uppercase tracking-wide text-muted">Monthly payments</p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-ink">{formatCurrency(totalMonthly)}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {state.debts.map((debt) => {
          const estimate = estimateDebtRemainingPayments(debt)
          const monthsLabel =
            estimate.monthsRemaining === Infinity
              ? 'Payment too low to cover interest'
              : estimate.monthsRemaining === 0
                ? 'Paid off'
                : `~${estimate.monthsRemaining} months remaining`

          return (
            <Card key={debt.id}>
              <CardTitle>{debt.name}</CardTitle>

              <div className="mb-4 grid grid-cols-2 gap-3">
                <CurrencyInput
                  label="Balance"
                  value={debt.balance}
                  onChange={(balance) => updateDebt(debt.id, { balance })}
                />
                <CurrencyInput
                  label="Monthly payment"
                  value={debt.monthlyPayment}
                  onChange={(monthlyPayment) => updateDebt(debt.id, { monthlyPayment })}
                />
                <label className="block">
                  <span className="mb-1 block text-sm text-muted">Interest rate (%)</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={debt.interestRate || ''}
                    onChange={(e) =>
                      updateDebt(debt.id, { interestRate: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm tabular-nums text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                  />
                </label>
                <CurrencyInput
                  label="Final balloon (optional)"
                  value={debt.finalBalloon ?? 0}
                  onChange={(finalBalloon) => updateDebt(debt.id, { finalBalloon })}
                />
              </div>

              <TextInput
                label="Notes"
                value={debt.notes ?? ''}
                onChange={(notes) => updateDebt(debt.id, { notes })}
                placeholder="Lender, account number, etc."
              />

              <div className="mt-4 rounded-lg bg-subtle px-4 py-3 text-sm">
                <p className="font-medium text-ink">{monthsLabel}</p>
                <p className="mt-1 text-muted">
                  Est. total remaining payments:{' '}
                  {estimate.totalRemaining === Infinity
                    ? '—'
                    : formatCurrency(estimate.totalRemaining)}
                </p>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
