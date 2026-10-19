'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import Star from './Star';
import { useSession, useSessionStore } from '@/stores/session';

/**
 * Fixed dark-green top bar (the "green header" of the Syrian-flag hierarchy).
 * - Logo: three red signature stars + "أسعار"
 * - Primary nav: الرئيسية · تصفّح
 * - Account area:
 *   - guest: only "تسجيل الدخول" button
 *   - authed: user avatar + name + professional dropdown menu (profile, bookings, favorites, logout)
 * - Collapses to a hamburger drawer below the `md` breakpoint.
 */
export default function Navbar() {
  const { role, user, isAuthed } = useSession();
  const hydrated = useSessionStore((s) => s.hydrated);
  const logout = useSessionStore((s) => s.logout);
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const links = [
    { href: '/', label: 'الرئيسية' },
    { href: '/search', label: 'تصفّح' },
    ...(role === 'guest' ? [{ href: '/login', label: 'للبائعين' }] : []),
    ...(role === 'vendor' ? [{ href: '/vendor', label: 'لوحة البائع' }] : []),
    ...(role === 'admin' ? [{ href: '/admin', label: 'الإدارة' }] : []),
  ];

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  const linkClass = (href: string) =>
    [
      'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
      isActive(href) ? 'bg-white/15 text-white' : 'text-white/90 hover:bg-white/10 hover:text-white',
    ].join(' ');

  const handleLogout = () => {
    logout();
    setOpen(false);
    setMenuOpen(false);
    router.push('/');
  };

  // Before hydration, render as guest to prevent hydration mismatches
  const authenticated = hydrated && isAuthed;
  const avatarUrl = user?.avatarUrl || '/avatars/avatar-1.svg';
  const userName = user?.name || 'حسابي';

  return (
    <header className="sticky top-0 z-40 bg-green text-white shadow-soft">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-5 px-4 sm:px-6">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-heading text-xl font-extrabold text-white"
          onClick={() => setOpen(false)}
        >
          <span className="flex gap-0.5 text-star">
            <Star size={15} />
            <Star size={15} />
            <Star size={15} />
          </span>
          <span>أسعار</span>
        </Link>

        {/* Primary Desktop Nav */}
        <nav className="ms-2 hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link key={l.href + l.label} href={l.href} className={linkClass(l.href)}>
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Account Area */}
        <div className="ms-auto hidden items-center gap-3 md:flex">
          {authenticated ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 py-1.5 pe-3 ps-1.5 transition-colors hover:bg-white/15 focus:outline-none"
                aria-expanded={menuOpen}
                aria-haspopup="true"
              >
                <div className="relative h-8 w-8 overflow-hidden rounded-full border border-white/40 bg-white/20">
                  <Image
                    src={avatarUrl}
                    alt={userName}
                    width={32}
                    height={32}
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="max-w-[120px] truncate text-sm font-semibold text-white">
                  {userName}
                </span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`text-white/80 transition-transform ${menuOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {/* User Dropdown Menu */}
              {menuOpen && (
                <div className="absolute end-0 mt-2 w-64 origin-top-right rounded-card border border-line bg-paper p-1 text-ink shadow-lg ring-1 ring-black/5 animate-in fade-in-50">
                  {/* User Header */}
                  <div className="flex items-center gap-3 border-b border-line px-3 py-3">
                    <div className="relative h-10 w-10 flex-none overflow-hidden rounded-full border border-line bg-surface">
                      <Image
                        src={avatarUrl}
                        alt={userName}
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-ink">{userName}</p>
                      <p className="truncate text-xs text-muted" dir="ltr">{user?.email || ''}</p>
                    </div>
                  </div>

                  {/* Nav Links */}
                  <div className="py-1 text-sm">
                    <Link
                      href="/account"
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-ink hover:bg-surface"
                      onClick={() => setMenuOpen(false)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted" aria-hidden="true">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      <span>الملف الشخصي</span>
                    </Link>

                    <Link
                      href="/account/bookings"
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-ink hover:bg-surface"
                      onClick={() => setMenuOpen(false)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted" aria-hidden="true">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      <span>حجوزاتي</span>
                    </Link>

                    <Link
                      href="/account/favorites"
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-ink hover:bg-surface"
                      onClick={() => setMenuOpen(false)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted" aria-hidden="true">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                      <span>المفضلة</span>
                    </Link>

                    <Link
                      href="/account/alerts"
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-ink hover:bg-surface"
                      onClick={() => setMenuOpen(false)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted" aria-hidden="true">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                      </svg>
                      <span>تنبيهات الأسعار</span>
                    </Link>

                    {role === 'vendor' && (
                      <Link
                        href="/vendor"
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-green hover:bg-green-tint"
                        onClick={() => setMenuOpen(false)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        </svg>
                        <span>لوحة البائع</span>
                      </Link>
                    )}

                    {role === 'admin' && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-green hover:bg-green-tint"
                        onClick={() => setMenuOpen(false)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        <span>الإدارة</span>
                      </Link>
                    )}
                  </div>

                  {/* Logout Button */}
                  <div className="border-t border-line pt-1">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-star hover:bg-star-tint transition-colors"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      <span>تسجيل الخروج</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-field bg-white px-4 py-2 text-sm font-semibold text-green transition-colors hover:bg-green-tint"
            >
              تسجيل الدخول
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="ms-auto inline-flex h-10 w-10 items-center justify-center rounded-lg text-2xl text-white hover:bg-white/10 md:hidden"
          aria-label="القائمة"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="border-t border-white/15 bg-green-deep md:hidden">
          <nav className="mx-auto flex max-w-[1200px] flex-col gap-1 px-4 py-3">
            {links.map((l) => (
              <Link
                key={l.href + l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className={[
                  'rounded-lg px-3 py-3 text-sm font-medium',
                  isActive(l.href) ? 'bg-white/15 text-white' : 'text-white/90 hover:bg-white/10',
                ].join(' ')}
              >
                {l.label}
              </Link>
            ))}

            <div className="mt-2 flex flex-col gap-2 border-t border-white/15 pt-3">
              {authenticated ? (
                <>
                  <div className="flex items-center gap-3 px-2 py-1">
                    <div className="relative h-9 w-9 overflow-hidden rounded-full border border-white/30 bg-white/10">
                      <Image
                        src={avatarUrl}
                        alt={userName}
                        width={36}
                        height={36}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-white">{userName}</p>
                      <p className="truncate text-xs text-white/75" dir="ltr">{user?.email || ''}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href="/account"
                      onClick={() => setOpen(false)}
                      className="flex-1 rounded-field border border-white/50 px-4 py-2.5 text-center text-sm font-semibold text-white"
                    >
                      حسابي
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex-1 rounded-field bg-white px-4 py-2.5 text-sm font-semibold text-green"
                    >
                      تسجيل الخروج
                    </button>
                  </div>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-field bg-white px-4 py-2.5 text-center text-sm font-semibold text-green"
                >
                  تسجيل الدخول
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
