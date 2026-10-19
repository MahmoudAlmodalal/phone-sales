import { useNavigate } from 'react-router-dom'
import { useApp, ROLES, ROLE_LABELS } from '../context/AppContext.jsx'

/**
 * DEVELOPMENT-ONLY helper. A small floating control (bottom-start corner) that
 * flips the global viewer role so you can hop between the guest / user / vendor
 * / admin interfaces without a real auth backend.
 *
 * Remove or gate this behind `import.meta.env.DEV` before shipping — it is
 * already hidden in production builds by the guard below.
 */
export default function DevRoleSwitcher() {
  const { role, setRole } = useApp()
  const navigate = useNavigate()

  if (!import.meta.env.DEV) return null

  const pick = (r) => {
    setRole(r)
    // Send guests back home so they don't sit on a now-forbidden route.
    if (r === 'guest') navigate('/')
  }

  return (
    <div className="fixed bottom-4 start-4 z-50 flex items-center gap-2 rounded-full border border-line bg-paper/95 px-3 py-2 shadow-soft backdrop-blur">
      <span className="text-xs font-semibold text-muted">الدور:</span>
      <div className="flex gap-1">
        {ROLES.map((r) => (
          <button
            key={r}
            onClick={() => pick(r)}
            className={[
              'rounded-full px-3 py-1.5 text-xs font-semibold transition-colors',
              role === r
                ? 'bg-green text-white'
                : 'bg-surface text-muted hover:bg-green-tint hover:text-green-deep',
            ].join(' ')}
          >
            {ROLE_LABELS[r]}
          </button>
        ))}
      </div>
    </div>
  )
}
