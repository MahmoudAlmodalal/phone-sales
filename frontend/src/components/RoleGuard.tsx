'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession, type Role } from '@/stores/session';

/**
 * Route guard for the mock session. If the current role isn't in `roles`,
 * bounce to /login. Phase 04 replaces the mock session with a real httpOnly
 * cookie check (likely enforced in `middleware.ts` instead), so this
 * component is intentionally isolated and easy to swap out.
 */
export default function RoleGuard({ roles, children }: { roles: Role[]; children: React.ReactNode }) {
  const { role } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!roles.includes(role)) {
      router.replace(`/login?from=${encodeURIComponent(pathname)}`);
    }
  }, [role, roles, router, pathname]);

  if (!roles.includes(role)) return null;
  return <>{children}</>;
}
