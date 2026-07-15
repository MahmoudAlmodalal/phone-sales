'use client';

import { useMemo, useState } from 'react';
import { PRODUCTS, byDrop, byPrice, type Product } from '@/lib/mock-data';
import ProductCard from '@/components/ProductCard';

const SORTS: { id: 'low' | 'drop' | 'compared' | 'new'; label: string }[] = [
  { id: 'low', label: 'الأقل سعراً' },
  { id: 'drop', label: 'الأكثر انخفاضاً' },
  { id: 'compared', label: 'الأكثر مقارنة' },
  { id: 'new', label: 'الأحدث' },
];

const BRANDS = ['آبل', 'سامسونج', 'شاومي', 'جوجل'];
const STORAGE = ['128GB', '256GB', '512GB', '1TB'];
const STORE_NAMES = ['متجر التقنية', 'مكتبة جرير', 'إكسترا'];

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label onClick={onChange} className="flex cursor-pointer items-center gap-2.5 py-1 text-[13.5px]">
      <span
        className={[
          'flex h-[17px] w-[17px] items-center justify-center rounded border text-[11px] text-white',
          checked ? 'border-green bg-green' : 'border-line',
        ].join(' ')}
      >
        {checked && '✓'}
      </span>
      {label}
    </label>
  );
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={[
        'rounded-full border px-3 py-1.5 text-[12.5px]',
        active ? 'border-green bg-green-tint font-semibold text-green-deep' : 'border-line',
      ].join(' ')}
    >
      {label}
    </button>
  );
}

/**
 * Search & results. Sticky sidebar filters (price, brand, storage, store,
 * booking-only) + live sort. Filters are interactive local state against the
 * mock catalogue; Phase 05's real filter/sort params plug in the same shape.
 */
export default function Search() {
  const [sort, setSort] = useState<'low' | 'drop' | 'compared' | 'new'>('low');
  const [brands, setBrands] = useState<string[]>(['آبل', 'سامسونج']);
  const [storage, setStorage] = useState('256GB');
  const [stores, setStores] = useState<string[]>([]);
  const [bookingOnly, setBookingOnly] = useState(true);

  const toggle = (arr: string[], set: (v: string[]) => void, v: string) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const results = useMemo(() => {
    const list: Product[] = [...PRODUCTS];
    if (sort === 'low') list.sort(byPrice);
    else if (sort === 'drop') list.sort(byDrop);
    return list;
  }, [sort]);

  return (
    <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-start gap-6 px-4 py-6 pb-28 sm:px-6 md:grid-cols-[280px_1fr]">
      <aside className="overflow-hidden rounded-card border border-line bg-paper md:sticky md:top-20">
        <div className="border-b border-line p-4">
          <h4 className="mb-3 text-[13.5px] font-bold">نطاق السعر (ر.س)</h4>
          <div className="relative mx-1 my-4 h-1 rounded bg-line">
            <div className="absolute inset-y-0 left-[8%] right-[20%] rounded bg-green" />
            <span className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-green shadow" style={{ right: '20%' }} />
            <span className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-green shadow" style={{ right: '92%' }} />
          </div>
          <div dir="ltr" className="num flex justify-between text-xs text-muted"><span>800</span><span>5,500</span></div>
        </div>

        <div className="border-b border-line p-4">
          <h4 className="mb-2 text-[13.5px] font-bold">العلامة التجارية</h4>
          {BRANDS.map((b) => (
            <Check key={b} label={b} checked={brands.includes(b)} onChange={() => toggle(brands, setBrands, b)} />
          ))}
        </div>

        <div className="border-b border-line p-4">
          <h4 className="mb-3 text-[13.5px] font-bold">التخزين</h4>
          <div className="flex flex-wrap gap-2">
            {STORAGE.map((s) => (
              <Chip key={s} label={s} active={storage === s} onClick={() => setStorage(s)} />
            ))}
          </div>
        </div>

        <div className="border-b border-line p-4">
          <h4 className="mb-2 text-[13.5px] font-bold">المتجر</h4>
          {STORE_NAMES.map((s) => (
            <Check key={s} label={s} checked={stores.includes(s)} onChange={() => toggle(stores, setStores, s)} />
          ))}
        </div>

        <div className="p-4">
          <Check label="متاح للحجز المسبق فقط" checked={bookingOnly} onChange={() => setBookingOnly((v) => !v)} />
        </div>
      </aside>

      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2.5">
          <div className="text-sm text-muted">{results.length} نتيجة</div>
          <div className="flex flex-wrap gap-1.5">
            {SORTS.map((s) => (
              <button
                key={s.id}
                onClick={() => setSort(s.id)}
                className={[
                  'rounded-field border px-3 py-1.5 text-[12.5px]',
                  sort === s.id ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink',
                ].join(' ')}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((p) => <ProductCard key={p.id} product={p} showCompare />)}
        </div>
      </div>
    </div>
  );
}
