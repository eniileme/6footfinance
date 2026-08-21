import { Outlet } from 'react-router-dom'
import { useLocale } from '../context/LocaleContext'
import { SidebarProvider } from '../context/SidebarContext'
import { MobileMenuButton, Sidebar } from './Sidebar'
import { ThemeToggle } from './ThemeToggle'

export function Layout() {
  const { locale } = useLocale()

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-surface">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-card px-4 lg:hidden">
            <MobileMenuButton />
            <h1 className="text-lg font-semibold text-ink">6FootFinance</h1>
          </header>

          <main key={locale} className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 pb-24 sm:px-6">
            <Outlet />
          </main>
        </div>

        <ThemeToggle />
      </div>
    </SidebarProvider>
  )
}
