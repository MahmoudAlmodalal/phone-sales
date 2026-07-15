'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PRODUCTS, numeric, type Product } from '@/lib/mock-data';
import { useCompareStore } from '@/stores/compare';
import EmptyState from '@/components/EmptyState';

type Row = {
  attr: string;
  price?: boolean;
  same?: boolean;
  get?: (c: Product) => string | number;
  win?: (c: Product) => boolean;
};

/** Horizontal compare table: attribute column fixed, best value per row highlighted. */
export default function Compare() {
  const router = useRouter();
  const ids = useCompareStore((s) => s.ids);
  const clear = useCompareStore((s) => s.clear);
  const [hideSame, setHideSame] = useState(false);

  const cols = ids.map((id) => PRODUCTS.find((p) => p.id === id)).filter((p): p is Product => Boolean(p));

  if (cols.length === 0) {
    return (
      <div className="mx-auto max-w-[1200px] px-6 py-16">
        <EmptyState
          title="لم تختر أي منتج للمقارنة بعد"
          description="أضف منتجات من صفحة البحث وستظهر هنا جنباً إلى جنب."
          actionLabel="تصفّح المنتجات"
          onAction={() => router.push('/search')}
        />
      </div>
    );
  }

  const minPrice = Math.min(...cols.map((c) => numeric(c.from)));
  const maxBatt = Math.max(...cols.map((c) => numeric(c.battery)));

  const rows: Row[] = [
    { attr: 'أقل سعر', price: true },
    { attr: 'العلامة', get: (c: Product) => c.brand },
    { attr: 'المعالج', get: (c: Product) => c.chip },
    { attr: 'الشاشة', get: () => '6.7" OLED 120Hz', same: true },
    { attr: 'البطارية', get: (c: Product) => c.battery, win: (c: Product) => numeric(c.battery) === maxBatt },
    { attr: 'عدد المتاجر', get: (c: Product) => c.stores },
  ].filter((r) => !(hideSame && r.same));

  const cell = 'border border-line px-4 py-3 text-right bg-white';
  const attrCell = 'border border-line px-4 py-3 text-right bg-surface font-semibold sticky start-0 z-[2] min-w-[150px]';

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-7 sm:px-6">
      <h1 className="mb-1 text-2xl font-extrabold">مقارنة المنتجات</h1>
      <p className="mb-5 text-sm text-muted">حتى ٤ منتجات جنباً إلى جنب — القيمة الأفضل في كل صف مميّزة بالأخضر.</p>

      <div className="mb-4 flex items-center gap-4">
        <label onClick={() => setHideSame((v) => !v)} className="flex cursor-pointer items-center gap-2.5 text-[13.5px]">
          <span className={['flex h-[17px] w-[17px] items-center justify-center rounded border text-[11px] text-white', hideSame ? 'border-green bg-green' : 'border-line'].join(' ')}>{hideSame && '✓'}</span>
          إخفاء المتشابه
        </label>
        <button onClick={clear} className="text-[13px] font-semibold text-star">مسح الكل</button>
      </div>

      <div className="overflow-x-auto pb-4">
        <table className="border-collapse text-sm">
          <thead>
            <tr>
              <th className={attrCell} />
              {cols.map((c) => (
                <th key={c.id} className="border border-line bg-white px-4 py-3 text-right align-top min-w-[170px]">
                  <div className="mb-2 h-20 rounded-lg bg-gradient-to-b from-[#eef1f0] to-[#e2e8e5]" />
                  {c.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.attr}>
                <td className={attrCell}>{r.attr}</td>
                {cols.map((c) => {
                  if (r.price) {
                    const win = numeric(c.from) === minPrice;
                    return (
                      <td key={c.id} className={[cell, win ? '!bg-green-tint font-semibold' : ''].join(' ')}>
                        <span dir="ltr" className="num text-lg font-semibold text-green">{c.from}</span> ر.س
                      </td>
                    );
                  }
                  const win = r.win?.(c) ?? false;
                  return (
                    <td key={c.id} className={[cell, win ? '!bg-green-tint font-semibold' : ''].join(' ')}>
                      {r.get?.(c)}
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr>
              <td className={attrCell} />
              {cols.map((c) => (
                <td key={c.id} className={cell}>
                  <button onClick={() => router.push(`/booking/${c.id}`)} className="rounded-field bg-green px-4 py-2 text-[13px] font-semibold text-white hover:bg-green-deep">احجز</button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
