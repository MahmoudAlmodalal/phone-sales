'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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

  // If visitor arrives at /compare with no items selected, default to comparing top 3 flagship phones
  const effectiveIds = ids.length > 0 ? ids : ['p1', 'p2', 'p3'];

  const cols = effectiveIds
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));

  if (cols.length === 0) {
    return (
      <div className="mx-auto max-w-[1200px] px-6 py-16">
        <EmptyState
          title="لم تختر أي منتج للمقارنة بعد"
          description="أضف منتجات من صفحة البحث وستظهر هنا جنباً إلى جنب لمقارنة المواصفات والأسعار."
          actionLabel="تصفّح المنتجات الآن"
          onAction={() => router.push('/search')}
        />
      </div>
    );
  }

  const minPrice = Math.min(...cols.map((c) => numeric(c.from)));
  const maxBatt = Math.max(...cols.map((c) => numeric(c.battery)));

  const rows: Row[] = [
    { attr: 'أقل سعر متاح', price: true, same: false },
    { attr: 'العلامة التجارية', get: (c: Product) => c.brand, same: false },
    { attr: 'المعالج الرئيسي', get: (c: Product) => c.chip, same: false },
    { attr: 'الشاشة ومعدل التحديث', get: (c: Product) => c.screen, same: false },
    { attr: 'منظومة الكاميرات', get: (c: Product) => c.camera, same: false },
    { attr: 'سعة البطارية', get: (c: Product) => c.battery, win: (c: Product) => numeric(c.battery) === maxBatt, same: false },
    { attr: 'سعة التخزين', get: (c: Product) => c.storage, same: false },
    { attr: 'المتاجر المتوفرة', get: (c: Product) => `${c.stores} متاجر معتمدة`, same: false },
    { attr: 'أقصى توفير ممكن', get: (c: Product) => `وفر حتى ${c.diff} ر.س`, same: false },
  ].filter((r: Row) => !(hideSame && r.same));

  const cell = 'border border-line px-4 py-3.5 text-right bg-white text-sm';
  const attrCell = 'border border-line px-4 py-3.5 text-right bg-surface font-bold sticky start-0 z-[2] min-w-[160px] text-sm text-ink';

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-7 sm:px-6">
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-ink">مقارنة مواصفات وأسعار الهواتف</h1>
          <p className="mt-1 text-sm text-muted">قارن حتى ٤ هواتف ذكية جنباً إلى جنب — أفضل قيمة لكل ميزة مميّزة باللون الأخضر.</p>
        </div>
        <div className="flex items-center gap-3">
          <label onClick={() => setHideSame((v) => !v)} className="flex cursor-pointer items-center gap-2 rounded-lg border border-line bg-paper px-3 py-1.5 text-xs font-semibold">
            <span className={`flex h-4 w-4 items-center justify-center rounded border text-[11px] text-white ${hideSame ? 'border-green bg-green' : 'border-line'}`}>
              {hideSame && '✓'}
            </span>
            <span>إخفاء المتشابه</span>
          </label>
          <button onClick={clear} className="text-xs font-bold text-star hover:underline">
            مسح المقارنة
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-card border border-line bg-paper shadow-soft pb-2">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className={attrCell}>
                <span className="text-xs text-muted">الهاتف / الميزة</span>
              </th>
              {cols.map((c) => (
                <th key={c.id} className="border border-line bg-white p-4 text-right align-top min-w-[200px]">
                  <Link href={`/product/${c.id}`} className="group block">
                    <div className="relative mb-3 flex h-36 w-full items-center justify-center overflow-hidden rounded-xl bg-surface transition-colors group-hover:opacity-90">
                      <Image
                        src={c.image}
                        alt={c.name}
                        fill
                        className="object-cover transition-transform duration-200 group-hover:scale-105"
                      />
                    </div>
                    <div className="text-[15px] font-bold text-ink group-hover:text-green">{c.name}</div>
                    <div className="text-xs text-muted">{c.brand}</div>
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.attr} className="hover:bg-surface/30">
                <td className={attrCell}>{r.attr}</td>
                {cols.map((c) => {
                  if (r.price) {
                    const win = numeric(c.from) === minPrice;
                    return (
                      <td key={c.id} className={`${cell} ${win ? '!bg-green-tint/60 font-bold' : ''}`}>
                        <div className="flex items-center gap-1.5">
                          <span dir="ltr" className="num text-lg font-black text-green">{c.from}</span>
                          <span className="text-xs text-muted">ر.س</span>
                          {win && <span className="rounded-full bg-green px-2 py-0.5 text-[10.5px] font-bold text-white">الأقل</span>}
                        </div>
                      </td>
                    );
                  }
                  const win = r.win?.(c) ?? false;
                  return (
                    <td key={c.id} className={`${cell} ${win ? '!bg-green-tint/60 font-semibold text-green-deep' : ''}`}>
                      {r.get?.(c)}
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr>
              <td className={attrCell}>إجراء الحجز</td>
              {cols.map((c) => (
                <td key={c.id} className={cell}>
                  <Link
                    href={`/booking/${c.id}`}
                    className="block w-full rounded-field bg-green py-2 text-center text-xs font-bold text-white transition-colors hover:bg-green-deep shadow-sm"
                  >
                    احجز الآن ←
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
