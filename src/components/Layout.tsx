import { NavLink, Outlet } from 'react-router-dom'
import { ThemeToggle } from './ThemeToggle'

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/budget', label: 'Monthly budget' },
  { to: '/transactions', label: 'Transactions' },
  { to: '/sinking-funds', label: 'Sinking funds' },
  { to: '/debts', label: 'Debts' },
  { to: '/goals', label: 'Goals' },
]

export function Layout() {
  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-accent">
              Personal finance
            </p>
            <h1 className="text-xl font-semibold text-ink">6footfinance</h1>
          </div>
          <nav className="flex flex-wrap gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-accent-light text-accent'
                      : 'text-muted hover:bg-subtle hover:text-ink'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 pb-24 sm:px-6">
        <Outlet />
      </main>
      <ThemeToggle />
    </div>
  )
}
