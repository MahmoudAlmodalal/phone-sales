'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/mock-data';
import { useFavoritesStore } from '@/stores/favorites';
import { useCompareStore } from '@/stores/compare';
import ProductQuickViewModal from '@/components/ProductQuickViewModal';

/**
 * Product card shared across home / search / favorites.
 * - Authentic phone product illustration with smooth hover zoom
 * - Favorite heart with pure SVG vector
 * - Quick Preview ("معاينة سريعة") with interactive gallery and color switcher
 * - Color swatches indicator
 * - Price + 7-day change badge (green = drop, red = rise)
 * - Optional "add to compare" toggle
 */
export default function ProductCard({
  product,
  showCompare = false,
}: {
  product: Product;
  showCompare?: boolean;
}) {
  const isFav = useFavoritesStore((s) => s.ids.includes(product.id));
  const toggleFavorite = useFavoritesStore((s) => s.toggle);
  const inCompare = useCompareStore((s) => s.ids.includes(product.id));
  const toggleCompare = useCompareStore((s) => s.toggle);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const phoneImage = product.image || '/phones/iphone-15-pro-max.svg';

  return (
    <>
      <div className="group relative flex flex-col gap-2 rounded-card border border-line bg-paper p-4 transition-all duration-200 hover:border-green/50 hover:shadow-md">
        {/* Favorite Button (Expanded 44x44 touch target) */}
        <button
          onClick={() => toggleFavorite(product.id)}
          aria-label={isFav ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
          aria-pressed={isFav}
          className={[
            'absolute end-2.5 top-2.5 z-10 flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-200 active:scale-95',
            isFav
              ? 'border-green-tint bg-green-tint text-green shadow-xs'
              : 'border-line bg-white/90 text-muted hover:border-green/40 hover:text-green',
          ].join(' ')}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill={isFav ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Phone Image Canvas */}
        <div className="relative mb-1 flex h-48 w-full items-center justify-center overflow-hidden rounded-xl bg-surface transition-colors group-hover:bg-[#eaf1ec]">
          <Link
            href={`/product/${product.id}`}
            className="absolute inset-0 z-0"
            aria-label={`عرض مواصفات ${product.name}`}
          >
            <Image
              src={phoneImage}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Quick View Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsQuickViewOpen(true);
            }}
            className="absolute start-2.5 top-2.5 z-10 flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-ink shadow-xs backdrop-blur-md opacity-90 transition-all hover:bg-green hover:text-white hover:scale-105 active:scale-95"
            title="معاينة سريعة (الصور والألوان)"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span>معاينة سريعة</span>
          </button>

          <span className="pointer-events-none absolute bottom-2 start-2.5 rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-bold text-ink shadow-sm backdrop-blur-md">
            {product.brand}
          </span>
        </div>

        {/* Title */}
        <Link
          href={`/product/${product.id}`}
          className="line-clamp-1 text-[15px] font-bold leading-snug text-ink transition-colors hover:text-green"
        >
          {product.name}
        </Link>

        {/* Specs & Color Swatches Preview */}
        <div className="flex items-center justify-between text-xs text-muted">
          <div className="line-clamp-1">
            <span>{product.storage}</span> · <span>{product.chip.split(' ')[0]}</span>
          </div>
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1" title={`${product.colors.length} ألوان متاحة`}>
              {product.colors.slice(0, 3).map((c) => (
                <span
                  key={c.name}
                  className="h-2.5 w-2.5 rounded-full border border-black/20"
                  style={{ backgroundColor: c.hex }}
                />
              ))}
              {product.colors.length > 3 && (
                <span className="text-[10px] font-bold text-muted">+{product.colors.length - 3}</span>
              )}
            </div>
          )}
        </div>

        <div className="text-[11.5px] text-muted">أفضل سعر يبدأ من:</div>

      {/* Price & Change Badge */}
      <div className="flex items-baseline gap-2">
        <span dir="ltr" className="num text-[22px] font-extrabold text-ink">
          {product.from}
        </span>
        <span className="text-xs text-muted">ر.س</span>

        {product.drop ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-tint px-2 py-0.5 text-xs font-semibold text-green-deep">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="6 9 12 15 18 9" />
            </svg>
            <span>{product.drop}</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-star-tint px-2 py-0.5 text-xs font-semibold text-star">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="18 15 12 9 6 15" />
            </svg>
            <span>{product.rise}</span>
          </span>
        )}
      </div>

      <div className="text-xs text-muted">
        متوفر في {product.stores} متاجر · وفر حتى {product.diff} ر.س
      </div>

      {/* Compare Toggle (Accessible touch target) */}
      {showCompare && (
        <button
          type="button"
          onClick={() => toggleCompare(product.id)}
          className={[
            'mt-2 flex h-10 items-center justify-center gap-2 rounded-xl border text-xs font-bold transition-all active:scale-98',
            inCompare
              ? 'border-green bg-green text-white shadow-xs'
              : 'border-dashed border-line text-ink hover:border-green hover:text-green',
          ].join(' ')}
        >
          {inCompare ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>مضاف للمقارنة</span>
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              </svg>
              <span>أضف للمقارنة</span>
            </>
          )}
        </button>
      )}

      </div>

      {/* Quick View Modal */}
      <ProductQuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  );
}
