import { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import Star from './Star.jsx'

/**
 * Fixed dark-green top bar (the "green header" of the flag hierarchy).
 * - Logo: three red signature stars + "أسعار"
 * - Primary nav (role-aware): الرئيسية · تصفّح · للبائعين/لوحة البائع · الإدارة
 * - Account area: تسجيل الدخول (guest) or حسابي + تسجيل الخروج (authed)
 * - Collapses to a hamburger drawer below the `md` breakpoint.
 */
export default function Navbar() {
  const { isAuthed, isVendor, isAdmin, logout } = useApp()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const links = [
    { to: '/', label: 'الرئيسية', end: true },
    { to: '/search', label: 'تصفّح' },
    isVendor
      ? { to: '/vendor', label: 'لوحة البائع' }
      : { to: '/login', label: 'للبائعين' },
    ...(isAdmin ? [{ to: '/admin', label: 'الإدارة' }] : []),
  ]

  const linkClass = ({ isActive }) =>
    [
      'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
      isActive
        ? 'bg-white/15 text-white'
        : 'text-white/90 hover:bg-white/10 hover:text-white',
    ].join(' ')

  const handleLogout = () => {
    logout()
    setOpen(false)
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 bg-green text-white shadow-soft">
      <div className="mx-auto flex h-16 max-w-content items-center gap-5 px-4 sm:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-heading text-xl font-extrabold text-white" onClick={() => setOpen(false)}>
          <span className="flex gap-0.5 text-star">
            <Star size={15} />
            <Star size={15} />
            <Star size={15} />
          </span>
          أسعار
        </Link>

        {/* Desktop nav */}
        <nav className="ms-2 hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink key={l.to + l.label} to={l.to} end={l.end} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* Account area (desktop) */}
        <div className="ms-auto hidden items-center gap-2 md:flex">
          {isAuthed ? (
            <>
              <NavLink
                to="/account"
                className="rounded-field border border-white/50 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                حسابي
              </NavLink>
              <button
                onClick={handleLogout}
                className="rounded-field bg-white px-4 py-2 text-sm font-semibold text-green transition-colors hover:bg-green-tint"
              >
                تسجيل الخروج
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className="rounded-field bg-white px-4 py-2 text-sm font-semibold text-green transition-colors hover:bg-green-tint"
            >
              تسجيل الدخول
            </NavLink>
          )}
        </div>

        {/* Hamburger (mobile) */}
        <button
          className="ms-auto inline-flex h-10 w-10 items-center justify-center rounded-lg text-2xl text-white hover:bg-white/10 md:hidden"
          aria-label="القائمة"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="border-t border-white/15 bg-green-deep md:hidden">
          <nav className="mx-auto flex max-w-content flex-col gap-1 px-4 py-3">
            {links.map((l) => (
              <NavLink
                key={l.to + l.label}
                to={l.to}
                end={l.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  [
                    'rounded-lg px-3 py-3 text-sm font-medium',
                    isActive ? 'bg-white/15 text-white' : 'text-white/90 hover:bg-white/10',
                  ].join(' ')
                }
              >
                {l.label}
              </NavLink>
            ))}
            <div className="mt-2 flex gap-2 border-t border-white/15 pt-3">
              {isAuthed ? (
                <>
                  <NavLink
                    to="/account"
                    onClick={() => setOpen(false)}
                    className="flex-1 rounded-field border border-white/50 px-4 py-2.5 text-center text-sm font-semibold text-white"
                  >
                    حسابي
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="flex-1 rounded-field bg-white px-4 py-2.5 text-sm font-semibold text-green"
                  >
                    تسجيل الخروج
                  </button>
                </>
              ) : (
                <NavLink
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-field bg-white px-4 py-2.5 text-center text-sm font-semibold text-green"
                >
                  تسجيل الدخول
                </NavLink>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
