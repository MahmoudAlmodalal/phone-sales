'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export type DashTab = {
  href: string;
  label: string;
  end?: boolean;
  /** red counter bubble on the tab (design's .tab-alert) */
  alert?: number;
  alertAmber?: boolean;
};

/**
 * Dashboard shell matching the design's `.wrap` + `.tabs` structure
 * (dashboards.css, ported from the .dc.html source). The admin variant adds
 * the sub-line + production environment tag from the design's `.admin-head`.
 */
export default function DashShell({
  title,
  subtitle,
  admin = false,
  tabs,
  children,
}: {
  title: string;
  subtitle?: string;
  admin?: boolean;
  tabs: DashTab[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="dash">
      <div className={admin ? 'wrap admin-wrap' : 'wrap'}>
        {admin ? (
          <div className="admin-head">
            <div>
              <h1 className="page-h">{title}</h1>
              {subtitle && <div className="sub">{subtitle}</div>}
            </div>
            <span className="env-tag">
              <span className="lv" />
              البيئة: الإنتاج
            </span>
          </div>
        ) : (
          <h1 className="page-h">{title}</h1>
        )}

        <div className="tabs">
          {tabs.map((t) => (
            <Link key={t.href} href={t.href} className={pathname === t.href ? 'on' : ''}>
              {t.label}
              {t.alert ? <span className={t.alertAmber ? 'tab-alert amber' : 'tab-alert'}>{t.alert}</span> : null}
            </Link>
          ))}
        </div>

        {children}
      </div>
    </div>
  );
}
