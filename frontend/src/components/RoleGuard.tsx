'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession, useSessionStore, type Role } from '@/stores/session';

/**
 * Route guard for the mock session. If the current role isn't in `roles`,
 * bounce to /login. Phase 04 replaces the mock session with a real httpOnly
 * cookie check (likely enforced in `middleware.ts` instead), so this
 * component is intentionally isolated and easy to swap out.
 */
export default function RoleGuard({ roles, children }: { roles: Role[]; children: React.ReactNode }) {
  const { role } = useSession();
  const hydrated = useSessionStore((s) => s.hydrated);
  const router = useRouter();
  const pathname = usePathname();

  // Don't judge the role until the persisted session has been restored —
  // otherwise a hard load always sees 'guest' and bounces to /login.
  useEffect(() => {
    if (!hydrated) {
      useSessionStore.persist.rehydrate();
    }
  }, [hydrated]);

  useEffect(() => {
    if (hydrated && !roles.includes(role)) {
      router.replace(`/login?from=${encodeURIComponent(pathname)}`);
    }
  }, [hydrated, role, roles, router, pathname]);

  if (!hydrated || !roles.includes(role)) return null;
  return <>{children}</>;
}
