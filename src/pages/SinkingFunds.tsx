import { useBudget } from '../context/BudgetContext'
import { formatCurrency } from '../lib/format'
import { Card, CurrencyInput, PageHeader, ProgressBar } from '../components/ui'

export function SinkingFunds() {
  const { state, updateSinkingFund } = useBudget()

  const totalBalance = state.sinkingFunds.reduce((s, f) => s + f.balance, 0)
  const totalTarget = state.sinkingFunds.reduce((s, f) => s + f.target, 0)
  const totalMonthly = state.sinkingFunds.reduce((s, f) => s + f.monthlyContribution, 0)

  return (
    <div>
      <PageHeader
        title="Sinking funds"
        subtitle="Set aside money for predictable but irregular expenses."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card px-4 py-3">
          <p className="text-xs uppercase tracking-wide text-muted">Total balance</p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-accent">
            {formatCurrency(totalBalance)}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card px-4 py-3">
          <p className="text-xs uppercase tracking-wide text-muted">Combined targets</p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-ink">{formatCurrency(totalTarget)}</p>
        </div>
        <div className="rounded-xl border border-border bg-card px-4 py-3">
          <p className="text-xs uppercase tracking-wide text-muted">Monthly contributions</p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-ink">{formatCurrency(totalMonthly)}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {state.sinkingFunds.map((fund) => {
          const progress = fund.target > 0 ? (fund.balance / fund.target) * 100 : 0
          const monthsToTarget =
            fund.monthlyContribution > 0
              ? Math.ceil(Math.max(0, fund.target - fund.balance) / fund.monthlyContribution)
              : null

          return (
            <Card key={fund.id}>
              <div className="mb-3 flex items-start justify-between">
                <h3 className="font-medium text-ink">{fund.name}</h3>
                <span className="text-sm tabular-nums text-muted">
                  {progress.toFixed(0)}% funded
                </span>
              </div>

              <ProgressBar
                value={fund.balance}
                max={fund.target}
                variant={progress >= 100 ? 'success' : 'default'}
              />

              <div className="mt-3 flex justify-between text-sm">
                <span className="tabular-nums text-ink">
                  {formatCurrency(fund.balance)}
                  <span className="text-muted"> / {formatCurrency(fund.target)}</span>
                </span>
                {monthsToTarget !== null && fund.balance < fund.target && (
                  <span className="text-xs text-muted">~{monthsToTarget} mo to target</span>
                )}
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                <CurrencyInput
                  label="Target"
                  value={fund.target}
                  onChange={(target) => updateSinkingFund(fund.id, { target })}
                />
                <CurrencyInput
                  label="Balance"
                  value={fund.balance}
                  onChange={(balance) => updateSinkingFund(fund.id, { balance })}
                />
                <CurrencyInput
                  label="Monthly"
                  value={fund.monthlyContribution}
                  onChange={(monthlyContribution) =>
                    updateSinkingFund(fund.id, { monthlyContribution })
                  }
                />
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
