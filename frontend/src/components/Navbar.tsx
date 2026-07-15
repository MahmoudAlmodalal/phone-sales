'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Star from './Star';
import { useSession, useSessionStore } from '@/stores/session';

/**
 * Fixed dark-green top bar (the "green header" of the flag hierarchy).
 * - Logo: three red signature stars + "أسعار"
 * - Primary nav (role-aware): الرئيسية · تصفّح · للبائعين/لوحة البائع · الإدارة
 * - Account area: تسجيل الدخول (guest) or حسابي + تسجيل الخروج (authed)
 * - Collapses to a hamburger drawer below the `md` breakpoint.
 */
export default function Navbar() {
  const { isAuthed, isVendor, isAdmin } = useSession();
  const logout = useSessionStore((s) => s.logout);
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const links = [
    { href: '/', label: 'الرئيسية' },
    { href: '/search', label: 'تصفّح' },
    isVendor ? { href: '/vendor', label: 'لوحة البائع' } : { href: '/login', label: 'للبائعين' },
    ...(isAdmin ? [{ href: '/admin', label: 'الإدارة' }] : []),
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
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-green text-white shadow-soft">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-5 px-4 sm:px-6">
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
          أسعار
        </Link>

        <nav className="ms-2 hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link key={l.href + l.label} href={l.href} className={linkClass(l.href)}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ms-auto hidden items-center gap-2 md:flex">
          {isAuthed ? (
            <>
              <Link
                href="/account"
                className="rounded-field border border-white/50 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                حسابي
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-field bg-white px-4 py-2 text-sm font-semibold text-green transition-colors hover:bg-green-tint"
              >
                تسجيل الخروج
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-field bg-white px-4 py-2 text-sm font-semibold text-green transition-colors hover:bg-green-tint"
            >
              تسجيل الدخول
            </Link>
          )}
        </div>

        <button
          className="ms-auto inline-flex h-10 w-10 items-center justify-center rounded-lg text-2xl text-white hover:bg-white/10 md:hidden"
          aria-label="القائمة"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? '✕' : '☰'}
        </button>
      </div>

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
            <div className="mt-2 flex gap-2 border-t border-white/15 pt-3">
              {isAuthed ? (
                <>
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
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-field bg-white px-4 py-2.5 text-center text-sm font-semibold text-green"
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
