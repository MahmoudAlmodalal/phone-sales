'use client';

import { useMemo, useState } from 'react';
import { PRODUCTS, byDrop, byPrice, type Product } from '@/lib/mock-data';
import ProductCard from '@/components/ProductCard';

const SORTS: { id: 'low' | 'drop' | 'compared' | 'new'; label: string }[] = [
  { id: 'low', label: 'الأقل سعراً أولاً' },
  { id: 'drop', label: 'الأكثر انخفاضاً' },
  { id: 'compared', label: 'الأكثر مقارنة' },
  { id: 'new', label: 'أحدث الإضافات' },
];

const BRANDS = ['آبل', 'سامسونج', 'شاومي', 'جوجل', 'ون بلس', 'هونر', 'هواوي'];
const STORAGE = ['الكل', '128GB', '256GB', '512GB'];

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label onClick={onChange} className="flex cursor-pointer items-center gap-2.5 py-1 text-[13px] text-ink hover:text-green">
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

export default function Search() {
  const [sort, setSort] = useState<'low' | 'drop' | 'compared' | 'new'>('low');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedStorage, setSelectedStorage] = useState('الكل');
  const [inStockOnly, setInStockOnly] = useState(false);

  const toggleBrand = (b: string) => {
    setSelectedBrands((prev) =>
      prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]
    );
  };

  const results = useMemo(() => {
    let list: Product[] = [...PRODUCTS];

    // Filter by brand
    if (selectedBrands.length > 0) {
      list = list.filter((p) => selectedBrands.includes(p.brand));
    }

    // Filter by storage
    if (selectedStorage !== 'الكل') {
      list = list.filter((p) => p.storage?.includes(selectedStorage));
    }

    // Sort
    if (sort === 'low') list.sort(byPrice);
    else if (sort === 'drop') list.sort(byDrop);
    else if (sort === 'compared') list.sort((a, b) => b.stores - a.stores);

    return list;
  }, [sort, selectedBrands, selectedStorage]);

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedStorage('الكل');
    setInStockOnly(false);
  };

  return (
    <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-start gap-6 px-4 py-6 pb-28 sm:px-6 md:grid-cols-[280px_1fr]">
      {/* Filters Sidebar */}
      <aside className="overflow-hidden rounded-card border border-line bg-paper shadow-soft md:sticky md:top-20">
        <div className="flex items-center justify-between border-b border-line p-4">
          <h3 className="text-sm font-bold text-ink">تصفية النتائج</h3>
          {(selectedBrands.length > 0 || selectedStorage !== 'الكل') && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-semibold text-star hover:underline"
            >
              إعادة ضبط
            </button>
          )}
        </div>

        {/* Brands Filter */}
        <div className="border-b border-line p-4">
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

        {/* Storage Capacity */}
        <div className="border-b border-line p-4">
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
      </aside>

      {/* Results Header & Grid */}
      <div>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((p) => (
            <ProductCard key={p.id} product={p} showCompare />
          ))}
        </div>
      </div>
    </div>
  );
}
