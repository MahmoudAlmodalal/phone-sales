'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export type DashboardTab = { href: string; label: string; end?: boolean };

/**
 * Reusable dashboard shell: a page title + a horizontal tab bar whose tabs are
 * real routes, with the current section's page rendered as `children`. Used
 * by the user, vendor, and admin dashboards.
 */
export default function DashboardLayout({
  title,
  tabs,
  dense = false,
  children,
}: {
  title: string;
  tabs: DashboardTab[];
  dense?: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = (tab: DashboardTab) => (tab.end ? pathname === tab.href : pathname === tab.href);

  return (
    <div className={`mx-auto max-w-[1200px] px-4 sm:px-6 ${dense ? 'py-5' : 'py-7'}`}>
      <h1 className="mb-5 text-2xl font-extrabold">{title}</h1>

      <div className="mb-6 flex flex-wrap gap-1 border-b border-line">
        {tabs.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className={[
              '-mb-px border-b-2 px-4 py-3 text-sm font-semibold transition-colors',
              isActive(t) ? 'border-green text-green' : 'border-transparent text-muted hover:text-ink',
            ].join(' ')}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {children}
    </div>
  );
}
