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
  get?: (c: Product) => string | number;
  win?: (c: Product) => boolean;
};

/** Horizontal compare table: attribute column fixed, best value per row highlighted. */
export default function Compare() {
  const router = useRouter();
  const ids = useCompareStore((s) => s.ids);
  const toggle = useCompareStore((s) => s.toggle);
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
          description="أضف منتجات من صفحة البحث أو الرئيسية وستظهر هنا جنباً إلى جنب لمقارنة المواصفات والأسعار بدقة."
          actionLabel="تصفّح المنتجات الآن"
          onAction={() => router.push('/search')}
        />
      </div>
    );
  }

  const minPrice = Math.min(...cols.map((c) => numeric(c.from)));
  const maxBatt = Math.max(...cols.map((c) => numeric(c.battery)));

  const baseRows: Row[] = [
    { attr: 'أقل سعر متاح', price: true },
    { attr: 'العلامة التجارية', get: (c: Product) => c.brand },
    { attr: 'المعالج الرئيسي', get: (c: Product) => c.chip },
    { attr: 'الشاشة ومعدل التحديث', get: (c: Product) => c.screen },
    { attr: 'منظومة الكاميرات', get: (c: Product) => c.camera },
    { attr: 'سعة البطارية', get: (c: Product) => c.battery, win: (c: Product) => numeric(c.battery) === maxBatt },
    { attr: 'سعة التخزين', get: (c: Product) => c.storage },
    { attr: 'المتاجر المتوفرة', get: (c: Product) => `${c.stores} متاجر معتمدة` },
    { attr: 'أقصى توفير ممكن', get: (c: Product) => `وفر حتى ${c.diff} ر.س` },
  ];

  // Dynamic filter for "Hide identical rows"
  const rows = baseRows.filter((r) => {
    if (!hideSame || cols.length <= 1) return true;
    if (r.price) {
      return !cols.every((c) => numeric(c.from) === numeric(cols[0].from));
    }
    if (r.get) {
      const firstVal = r.get(cols[0]);
      return !cols.every((c) => r.get!(c) === firstVal);
    }
    return true;
  });

  const cell = 'border border-line px-4 py-3.5 text-right bg-white text-sm';
  const attrCell = 'border border-line px-4 py-3.5 text-right bg-surface font-bold sticky start-0 z-[2] min-w-[150px] sm:min-w-[170px] text-sm text-ink shadow-xs';

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-7 pb-28 sm:px-6">
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-ink sm:text-[28px]">مقارنة مواصفات وأسعار الهواتف</h1>
          <p className="mt-1 text-sm text-muted">
            قارن حتى ٤ هواتف ذكية جنباً إلى جنب — أفضل قيمة لكل ميزة مميّزة باللون الأخضر.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label
            onClick={() => setHideSame((v) => !v)}
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-line bg-paper px-3.5 py-2 text-xs font-semibold text-ink shadow-xs hover:border-green transition-colors"
          >
            <span
              className={`flex h-4 w-4 items-center justify-center rounded border text-[11px] text-white transition-colors ${
                hideSame ? 'border-green bg-green' : 'border-line'
              }`}
            >
              {hideSame && '✓'}
            </span>
            <span>إخفاء المتشابه</span>
          </label>
          <button
            type="button"
            onClick={clear}
            className="text-xs font-bold text-star hover:underline py-1 px-2"
          >
            مسح المقارنة
          </button>
        </div>
      </div>

      {/* Horizontal Scroll indicator on mobile */}
      <div className="mb-2 flex items-center justify-between text-xs text-muted sm:hidden">
        <span>اسحب أفقياً لتمرير الهواتف ←</span>
        <span className="font-bold text-ink">{cols.length} هواتف</span>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-line bg-paper shadow-soft pb-2">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className={attrCell}>
                <span className="text-xs font-bold text-muted uppercase">الهاتف / الميزة</span>
              </th>
              {cols.map((c) => (
                <th key={c.id} className="border border-line bg-white p-4 text-right align-top min-w-[190px] sm:min-w-[220px]">
                  <div className="relative">
                    {/* Remove column button */}
                    <button
                      type="button"
                      onClick={() => toggle(c.id)}
                      className="absolute end-0 top-0 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-surface text-xs font-bold text-muted hover:bg-star-tint hover:text-star transition-colors"
                      title={`إزالة ${c.name} من المقارنة`}
                      aria-label={`إزالة ${c.name}`}
                    >
                      ✕
                    </button>

                    <Link href={`/product/${c.id}`} className="group block">
                      <div className="relative mb-3 flex h-32 w-full items-center justify-center overflow-hidden rounded-xl bg-surface transition-colors group-hover:bg-[#eaf1ec]">
                        <Image
                          src={c.image}
                          alt={c.name}
                          fill
                          sizes="200px"
                          className="object-cover transition-transform duration-200 group-hover:scale-105"
                        />
                      </div>
                      <div className="text-[14.5px] font-bold text-ink transition-colors group-hover:text-green line-clamp-1">
                        {c.name}
                      </div>
                      <div className="text-xs text-muted mt-0.5">{c.brand}</div>
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.attr} className="hover:bg-surface/40 transition-colors">
                <td className={attrCell}>{r.attr}</td>
                {cols.map((c) => {
                  if (r.price) {
                    const win = numeric(c.from) === minPrice;
                    return (
                      <td key={c.id} className={`${cell} ${win ? '!bg-green-tint/70 font-bold' : ''}`}>
                        <div className="flex items-center gap-1.5">
                          <span dir="ltr" className="num text-lg font-black text-green">{c.from}</span>
                          <span className="text-xs text-muted">ر.س</span>
                          {win && (
                            <span className="rounded-full bg-green px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                              الأقل
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  }
                  const win = r.win?.(c) ?? false;
                  return (
                    <td key={c.id} className={`${cell} ${win ? '!bg-green-tint/70 font-bold text-green-deep' : ''}`}>
                      {r.get?.(c)}
                    </td>
                  );
                })}
              </tr>
            ))}
            {/* Booking action row */}
            <tr>
              <td className={attrCell}>إجراء الحجز</td>
              {cols.map((c) => (
                <td key={c.id} className={cell}>
                  <Link
                    href={`/booking/${c.id}`}
                    className="flex h-10 w-full items-center justify-center rounded-xl bg-green px-3 text-center text-xs font-bold text-white shadow-sm transition-colors hover:bg-green-deep active:scale-95"
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
