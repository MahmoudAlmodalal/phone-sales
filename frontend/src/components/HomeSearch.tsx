'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PRODUCTS } from '@/lib/mock-data';

/** Central search box on the homepage, with live product suggestions. */
export default function HomeSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    return PRODUCTS.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())).slice(0, 4);
  }, [query]);

  const submit = () => router.push('/search');
  const showSugg = focused && suggestions.length > 0;

  return (
    <div className="relative mx-auto mt-7 max-w-xl">
      <div className="flex h-[58px] items-center gap-0 rounded-xl border-2 border-green bg-white px-1.5 ps-[18px] shadow-soft">
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setFocused(true); }}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="ابحث عن جوال، أو الصق رابطاً…"
          className="h-full flex-1 border-none bg-transparent text-base outline-none"
        />
        <button
          onClick={submit}
          aria-label="بحث"
          className="flex h-[46px] w-[46px] items-center justify-center rounded-[9px] bg-green text-white hover:bg-green-deep"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" />
          </svg>
        </button>
      </div>

      {showSugg && (
        <div className="absolute inset-x-0 top-[70px] z-30 overflow-hidden rounded-xl border border-line bg-white text-right shadow-[0_12px_30px_rgba(0,0,0,.12)]">
          <div className="px-4 pb-1 pt-2.5 text-[11px] font-bold tracking-wide text-muted">منتجات</div>
          {suggestions.map((s) => (
            <button
              key={s.id}
              onMouseDown={() => router.push(`/product/${s.id}`)}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-right hover:bg-surface"
            >
              <span className="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-[7px] border border-line bg-surface text-[11px] font-bold text-muted">
                {s.brand.charAt(0)}
              </span>
              <span className="flex-1 text-sm">{s.name}</span>
              <span dir="ltr" className="num text-[13px]">{s.from}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
