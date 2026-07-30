import { useState } from 'react'
import { useBudget } from '../context/BudgetContext'
import { spendingByCategory } from '../lib/calculations'
import { formatCurrency, formatDate, todayISO } from '../lib/format'
import type { BudgetCategory } from '../types'
import { VARIABLE_CATEGORIES } from '../types'
import {
  Button,
  Card,
  CardTitle,
  CurrencyInput,
  PageHeader,
  SelectInput,
  TextInput,
} from '../components/ui'

export function Transactions() {
  const { state, addTransaction, deleteTransaction } = useBudget()
  const [date, setDate] = useState(todayISO())
  const [amount, setAmount] = useState(0)
  const [category, setCategory] = useState<BudgetCategory>('groceries')
  const [note, setNote] = useState('')

  const categoryTotals = spendingByCategory(state)
  const monthTransactions = state.transactions
    .filter((t) => {
      const d = new Date(t.date)
      const now = new Date()
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
    })
    .sort((a, b) => b.date.localeCompare(a.date))

  const monthTotal = monthTransactions.reduce((s, t) => s + t.amount, 0)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (amount <= 0) return
    addTransaction({ date, amount, category, note })
    setAmount(0)
    setNote('')
    setDate(todayISO())
  }

  const categoryOptions = state.budgetCategories.map((c) => ({
    value: c.id,
    label: c.name,
  }))

  return (
    <div>
      <PageHeader
        title="Transactions"
        subtitle="Log spending manually. Totals update for the current month."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardTitle>Add entry</CardTitle>
          <form onSubmit={handleSubmit} className="space-y-4">
            <TextInput label="Date" type="date" value={date} onChange={setDate} />
            <CurrencyInput label="Amount" value={amount} onChange={setAmount} />
            <SelectInput
              label="Category"
              value={category}
              onChange={(v) => setCategory(v as BudgetCategory)}
              options={categoryOptions}
            />
            <TextInput
              label="Note"
              value={note}
              onChange={setNote}
              placeholder="Optional description"
            />
            <Button type="submit" className="w-full">
              Add transaction
            </Button>
          </form>
        </Card>

        <div className="space-y-6 lg:col-span-2">
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <CardTitle>Category totals (this month)</CardTitle>
              <span className="text-sm font-semibold tabular-nums text-ink">
                {formatCurrency(monthTotal)}
              </span>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {state.budgetCategories
                .filter((c) => VARIABLE_CATEGORIES.includes(c.id) || c.planned > 0)
                .map((cat) => {
                  const spent = categoryTotals[cat.id] ?? 0
                  const over = spent > cat.planned && cat.planned > 0
                  return (
                    <div
                      key={cat.id}
                      className="flex items-center justify-between rounded-lg bg-subtle px-3 py-2 text-sm"
                    >
                      <span className="text-ink-soft">{cat.name}</span>
                      <span className={`tabular-nums ${over ? 'font-medium text-danger' : ''}`}>
                        {formatCurrency(spent)}
                        {cat.planned > 0 && (
                          <span className="text-muted"> / {formatCurrency(cat.planned)}</span>
                        )}
                      </span>
                    </div>
                  )
                })}
            </div>
          </Card>

          <Card>
            <CardTitle>Recent entries</CardTitle>
            {monthTransactions.length === 0 ? (
              <p className="text-sm text-muted">No transactions this month yet.</p>
            ) : (
              <div className="divide-y divide-border">
                {monthTransactions.map((t) => {
                  const catName =
                    state.budgetCategories.find((c) => c.id === t.category)?.name ?? t.category
                  return (
                    <div key={t.id} className="flex items-center justify-between py-3 first:pt-0">
                      <div>
                        <p className="text-sm font-medium text-ink">{catName}</p>
                        <p className="text-xs text-muted">
                          {formatDate(t.date)}
                          {t.note && ` · ${t.note}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold tabular-nums">
                          {formatCurrency(t.amount)}
                        </span>
                        <button
                          type="button"
                          onClick={() => deleteTransaction(t.id)}
                          className="text-xs text-muted hover:text-danger"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
