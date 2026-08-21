import { useTheme } from '../context/ThemeContext'
import { useLocale } from '../context/LocaleContext'
import type { AppLocale } from '../lib/locale'
import { formatCurrency, formatDate, todayISO } from '../lib/format'
import { Card, CardTitle, PageHeader, SelectInput } from '../components/ui'

export function SettingsPage() {
  const { isDark, toggleTheme } = useTheme()
  const { locale, locales, setLocale } = useLocale()

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="App preferences and account options will live here."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardTitle>Appearance</CardTitle>
          <div className="flex items-center justify-between gap-4 rounded-lg border border-border px-4 py-3">
            <div>
              <p className="text-sm font-medium text-ink">Dark mode</p>
              <p className="text-xs text-muted">Switch between light and dark themes.</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={isDark}
              onClick={toggleTheme}
              className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
                isDark ? 'bg-accent' : 'bg-border'
              }`}
            >
              <span
                className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                  isDark ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </Card>

        <Card>
          <CardTitle>Locale</CardTitle>
          <p className="mb-4 text-sm text-muted">
            Controls how amounts and dates are formatted. Currency stays in euros.
          </p>
          <SelectInput
            label="Language & number format"
            value={locale}
            onChange={(value) => setLocale(value as AppLocale)}
            options={locales.map((option) => ({
              value: option.code,
              label: `${option.label} (${option.nativeLabel})`,
            }))}
          />
          <div className="mt-4 rounded-lg bg-subtle px-4 py-3 text-sm">
            <p className="text-muted">Preview</p>
            <p className="mt-1 tabular-nums text-ink">
              {formatCurrency(1234.5)} · {formatDate(todayISO())}
            </p>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <CardTitle>Coming soon</CardTitle>
          <ul className="space-y-2 text-sm text-muted">
            <li>Export / import data</li>
            <li>Default budget templates</li>
            <li>Notifications</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
