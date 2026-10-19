import { NavLink, Outlet } from 'react-router-dom'

/**
 * Reusable dashboard shell: a page title + a horizontal tab bar whose tabs are
 * real routes (NavLink), with the nested route rendered through <Outlet/>.
 * Used by the user, vendor, and admin dashboards.
 *
 * `dense` bumps the admin toward a tool-like feel (per spec) — hook more styling
 * off it later; for now it just tightens the top padding.
 */
export default function DashboardLayout({ title, tabs = [], dense = false }) {
  return (
    <div className={`mx-auto max-w-content px-4 sm:px-6 ${dense ? 'py-5' : 'py-7'}`}>
      <h1 className="mb-5 text-2xl font-extrabold">{title}</h1>

      <div className="mb-6 flex flex-wrap gap-1 border-b border-line">
        {tabs.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.end}
            className={({ isActive }) =>
              [
                '-mb-px border-b-2 px-4 py-3 text-sm font-semibold transition-colors',
                isActive
                  ? 'border-green text-green'
                  : 'border-transparent text-muted hover:text-ink',
              ].join(' ')
            }
          >
            {t.label}
          </NavLink>
        ))}
      </div>

      <Outlet />
    </div>
  )
}
