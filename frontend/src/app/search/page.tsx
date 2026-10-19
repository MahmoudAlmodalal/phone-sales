'use client';

import { Suspense, useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PRODUCTS, byDrop, byPrice, numeric, type Product } from '@/lib/mock-data';
import ProductCard from '@/components/ProductCard';

const SORTS: { id: 'low' | 'drop' | 'compared' | 'new'; label: string }[] = [
  { id: 'low', label: 'الأقل سعراً' },
  { id: 'drop', label: 'الأكثر انخفاضاً' },
  { id: 'compared', label: 'الأكثر مقارنة' },
  { id: 'new', label: 'أحدث الإضافات' },
];

const BRANDS = ['آبل', 'سامسونج', 'شاومي', 'جوجل', 'ون بلس', 'هونر', 'هواوي'];
const STORAGE = ['الكل', '128GB', '256GB', '512GB'];

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label onClick={onChange} className="flex cursor-pointer items-center gap-2.5 py-1.5 text-[13px] text-ink hover:text-green">
      <span
        className={[
          'flex h-[18px] w-[18px] items-center justify-center rounded border text-[11px] text-white transition-colors',
          checked ? 'border-green bg-green shadow-sm' : 'border-line bg-paper',
        ].join(' ')}
      >
        {checked && '✓'}
      </span>
      <span>{label}</span>
    </label>
  );
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors',
        active ? 'border-green bg-green-tint text-green-deep shadow-sm' : 'border-line bg-paper text-muted hover:border-green/40 hover:text-ink',
      ].join(' ')}
    >
      {label}
    </button>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialQuery = searchParams.get('q') || '';
  const initialBrand = searchParams.get('brand') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [sort, setSort] = useState<'low' | 'drop' | 'compared' | 'new'>('low');
  const [selectedBrands, setSelectedBrands] = useState<string[]>(initialBrand ? [initialBrand] : []);
  const [selectedStorage, setSelectedStorage] = useState('الكل');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(6000);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const toggleBrand = (b: string) => {
    setSelectedBrands((prev) =>
      prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]
    );
  };

  const activeFiltersCount =
    (selectedBrands.length > 0 ? selectedBrands.length : 0) +
    (selectedStorage !== 'الكل' ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (maxPrice < 6000 ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedStorage('الكل');
    setInStockOnly(false);
    setMaxPrice(6000);
    setSearchQuery('');
    router.replace('/search');
  };

  const results = useMemo(() => {
    let list: Product[] = [...PRODUCTS];

    // Filter by text search query
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.chip.toLowerCase().includes(q)
      );
    }

    // Filter by brand
    if (selectedBrands.length > 0) {
      list = list.filter((p) => selectedBrands.includes(p.brand));
    }

    // Filter by storage
    if (selectedStorage !== 'الكل') {
      list = list.filter((p) => p.storage?.includes(selectedStorage));
    }

    // Filter by max price
    if (maxPrice < 6000) {
      list = list.filter((p) => numeric(p.from) <= maxPrice);
    }

    // Sort
    if (sort === 'low') list.sort(byPrice);
    else if (sort === 'drop') list.sort(byDrop);
    else if (sort === 'compared') list.sort((a, b) => b.stores - a.stores);

    return list;
  }, [searchQuery, sort, selectedBrands, selectedStorage, maxPrice]);

  const filterSidebarContent = (
    <div className="flex flex-col gap-0 divide-y divide-line">
      {/* Search Filter Field */}
      <div className="p-4">
        <label htmlFor="filter-search" className="mb-2 block text-xs font-bold text-muted uppercase tracking-wider">
          بحث بالاسم أو الطراز
        </label>
        <div className="relative">
          <input
            id="filter-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="مثال: Ultra, Pro Max..."
            className="h-10 w-full rounded-field border border-line bg-paper px-3 pe-8 text-xs outline-none transition-colors focus:border-green"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 end-2 flex items-center text-muted hover:text-ink text-xs"
              aria-label="مسح البحث"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Brands Filter */}
      <div className="p-4">
        <h4 className="mb-2.5 text-xs font-bold text-muted uppercase tracking-wider">العلامة التجارية</h4>
        <div className="flex flex-col gap-1">
          {BRANDS.map((b) => (
            <Check
              key={b}
              label={b}
              checked={selectedBrands.includes(b)}
              onChange={() => toggleBrand(b)}
            />
          ))}
        </div>
      </div>

      {/* Price Range Slider */}
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-xs font-bold text-muted uppercase tracking-wider">أقصى سعر</h4>
          <span dir="ltr" className="num text-xs font-bold text-green">
            {maxPrice.toLocaleString('en-US')} ر.س
          </span>
        </div>
        <input
          type="range"
          min="1000"
          max="6000"
          step="100"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-[var(--color-green)]"
          aria-label="تحديد أقصى سعر"
        />
        <div className="mt-1 flex justify-between text-[11px] text-muted">
          <span>١,٠٠٠ ر.س</span>
          <span>٦,٠٠٠ ر.س</span>
        </div>
      </div>

      {/* Storage Capacity */}
      <div className="p-4">
        <h4 className="mb-2.5 text-xs font-bold text-muted uppercase tracking-wider">سعة التخزين</h4>
        <div className="flex flex-wrap gap-1.5">
          {STORAGE.map((s) => (
            <Chip
              key={s}
              label={s}
              active={selectedStorage === s}
              onClick={() => setSelectedStorage(s)}
            />
          ))}
        </div>
      </div>

      {/* In-Stock Filter */}
      <div className="p-4">
        <Check
          label="متوفر للاستلام الفوري فقط"
          checked={inStockOnly}
          onChange={() => setInStockOnly(!inStockOnly)}
        />
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6 pb-28 sm:px-6">
      {/* Mobile Top Controls Bar */}
      <div className="mb-4 flex flex-col gap-3 md:hidden">
        {/* Mobile Search Input */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن جوال أو ماركة..."
            className="h-11 w-full rounded-xl border border-line bg-paper px-4 pe-10 text-sm outline-none transition-colors focus:border-green shadow-soft"
          />
          <span className="pointer-events-none absolute inset-y-0 end-3.5 flex items-center text-muted">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" />
            </svg>
          </span>
        </div>

        {/* Action button to open filter drawer + quick sort */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-green/30 bg-green-tint/70 py-2.5 text-sm font-bold text-green-deep active:bg-green-tint transition-colors"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            <span>تصفية وفلترة</span>
            {activeFiltersCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green text-xs font-bold text-white">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Compact Mobile Sort Selector */}
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as 'low' | 'drop' | 'compared' | 'new')}
              className="h-10 appearance-none rounded-xl border border-line bg-paper px-3 pe-7 text-xs font-semibold text-ink outline-none"
              aria-label="ترتيب النتائج"
            >
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute inset-y-0 end-2 flex items-center text-muted text-xs">
              ▾
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[280px_1fr]">
        {/* Desktop Filters Sidebar */}
        <aside className="hidden overflow-hidden rounded-card border border-line bg-paper shadow-soft md:sticky md:top-20 md:block">
          <div className="flex items-center justify-between border-b border-line p-4">
            <h3 className="text-sm font-bold text-ink">تصفية النتائج</h3>
            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-semibold text-star hover:underline"
              >
                إعادة ضبط
              </button>
            )}
          </div>
          {filterSidebarContent}
        </aside>

        {/* Results Column */}
        <div>
          {/* Desktop Results Header & Sort Controls */}
          <div className="mb-4 hidden items-center justify-between gap-3 md:flex md:flex-wrap">
            <div className="text-sm font-bold text-ink">
              عرض <span className="text-green num">{results.length}</span> هواتف ذكية متاحة للمقارنة
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-muted me-1">الترتيب:</span>
              {SORTS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSort(s.id)}
                  className={[
                    'rounded-field border px-3 py-1.5 text-xs font-semibold transition-colors',
                    sort === s.id
                      ? 'border-green bg-green text-white shadow-sm'
                      : 'border-line bg-paper text-ink hover:border-green/50',
                  ].join(' ')}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active Filter Chips */}
          {activeFiltersCount > 0 && (
            <div className="mb-4 flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-muted">الفلاتر المطبقة:</span>
              {searchQuery && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-green/30 bg-green-tint px-2.5 py-1 text-xs font-semibold text-green-deep">
                  <span>بحث: «{searchQuery}»</span>
                  <button type="button" onClick={() => setSearchQuery('')} className="hover:text-star">✕</button>
                </span>
              )}
              {selectedBrands.map((b) => (
                <span key={b} className="inline-flex items-center gap-1.5 rounded-full border border-green/30 bg-green-tint px-2.5 py-1 text-xs font-semibold text-green-deep">
                  <span>{b}</span>
                  <button type="button" onClick={() => toggleBrand(b)} className="hover:text-star">✕</button>
                </span>
              ))}
              {selectedStorage !== 'الكل' && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-green/30 bg-green-tint px-2.5 py-1 text-xs font-semibold text-green-deep">
                  <span>{selectedStorage}</span>
                  <button type="button" onClick={() => setSelectedStorage('الكل')} className="hover:text-star">✕</button>
                </span>
              )}
              {maxPrice < 6000 && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-green/30 bg-green-tint px-2.5 py-1 text-xs font-semibold text-green-deep">
                  <span>حتى {maxPrice} ر.س</span>
                  <button type="button" onClick={() => setMaxPrice(6000)} className="hover:text-star">✕</button>
                </span>
              )}
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-semibold text-star hover:underline ms-1"
              >
                مسح الكل
              </button>
            </div>
          )}

          {/* Results Grid / Empty State */}
          {results.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((p) => (
                <ProductCard key={p.id} product={p} showCompare />
              ))}
            </div>
          ) : (
            /* Actionable empty state conforming strictly to design-brief.md */
            <div className="rounded-2xl border border-line bg-paper p-8 text-center shadow-soft">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-surface text-2xl text-muted">
                🔍
              </div>
              <h3 className="mb-2 text-lg font-bold text-ink">
                لا توجد نتائج مطابقة لبحثك
              </h3>
              <p className="mx-auto max-w-md text-sm text-muted leading-relaxed">
                لم نجد أي هواتف تطابق الفلاتر المحددة. جرّب كتابة اسم أقصر، أو تصفّح الهواتف الأكثر طلباً:
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {['آبل', 'سامسونج', 'شاومي'].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => {
                      clearFilters();
                      setSelectedBrands([b]);
                    }}
                    className="rounded-full border border-green bg-green-tint px-4 py-1.5 text-xs font-bold text-green-deep hover:bg-green hover:text-white transition-colors"
                  >
                    تصفّح {b}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={clearFilters}
                  className="rounded-full border border-line bg-surface px-4 py-1.5 text-xs font-semibold text-ink hover:border-green"
                >
                  إعادة ضبط جميع الفلاتر
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer / Bottom Sheet */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Sheet */}
          <div className="relative z-10 max-h-[85vh] w-full overflow-y-auto rounded-t-3xl bg-paper shadow-2xl animate-in slide-in-from-bottom duration-250">
            {/* Sheet Handle & Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-paper px-5 py-4">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-ink">تصفية وفرز النتائج</h3>
                {activeFiltersCount > 0 && (
                  <span className="rounded-full bg-green px-2 py-0.5 text-[11px] font-bold text-white">
                    {activeFiltersCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {activeFiltersCount > 0 && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-xs font-bold text-star hover:underline"
                  >
                    مسح الكل
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-surface text-muted hover:text-ink"
                  aria-label="إغلاق"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Filter Content */}
            <div className="pb-24">
              {filterSidebarContent}
            </div>

            {/* Sticky Bottom Apply Button */}
            <div className="sticky bottom-0 border-t border-line bg-paper p-4 pb-safe shadow-lg">
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex h-12 w-full items-center justify-center rounded-xl bg-green text-sm font-bold text-white shadow-md active:bg-green-deep transition-colors"
              >
                عرض {results.length} نتيجة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SearchKeyed() {
  const searchParams = useSearchParams();
  return <SearchContent key={searchParams.toString()} />;
}

export default function Search() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-[1200px] p-8 text-center text-muted">جاري تحميل صفحة البحث...</div>}>
      <SearchKeyed />
    </Suspense>
  );
}

