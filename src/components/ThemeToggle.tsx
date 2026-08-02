import { useTheme } from '../context/ThemeContext'

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      title={isDark ? 'Light mode' : 'Dark mode'}
      className="fixed bottom-5 right-5 z-50 flex h-14 w-11 items-center justify-center rounded-xl border border-border bg-card p-1.5 shadow-lg transition-colors hover:bg-subtle focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
    >
      {/* Interrupteur: I = light on, O = dark / off */}
      <span
        className="flex h-full w-full flex-col overflow-hidden rounded-md border border-border bg-subtle"
        aria-hidden
      >
        <span
          className={`flex flex-1 items-center justify-center text-[10px] font-bold transition-colors ${
            !isDark ? 'bg-accent text-white dark:text-surface' : 'text-muted'
          }`}
        >
          I
        </span>
        <span className="h-px shrink-0 bg-border" />
        <span
          className={`flex flex-1 items-center justify-center text-[10px] font-bold transition-colors ${
            isDark ? 'bg-ink text-surface' : 'text-muted'
          }`}
        >
          O
        </span>
      </span>
    </button>
  )
}
