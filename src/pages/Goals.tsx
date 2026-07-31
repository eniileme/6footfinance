import { useBudget } from '../context/BudgetContext'
import { plannedSavings, totalSinkingFundBalance } from '../lib/calculations'
import { formatCurrency } from '../lib/format'
import type { Goals } from '../types'
import {
  Button,
  Card,
  CardTitle,
  CurrencyInput,
  PageHeader,
  ProgressBar,
} from '../components/ui'

export function GoalsPage() {
  const { state, updateGoals, setYearToDateSaved, resetAll } = useBudget()
  const { goals } = state

  const savings = plannedSavings(state)
  const sinkingTotal = totalSinkingFundBalance(state)

  function updateField<K extends keyof Goals>(key: K, value: Goals[K]) {
    updateGoals({ ...goals, [key]: value })
  }

  return (
    <div>
      <PageHeader
        title="Goals"
        subtitle="Targets that drive your aggressive saving plan over the next few years."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardTitle>Monthly saving targets</CardTitle>
          <div className="space-y-4">
            <CurrencyInput
              label="Minimum monthly saving / investing"
              value={goals.minimumMonthlySaving}
              onChange={(v) => updateField('minimumMonthlySaving', v)}
            />
            <CurrencyInput
              label="Stretch monthly saving / investing"
              value={goals.stretchMonthlySaving}
              onChange={(v) => updateField('stretchMonthlySaving', v)}
            />
            <CurrencyInput
              label="Monthly index fund target"
              value={goals.indexFundTarget}
              onChange={(v) => updateField('indexFundTarget', v)}
            />
            <div className="rounded-lg bg-accent-light px-4 py-3 text-sm">
              <p className="text-muted">Current budget plan</p>
              <p className="mt-1 text-lg font-semibold tabular-nums text-accent">
                {formatCurrency(savings)}/month
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <CardTitle>Fund targets</CardTitle>
          <div className="space-y-4">
            <CurrencyInput
              label="Emergency buffer target"
              value={goals.emergencyBufferTarget}
              onChange={(v) => updateField('emergencyBufferTarget', v)}
            />
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <CardTitle>Progress overview</CardTitle>
          <div className="space-y-6">
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-ink-soft">Emergency buffer</span>
                <span className="tabular-nums">
                  {formatCurrency(sinkingTotal)} / {formatCurrency(goals.emergencyBufferTarget)}
                </span>
              </div>
              <ProgressBar value={sinkingTotal} max={goals.emergencyBufferTarget} />
              <p className="mt-1 text-xs text-muted">
                Based on total sinking fund balances. Adjust individual funds on the Sinking funds page.
              </p>
            </div>

            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-ink-soft">Minimum saving target</span>
                <span className="tabular-nums">
                  {formatCurrency(savings)} / {formatCurrency(goals.minimumMonthlySaving)}
                </span>
              </div>
              <ProgressBar
                value={savings}
                max={goals.minimumMonthlySaving}
                variant={savings >= goals.minimumMonthlySaving ? 'success' : 'warn'}
              />
            </div>

            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-ink-soft">Stretch saving target</span>
                <span className="tabular-nums">
                  {formatCurrency(savings)} / {formatCurrency(goals.stretchMonthlySaving)}
                </span>
              </div>
              <ProgressBar value={savings} max={goals.stretchMonthlySaving} />
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <CardTitle>Year-to-date saved</CardTitle>
          <p className="mb-3 text-sm text-muted">
            Enter how much you've already saved/invested this year for the projected year-end figure on
            the dashboard.
          </p>
          <CurrencyInput
            label="YTD saved / invested"
            value={state.yearToDateSaved}
            onChange={setYearToDateSaved}
            className="max-w-xs"
          />
        </Card>

        <Card className="lg:col-span-2">
          <CardTitle>Reset data</CardTitle>
          <p className="mb-3 text-sm text-muted">
            Restore all defaults and clear transactions. This cannot be undone.
          </p>
          <Button variant="danger" onClick={() => resetAll()}>
            Reset to defaults
          </Button>
        </Card>
      </div>
    </div>
  )
}
