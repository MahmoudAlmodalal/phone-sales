'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCompareStore } from '@/stores/compare';
import { PRODUCTS } from '@/lib/mock-data';

/**
 * Floating comparison tray, fixed to the bottom. Appears whenever >=1 product
 * is queued for comparison (up to 4). Shown app-wide except on the compare
 * page and auth (see ChromeExtras, which renders this conditionally).
 * Conforms to design-brief.md: 72px height, --ink bg, real thumbnails, green CTA.
 */
export default function CompareBar() {
  const ids = useCompareStore((s) => s.ids);
  const toggle = useCompareStore((s) => s.toggle);
  const clear = useCompareStore((s) => s.clear);
  const router = useRouter();

  if (ids.length === 0) return null;

  const items = ids
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 flex min-h-[72px] items-center gap-3.5 bg-ink px-4 py-2.5 pb-safe text-white shadow-2xl transition-all sm:px-6 animate-in slide-in-from-bottom duration-200"
      role="region"
      aria-label="شريط المقارنة السريع"
    >
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-white/80 hidden sm:inline">للمقارنة:</span>
        <div className="flex items-center gap-2">
          {items.map((p) => (
            <div
              key={p.id}
              className="group relative flex h-11 w-11 flex-none items-center justify-center overflow-hidden rounded-lg border border-white/20 bg-surface shadow-xs"
              title={p.name}
            >
              {p.image ? (
                <Image src={p.image} alt={p.name} fill sizes="44px" className="object-cover" />
              ) : (
                <span className="text-[11px] font-bold text-ink">{p.brand.charAt(0)}</span>
              )}
              {/* Quick remove button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggle(p.id);
                }}
                className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold"
                aria-label={`إزالة ${p.name} من المقارنة`}
              >
                ✕
              </button>
            </div>
          ))}
          {items.length < 4 && (
            <span className="hidden h-11 w-11 items-center justify-center rounded-lg border border-dashed border-white/30 text-xs text-white/40 sm:flex">
              +
            </span>
          )}
        </div>
      </div>

      <div className="ms-auto flex items-center gap-3">
        <button
          type="button"
          onClick={clear}
          className="text-xs font-semibold text-white/70 hover:text-white transition-colors"
        >
          مسح
        </button>
        <button
          type="button"
          onClick={() => router.push('/compare')}
          className="flex h-10 items-center justify-center rounded-field bg-green px-5 text-xs font-bold text-white shadow-md transition-colors hover:bg-green-deep active:scale-95"
        >
          قارن ({ids.length})
        </button>
      </div>
    </div>
  );
}
