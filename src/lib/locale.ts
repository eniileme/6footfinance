export type AppLocale = 'fi-FI' | 'fr-FR' | 'en-GB'

export type LocaleOption = {
  code: AppLocale
  label: string
  nativeLabel: string
}

export const LOCALE_OPTIONS: LocaleOption[] = [
  { code: 'fi-FI', label: 'Finnish', nativeLabel: 'Suomi' },
  { code: 'fr-FR', label: 'French', nativeLabel: 'Français' },
  { code: 'en-GB', label: 'English', nativeLabel: 'English' },
]

export const DEFAULT_LOCALE: AppLocale = 'fi-FI'

let activeLocale: AppLocale = DEFAULT_LOCALE

export function isAppLocale(value: string): value is AppLocale {
  return LOCALE_OPTIONS.some((option) => option.code === value)
}

export function getActiveLocale(): AppLocale {
  return activeLocale
}

export function setActiveLocale(locale: AppLocale): void {
  activeLocale = locale
  if (typeof document !== 'undefined') {
    document.documentElement.lang = locale.slice(0, 2)
  }
}

export function getLocaleOption(code: AppLocale): LocaleOption {
  return LOCALE_OPTIONS.find((option) => option.code === code) ?? LOCALE_OPTIONS[0]
}
