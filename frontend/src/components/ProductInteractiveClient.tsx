'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Product, Store } from '@/lib/mock-data';
import { useFavoritesStore } from '@/stores/favorites';
import { useCompareStore } from '@/stores/compare';
import { useToastStore } from '@/stores/toast';

import ProductInteractiveGallery from '@/components/ProductInteractiveGallery';

export { ProductInteractiveGallery as ProductGallery };

export function PriceHistoryChart({ lowest }: { lowest: string }) {
  const [period, setPeriod] = useState<'30' | '90' | '365'>('30');

  const curves = {
    '30': {
      dArea: 'M0 60 L75 72 L150 55 L225 95 L300 80 L375 120 L450 105 L525 140 L600 130 L600 200 L0 200 Z',
      dLine: 'M0 60 L75 72 L150 55 L225 95 L300 80 L375 120 L450 105 L525 140 L600 130',
      point: { cx: 150, cy: 55 },
      note: 'أدنى سعر مسجّل في آخر ٣٠ يوماً',
    },
    '90': {
      dArea: 'M0 80 L100 65 L200 85 L300 50 L400 90 L500 110 L600 120 L600 200 L0 200 Z',
      dLine: 'M0 80 L100 65 L200 85 L300 50 L400 90 L500 110 L600 120',
      point: { cx: 300, cy: 50 },
      note: 'أدنى سعر مسجّل في آخر ٩٠ يوماً',
    },
    '365': {
      dArea: 'M0 100 L120 70 L240 60 L360 85 L480 125 L600 140 L600 200 L0 200 Z',
      dLine: 'M0 100 L120 70 L240 60 L360 85 L480 125 L600 140',
      point: { cx: 240, cy: 60 },
      note: 'أدنى سعر تاريخي خلال السنة',
    },
  };

  const current = curves[period];

  return (
    <div>
      <div className="mb-3.5 flex gap-1.5">
        {[
          ['30', '٣٠ يوماً'],
          ['90', '٩٠ يوماً'],
          ['365', 'سنة كاملة'],
        ].map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setPeriod(key as '30' | '90' | '365')}
            className={`rounded-lg border px-3.5 py-1.5 text-xs font-bold transition-all ${
              period === key
                ? 'border-ink bg-ink text-white shadow-sm'
                : 'border-line bg-paper text-ink hover:border-green'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="relative overflow-hidden rounded-xl border border-line/60 bg-surface/40 p-2">
        <svg viewBox="0 0 600 200" width="100%" height="180" preserveAspectRatio="none" aria-label="رسم بياني لتاريخ السعر">
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="1">
              <stop offset="0%" stopColor="#007A3D" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#007A3D" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <line x1="0" y1="90" x2="600" y2="90" stroke="#DDE3E0" strokeDasharray="5 5" />
          <path d={current.dArea} fill="url(#chartGradient)" className="transition-all duration-300" />
          <path d={current.dLine} fill="none" stroke="#007A3D" strokeWidth="3" className="transition-all duration-300" />
          <circle cx={current.point.cx} cy={current.point.cy} r="5" fill="#CE1126" stroke="#FFFFFF" strokeWidth="2" />
        </svg>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className="font-semibold text-ink">
          {current.note}: <b dir="ltr" className="num text-green font-extrabold">{lowest}</b> ر.س
        </span>
        <span className="text-xs text-muted">مقارنة بمتوسط أسعار المتاجر الرسمية</span>
      </div>
    </div>
  );
}

export function PriceAlertBox({ defaultPrice }: { defaultPrice: string }) {
  const [target, setTarget] = useState(defaultPrice);
  const [active, setActive] = useState(false);
  const pushToast = useToastStore((s) => s.push);

  const handleToggle = () => {
    if (!active) {
      setActive(true);
      pushToast(`تم تفعيل التنبيه! سنرسل إشعاراً فور انخفاض السعر تحت ${target} ر.س ✓`);
    } else {
      setActive(false);
      pushToast('تم إيقاف تنبيه السعر لهذا الهاتف.');
    }
  };

  return (
    <div className="mt-5 rounded-card border border-green/30 bg-green-tint/50 p-4 shadow-soft">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-base">🔔</span>
        <h4 className="text-sm font-extrabold text-ink">تنبيه انخفاض السعر الذكي</h4>
      </div>
      <p className="text-xs text-muted mb-3 leading-relaxed">
        أدخل السعر الذي يناسبك، وسنرسل لك إشعاراً فور توفره في أي متجر معتمد.
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[140px]">
          <input
            type="text"
            dir="ltr"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="h-10 w-full rounded-field border border-line bg-paper px-3 pe-9 text-xs font-bold text-ink outline-none focus:border-green"
            placeholder="مثال: 4,500"
          />
          <span className="pointer-events-none absolute inset-y-0 end-2.5 flex items-center text-xs text-muted">
            ر.س
          </span>
        </div>
        <button
          type="button"
          onClick={handleToggle}
          className={`h-10 rounded-field px-4 text-xs font-bold transition-all shadow-sm ${
            active
              ? 'bg-ink text-white hover:bg-black'
              : 'bg-green text-white hover:bg-green-deep'
          }`}
        >
          {active ? 'التنبيه مفعّل ✓' : 'فعّل التنبيه الآن'}
        </button>
      </div>
    </div>
  );
}

export function ProductDesktopSidebar({
  product,
  bestStore,
}: {
  product: Product;
  bestStore: Store;
}) {
  const isFav = useFavoritesStore((s) => s.ids.includes(product.id));
  const toggleFavorite = useFavoritesStore((s) => s.toggle);
  const inCompare = useCompareStore((s) => s.ids.includes(product.id));
  const toggleCompare = useCompareStore((s) => s.toggle);
  const pushToast = useToastStore((s) => s.push);

  const handleAffiliateClick = () => {
    pushToast(`جاري تحويلك إلى ${bestStore.name} بأفضل سعر معتمد...`);
  };

  return (
    <aside className="hidden rounded-2xl border border-line bg-paper p-6 shadow-soft md:sticky md:top-20 md:block">
      <div className="text-xs font-semibold text-muted">أفضل سعر متاح الآن في السوق:</div>
      <div dir="ltr" className="num mt-1 text-[38px] font-black leading-tight text-green">
        {product.from} <span className="text-sm font-bold text-muted">ر.س</span>
      </div>
      <div className="mb-4 mt-1 flex items-center gap-1.5 text-xs text-muted">
        <span className="h-2 w-2 rounded-full bg-green" />
        <span>{bestStore.name} · {bestStore.avail}</span>
      </div>

      {/* Primary Affiliate Store CTA */}
      <button
        type="button"
        onClick={handleAffiliateClick}
        className="mb-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-green text-sm font-bold text-white shadow-md transition-colors hover:bg-green-deep active:scale-98"
      >
        <span>اذهب إلى المتجر</span>
        <span>↗</span>
      </button>
      <p className="mb-4 text-center text-[11px] leading-4 text-muted">
        قد نحصل على عمولة من هذا الرابط. السعر لا يتغيّر عليك.
      </p>

      {/* Outlined Pre-order Reservation CTA */}
      <Link
        href={`/booking/${product.id}`}
        className="mb-3.5 flex h-11 w-full items-center justify-center rounded-xl border-[1.5px] border-green bg-white text-xs font-bold text-green transition-colors hover:bg-green-tint active:bg-green-tint/80"
      >
        احجز مسبقاً وثبّت السعر (دفع بالمعرض)
      </Link>

      {/* Action Buttons: Favorite & Compare */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-line">
        <button
          type="button"
          onClick={() => toggleFavorite(product.id)}
          className={`flex h-10 items-center justify-center gap-1.5 rounded-lg border text-xs font-bold transition-colors ${
            isFav
              ? 'border-green-tint bg-green-tint text-green shadow-xs'
              : 'border-line text-ink hover:border-green hover:text-green'
          }`}
          aria-pressed={isFav}
        >
          <span>{isFav ? '♥ بالمفضلة' : '♡ مفضلة'}</span>
        </button>

        <button
          type="button"
          onClick={() => toggleCompare(product.id)}
          className={`flex h-10 items-center justify-center gap-1.5 rounded-lg border text-xs font-bold transition-colors ${
            inCompare
              ? 'border-green bg-green text-white shadow-xs'
              : 'border-line text-ink hover:border-green hover:text-green'
          }`}
          aria-pressed={inCompare}
        >
          <span>{inCompare ? '✓ بالمقارنة' : '⇄ قارن'}</span>
        </button>
      </div>
    </aside>
  );
}

export function ProductMobileStickyBar({
  product,
}: {
  product: Product;
}) {
  const isFav = useFavoritesStore((s) => s.ids.includes(product.id));
  const toggleFavorite = useFavoritesStore((s) => s.toggle);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-4 py-3 pb-safe shadow-xl backdrop-blur-md md:hidden">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[11px] text-muted">أقل سعر الآن:</div>
          <div className="flex items-baseline gap-1">
            <span dir="ltr" className="num text-xl font-black text-green">
              {product.from}
            </span>
            <span className="text-xs text-muted">ر.س</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggleFavorite(product.id)}
            className={`flex h-11 w-11 items-center justify-center rounded-xl border text-base transition-colors ${
              isFav ? 'border-green-tint bg-green-tint text-green' : 'border-line text-muted hover:text-green'
            }`}
            aria-label={isFav ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
          >
            {isFav ? '♥' : '♡'}
          </button>
          <Link
            href={`/booking/${product.id}`}
            className="flex h-11 items-center justify-center rounded-xl bg-green px-5 text-sm font-bold text-white shadow-md active:bg-green-deep transition-colors"
          >
            احجز وثبّت السعر الآن
          </Link>
        </div>
      </div>
    </div>
  );
}
