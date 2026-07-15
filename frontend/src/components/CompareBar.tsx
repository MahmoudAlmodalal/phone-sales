'use client';

import { useRouter } from 'next/navigation';
import { useCompareStore } from '@/stores/compare';
import { PRODUCTS } from '@/lib/mock-data';

/**
 * Floating comparison tray, fixed to the bottom. Appears whenever >=1 product
 * is queued for comparison (up to 4). Shown app-wide except on the compare
 * page and auth (see ChromeExtras, which renders this conditionally).
 */
export default function CompareBar() {
  const ids = useCompareStore((s) => s.ids);
  const clear = useCompareStore((s) => s.clear);
  const router = useRouter();
  if (ids.length === 0) return null;

  const items = ids.map((id) => PRODUCTS.find((p) => p.id === id)).filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex h-[72px] items-center gap-3.5 bg-ink px-4 text-white sm:px-6">
      <span className="text-[13px] text-white/70">للمقارنة:</span>
      <div className="flex gap-2">
        {items.map((p) => (
          <span
            key={p.id}
            className="relative flex h-11 w-11 items-center justify-center rounded-lg bg-[#26332e] text-[10px] text-white/60"
          >
            {p.brand.charAt(0)}
          </span>
        ))}
      </div>
      <div className="ms-auto flex items-center gap-3">
        <button onClick={clear} className="text-[13px] text-white/70 hover:text-white">
          مسح
        </button>
        <button
          onClick={() => router.push('/compare')}
          className="rounded-field bg-white px-4 py-2 text-[13px] font-semibold text-green hover:bg-green-tint"
        >
          قارن ({ids.length})
        </button>
      </div>
    </div>
  );
}
