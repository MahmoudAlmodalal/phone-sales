'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/mock-data';
import { useFavoritesStore } from '@/stores/favorites';
import { useCompareStore } from '@/stores/compare';

/**
 * Product card shared across home / search / favorites.
 * - Authentic phone product illustration with smooth hover zoom
 * - Favorite heart with pure SVG vector
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

  const phoneImage = product.image || '/phones/iphone-15-pro-max.svg';

  return (
    <div className="group relative flex flex-col gap-2 rounded-card border border-line bg-paper p-4 transition-all duration-200 hover:border-green/50 hover:shadow-md">
      {/* Favorite Button */}
      <button
        onClick={() => toggleFavorite(product.id)}
        aria-label={isFav ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
        aria-pressed={isFav}
        className={[
          'absolute end-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200',
          isFav
            ? 'border-green-tint bg-green-tint text-green shadow-sm'
            : 'border-line bg-white/90 text-muted hover:border-green/40 hover:text-green',
        ].join(' ')}
      >
        <svg
          width="17"
          height="17"
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
      <Link
        href={`/product/${product.id}`}
        className="relative mb-1 flex h-48 w-full items-center justify-center overflow-hidden rounded-xl bg-surface transition-colors group-hover:bg-[#eaf1ec]"
      >
        <Image
          src={phoneImage}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute bottom-2 start-2.5 rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-bold text-ink shadow-sm backdrop-blur-md">
          {product.brand}
        </span>
      </Link>

      {/* Title */}
      <Link
        href={`/product/${product.id}`}
        className="line-clamp-1 text-[15px] font-bold leading-snug text-ink transition-colors hover:text-green"
      >
        {product.name}
      </Link>

      {/* Specs Pill */}
      <div className="line-clamp-1 text-xs text-muted">
        <span>{product.storage}</span> · <span>{product.chip.split(' ')[0]}</span>
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

      {/* Compare Toggle */}
      {showCompare && (
        <button
          onClick={() => toggleCompare(product.id)}
          className={[
            'mt-2 flex items-center justify-center gap-2 rounded-field border py-2 text-xs font-semibold transition-colors',
            inCompare
              ? 'border-green bg-green text-white shadow-sm'
              : 'border-dashed border-line text-ink hover:border-green hover:text-green',
          ].join(' ')}
        >
          {inCompare ? (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>مضاف للمقارنة</span>
            </>
          ) : (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              </svg>
              <span>أضف للمقارنة</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
