'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import CompareBar from './CompareBar';
import ToastHost from './Toast';
import { useCompareStore } from '@/stores/compare';
import { useFavoritesStore } from '@/stores/favorites';
import { useSessionStore } from '@/stores/session';

/**
 * Global chrome that needs client-side state: rehydrates the persisted
 * Zustand stores on mount, shows an offline banner, hosts the toast queue,
 * and renders the floating CompareBar everywhere except /compare and /login
 * (matching the prototype's RootLayout behavior).
 */
export default function ChromeExtras() {
  const pathname = usePathname();
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    useCompareStore.persist.rehydrate();
    useFavoritesStore.persist.rehydrate();
    useSessionStore.persist.rehydrate();

    const update = () => setOffline(!navigator.onLine);
    update();
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  const showCompareBar = pathname !== '/compare' && pathname !== '/login';

  return (
    <>
      {offline && (
        <div className="fixed inset-x-0 top-0 z-50 bg-surface px-4 py-2 text-center text-[13px] text-muted shadow-soft">
          لا يوجد اتصال بالإنترنت — الأسعار المعروضة قد لا تكون محدّثة.
        </div>
      )}
      {showCompareBar && <CompareBar />}
      <ToastHost />
    </>
  );
}
