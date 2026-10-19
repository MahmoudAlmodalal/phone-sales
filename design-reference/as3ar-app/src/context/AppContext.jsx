import { createContext, useContext, useState, useEffect, useCallback } from 'react'

/**
 * Global application state.
 *
 * The most important piece for this scaffolding stage is `role`, the current
 * viewer identity. The whole UI (navbar links, route guards, dashboards) keys
 * off it. Four roles from the spec:
 *   'guest'  — الزائر: browse only
 *   'user'   — المستخدم المسجّل: favorites, alerts, bookings
 *   'vendor' — صاحب المتجر: vendor dashboard
 *   'admin'  — مدير النظام: full control
 *
 * A dev role-switcher (see DevRoleSwitcher.jsx) flips this at runtime so you can
 * jump between interfaces without a real auth backend during development.
 */

export const ROLES = ['guest', 'user', 'vendor', 'admin']

export const ROLE_LABELS = {
  guest: 'زائر',
  user: 'مستخدم',
  vendor: 'بائع',
  admin: 'مدير النظام',
}

const STORAGE_KEY = 'as3ar_role'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  // Persist the dev role across reloads so you stay in the interface you were testing.
  const [role, setRole] = useState(() => {
    const saved = typeof localStorage !== 'undefined' && localStorage.getItem(STORAGE_KEY)
    return ROLES.includes(saved) ? saved : 'guest'
  })

  // Shared cross-page collections (wired here now, consumed by pages later).
  const [favorites, setFavorites] = useState([])
  const [compare, setCompare] = useState([])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, role)
  }, [role])

  const login = useCallback((asRole = 'user') => setRole(asRole), [])
  const logout = useCallback(() => setRole('guest'), [])

  const toggleFavorite = useCallback((id) => {
    setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]))
  }, [])

  const toggleCompare = useCallback((id) => {
    setCompare((c) => {
      if (c.includes(id)) return c.filter((x) => x !== id)
      if (c.length >= 4) return c // comparison holds up to 4 (per spec)
      return [...c, id]
    })
  }, [])

  const clearCompare = useCallback(() => setCompare([]), [])

  const value = {
    role,
    setRole,
    roleLabel: ROLE_LABELS[role],
    isAuthed: role !== 'guest',
    isVendor: role === 'vendor' || role === 'admin',
    isAdmin: role === 'admin',
    login,
    logout,
    favorites,
    toggleFavorite,
    compare,
    toggleCompare,
    clearCompare,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>')
  return ctx
}
