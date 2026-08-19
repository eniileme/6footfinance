import { NavLink } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useSidebar } from '../context/SidebarContext'

const mainNavItems = [
  { to: '/', label: 'Dashboard', end: true, icon: DashboardIcon },
  { to: '/budget', label: 'Monthly budget', end: false, icon: BudgetIcon },
  { to: '/transactions', label: 'Transactions', end: false, icon: TransactionsIcon },
  { to: '/sinking-funds', label: 'Sinking funds', end: false, icon: SinkingIcon },
  { to: '/debts', label: 'Debts', end: false, icon: DebtsIcon },
  { to: '/goals', label: 'Goals', end: false, icon: GoalsIcon },
]

export function Sidebar() {
  const { isCollapsed, isMobileOpen, toggleCollapsed, setMobileOpen } = useSidebar()

  return (
    <>
      {isMobileOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-ink/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border bg-card transition-all duration-200 lg:sticky lg:top-0 lg:z-auto lg:h-screen ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'w-[4.25rem]' : 'w-60'}`}
      >
        <div
          className={`flex h-14 shrink-0 items-center border-b border-border px-3 ${
            isCollapsed ? 'justify-center' : 'justify-between'
          }`}
        >
          {!isCollapsed && (
            <span className="truncate text-sm font-semibold text-ink">6FootFinance</span>
          )}
          <button
            type="button"
            onClick={toggleCollapsed}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden rounded-lg p-2 text-muted transition-colors hover:bg-subtle hover:text-ink lg:flex"
          >
            <CollapseIcon collapsed={isCollapsed} />
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="rounded-lg p-2 text-muted transition-colors hover:bg-subtle hover:text-ink lg:hidden"
          >
            <CloseIcon />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-2">
          {!isCollapsed && (
            <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-muted">
              Finance
            </p>
          )}
          {mainNavItems.map((item) => (
            <SidebarLink
              key={item.to}
              to={item.to}
              end={item.end}
              label={item.label}
              collapsed={isCollapsed}
              onNavigate={() => setMobileOpen(false)}
            >
              <item.icon />
            </SidebarLink>
          ))}
        </nav>

        <div className="shrink-0 border-t border-border p-2">
          {!isCollapsed && (
            <p className="px-3 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-wider text-muted">
              Settings
            </p>
          )}
          <SidebarLink
            to="/settings"
            end={false}
            label="Settings"
            collapsed={isCollapsed}
            onNavigate={() => setMobileOpen(false)}
          >
            <SettingsIcon />
          </SidebarLink>
        </div>
      </aside>
    </>
  )
}

function SidebarLink({
  to,
  end,
  label,
  collapsed,
  onNavigate,
  children,
}: {
  to: string
  end: boolean
  label: string
  collapsed: boolean
  onNavigate: () => void
  children: ReactNode
}) {
  return (
    <NavLink
      to={to}
      end={end}
      title={collapsed ? label : undefined}
      onClick={onNavigate}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
          collapsed ? 'justify-center px-2' : ''
        } ${
          isActive
            ? 'bg-accent-light text-accent'
            : 'text-muted hover:bg-subtle hover:text-ink'
        }`
      }
    >
      <span className="shrink-0 [&>svg]:h-5 [&>svg]:w-5">{children}</span>
      {!collapsed && <span className="truncate">{label}</span>}
    </NavLink>
  )
}

function CollapseIcon({ collapsed }: { collapsed: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      {collapsed ? (
        <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5" aria-hidden>
      <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
    </svg>
  )
}

function DashboardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  )
}

function BudgetIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M4 7h16M4 12h16M4 17h10" strokeLinecap="round" />
    </svg>
  )
}

function TransactionsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M7 7h10M7 12h6M7 17h8" strokeLinecap="round" />
      <rect x="3" y="4" width="18" height="16" rx="2" />
    </svg>
  )
}

function SinkingIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M12 3v18M8 7l4-4 4 4M8 17l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function DebtsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M12 3v18" strokeLinecap="round" />
      <path d="M8 8c0-2 1.8-3 4-3s4 1 4 3-1.8 3-4 3-4 1-4 3 1.8 3 4 3 4-1 4-3" strokeLinecap="round" />
    </svg>
  )
}

function GoalsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <circle cx="12" cy="12" r="3" />
      <path
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function MobileMenuButton() {
  const { toggleMobileOpen } = useSidebar()

  return (
    <button
      type="button"
      onClick={toggleMobileOpen}
      aria-label="Open menu"
      className="rounded-lg p-2 text-muted transition-colors hover:bg-subtle hover:text-ink lg:hidden"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5" aria-hidden>
        <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
      </svg>
    </button>
  )
}
