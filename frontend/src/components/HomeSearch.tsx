'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { PRODUCTS } from '@/lib/mock-data';

/** Central search box on the homepage, with live product suggestions. */
export default function HomeSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return PRODUCTS.filter(
      (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
    ).slice(0, 5);
  }, [query]);

  const submit = (searchQuery?: string) => {
    const target = searchQuery !== undefined ? searchQuery : query;
    if (target.trim()) {
      router.push(`/search?q=${encodeURIComponent(target.trim())}`);
    } else {
      router.push('/search');
    }
    setFocused(false);
  };

  const showSugg = focused && suggestions.length > 0;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSugg) {
      if (e.key === 'Enter') submit();
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Escape') {
      setFocused(false);
      setSelectedIndex(-1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        router.push(`/product/${suggestions[selectedIndex].id}`);
        setFocused(false);
      } else {
        submit();
      }
    }
  };

  return (
    <div className="relative mx-auto mt-7 max-w-xl">
      <div className="flex h-[58px] items-center gap-0 rounded-xl border-2 border-green bg-white px-1.5 ps-[18px] shadow-soft transition-all focus-within:ring-4 focus-within:ring-green/15">
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setFocused(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder="ابحث عن جوال، ماركة، أو الصق اسماً…"
          className="h-full flex-1 border-none bg-transparent text-base outline-none placeholder:text-muted"
          aria-label="ابحث عن جوال"
          aria-autocomplete="list"
        />
        <button
          onClick={() => submit()}
          aria-label="تنفيذ البحث"
          className="flex h-[46px] w-[46px] items-center justify-center rounded-[9px] bg-green text-white transition-colors hover:bg-green-deep active:scale-95 shadow-sm"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4-4" />
          </svg>
        </button>
      </div>

      {showSugg && (
        <div
          className="absolute inset-x-0 top-[70px] z-30 overflow-hidden rounded-xl border border-line bg-white text-right shadow-[0_12px_30px_rgba(0,0,0,.12)] animate-in fade-in-50"
          role="listbox"
        >
          <div className="flex items-center justify-between border-b border-line/60 px-4 py-2 text-[11px] font-bold tracking-wide text-muted">
            <span>اقتراحات فورية</span>
            <span className="text-[10px] text-muted">استخدم الأسهم للتنقل</span>
          </div>
          {suggestions.map((s, idx) => (
            <button
              type="button"
              key={s.id}
              onMouseDown={() => router.push(`/product/${s.id}`)}
              className={`flex w-full items-center gap-3 px-4 py-3 text-right transition-colors ${
                selectedIndex === idx ? 'bg-green-tint text-green-deep' : 'hover:bg-surface'
              }`}
              role="option"
              aria-selected={selectedIndex === idx}
            >
              <div className="relative h-10 w-10 flex-none overflow-hidden rounded-lg border border-line bg-surface">
                {s.image ? (
                  <Image src={s.image} alt={s.name} fill sizes="40px" className="object-cover" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-xs font-bold text-muted">
                    {s.brand.charAt(0)}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-bold text-ink">{s.name}</div>
                <div className="text-xs text-muted">{s.brand} · متوفر في {s.stores} متاجر</div>
              </div>
              <div className="text-left">
                <span className="text-[11px] text-muted block">يبدأ من</span>
                <span dir="ltr" className="num text-sm font-extrabold text-green">{s.from} ر.س</span>
              </div>
            </button>
          ))}
          <div className="border-t border-line/60 bg-surface/50 p-2 text-center">
            <button
              type="button"
              onMouseDown={() => submit()}
              className="text-xs font-bold text-green hover:underline"
            >
              عرض كل نتائج «{query}» ←
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

