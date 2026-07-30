import type { ReactNode } from 'react'

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-border bg-card p-5 shadow-sm ${className}`}>
      {children}
    </div>
  )
}

export function CardTitle({ children }: { children: ReactNode }) {
  return <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">{children}</h3>
}

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{title}</h1>
      {subtitle && <p className="mt-1 text-muted">{subtitle}</p>}
    </div>
  )
}

export function StatCard({
  label,
  value,
  sub,
  variant = 'default',
}: {
  label: string
  value: string
  sub?: string
  variant?: 'default' | 'success' | 'warn' | 'danger'
}) {
  const valueColors = {
    default: 'text-ink',
    success: 'text-accent',
    warn: 'text-warn',
    danger: 'text-danger',
  }

  return (
    <Card>
      <p className="text-sm text-muted">{label}</p>
      <p className={`mt-1 text-2xl font-semibold tabular-nums ${valueColors[variant]}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-muted">{sub}</p>}
    </Card>
  )
}

export function ProgressBar({
  value,
  max = 100,
  variant = 'default',
}: {
  value: number
  max?: number
  variant?: 'default' | 'success' | 'warn' | 'danger'
}) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0
  const barColors = {
    default: 'bg-accent',
    success: 'bg-accent',
    warn: 'bg-warn',
    danger: 'bg-danger',
  }

  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-subtle">
      <div
        className={`h-full rounded-full transition-all duration-300 ${barColors[variant]}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

export function CurrencyInput({
  value,
  onChange,
  label,
  className = '',
}: {
  value: number
  onChange: (value: number) => void
  label?: string
  className?: string
}) {
  return (
    <label className={`block ${className}`}>
      {label && <span className="mb-1 block text-sm text-muted">{label}</span>}
      <input
        type="number"
        step="0.01"
        min="0"
        value={value || ''}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm tabular-nums text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
      />
    </label>
  )
}

export function TextInput({
  value,
  onChange,
  label,
  type = 'text',
  placeholder,
  className = '',
}: {
  value: string
  onChange: (value: string) => void
  label?: string
  type?: string
  placeholder?: string
  className?: string
}) {
  return (
    <label className={`block ${className}`}>
      {label && <span className="mb-1 block text-sm text-muted">{label}</span>}
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
      />
    </label>
  )
}

export function SelectInput({
  value,
  onChange,
  label,
  options,
  className = '',
}: {
  value: string
  onChange: (value: string) => void
  label?: string
  options: { value: string; label: string }[]
  className?: string
}) {
  return (
    <label className={`block ${className}`}>
      {label && <span className="mb-1 block text-sm text-muted">{label}</span>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  type = 'button',
  className = '',
}: {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger'
  type?: 'button' | 'submit'
  className?: string
}) {
  const variants = {
    primary: 'bg-accent text-white hover:opacity-90 dark:text-surface',
    secondary: 'border border-border bg-card text-ink-soft hover:bg-subtle',
    danger: 'bg-danger text-white hover:opacity-90',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  )
}

export function Alert({
  children,
  variant = 'warn',
  className = '',
}: {
  children: ReactNode
  variant?: 'warn' | 'danger' | 'success'
  className?: string
}) {
  const styles = {
    warn: 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200',
    danger:
      'border-red-200 bg-red-50 text-red-900 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200',
    success:
      'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200',
  }

  return (
    <div className={`rounded-lg border px-4 py-3 text-sm ${styles[variant]} ${className}`}>
      {children}
    </div>
  )
}
