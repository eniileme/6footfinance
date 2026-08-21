import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  DEFAULT_LOCALE,
  getLocaleOption,
  isAppLocale,
  setActiveLocale,
  type AppLocale,
  type LocaleOption,
  LOCALE_OPTIONS,
} from '../lib/locale'

const STORAGE_KEY = '6footfinance-locale'

type LocaleContextValue = {
  locale: AppLocale
  localeOption: LocaleOption
  locales: LocaleOption[]
  setLocale: (locale: AppLocale) => void
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

function getInitialLocale(): AppLocale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && isAppLocale(stored)) return stored
  } catch {
    /* ignore */
  }

  const browser = navigator.language
  if (browser.startsWith('fr')) return 'fr-FR'
  if (browser.startsWith('fi')) return 'fi-FI'
  if (browser.startsWith('en')) return 'en-GB'
  return DEFAULT_LOCALE
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<AppLocale>(() => {
    const initial = getInitialLocale()
    setActiveLocale(initial)
    return initial
  })

  useEffect(() => {
    setActiveLocale(locale)
    localStorage.setItem(STORAGE_KEY, locale)
  }, [locale])

  const setLocale = useCallback((next: AppLocale) => setLocaleState(next), [])

  const value = useMemo(
    () => ({
      locale,
      localeOption: getLocaleOption(locale),
      locales: LOCALE_OPTIONS,
      setLocale,
    }),
    [locale, setLocale],
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider')
  return ctx
}
