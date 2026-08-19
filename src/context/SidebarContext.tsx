import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

const STORAGE_KEY = '6footfinance-sidebar-collapsed'

type SidebarContextValue = {
  isCollapsed: boolean
  isMobileOpen: boolean
  toggleCollapsed: () => void
  setMobileOpen: (open: boolean) => void
  toggleMobileOpen: () => void
}

const SidebarContext = createContext<SidebarContextValue | null>(null)

function readCollapsed(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(readCollapsed)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(isCollapsed))
  }, [isCollapsed])

  const toggleCollapsed = useCallback(() => setIsCollapsed((v) => !v), [])
  const toggleMobileOpen = useCallback(() => setIsMobileOpen((v) => !v), [])
  const setMobileOpen = useCallback((open: boolean) => setIsMobileOpen(open), [])

  const value = useMemo(
    () => ({
      isCollapsed,
      isMobileOpen,
      toggleCollapsed,
      setMobileOpen,
      toggleMobileOpen,
    }),
    [isCollapsed, isMobileOpen, toggleCollapsed, setMobileOpen, toggleMobileOpen],
  )

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
}

export function useSidebar(): SidebarContextValue {
  const ctx = useContext(SidebarContext)
  if (!ctx) throw new Error('useSidebar must be used within SidebarProvider')
  return ctx
}
