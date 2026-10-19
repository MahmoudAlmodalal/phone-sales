'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Product, ProductColor } from '@/lib/mock-data';

export default function ProductQuickViewModal({
  product,
  isOpen,
  onClose,
}: {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}) {
  const defaultImage = product.image || product.gallery?.[0] || '/phones/iphone-15-pro-max.svg';
  const gallery = product.gallery && product.gallery.length > 0 ? product.gallery : [defaultImage];
  const colors = product.colors || [];

  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(
    colors.length > 0 ? colors[0] : null
  );

  if (!isOpen) return null;

  const activeImage = gallery[activeIndex] || defaultImage;

  const handleSelectColor = (color: ProductColor) => {
    setSelectedColor(color);
    if (color.image) {
      const idx = gallery.findIndex((img) => img === color.image);
      if (idx !== -1) {
        setActiveIndex(idx);
      }
    }
  };

  const handleSelectThumbnail = (index: number) => {
    setActiveIndex(index);
    const imgUrl = gallery[index];
    const match = colors.find((c) => c.image === imgUrl);
    if (match) setSelectedColor(match);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`معاينة سريعة لـ ${product.name}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col md:flex-row max-w-[850px] w-full max-h-[90vh] overflow-y-auto rounded-3xl border border-line bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="إغلاق المعاينة"
          className="absolute start-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-surface text-ink hover:bg-star-tint hover:text-star transition-colors shadow-xs"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Visual Gallery Left / Top */}
        <div className="flex flex-col gap-3 p-5 sm:p-6 bg-surface/50 md:w-1/2 border-b md:border-b-0 md:border-e border-line">
          {/* Main Photo */}
          <div className="relative h-64 sm:h-72 w-full overflow-hidden rounded-2xl bg-white shadow-xs">
            <Image
              src={activeImage}
              alt={`${product.name} - ${selectedColor?.name || ''}`}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
            {selectedColor && (
              <span className="absolute bottom-2.5 start-2.5 flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-bold text-ink shadow-xs backdrop-blur-md">
                <span className="h-2 w-2 rounded-full border border-black/20" style={{ backgroundColor: selectedColor.hex }} />
                <span>{selectedColor.name}</span>
              </span>
            )}
            <span className="absolute top-2.5 end-2.5 rounded-full bg-green-tint px-2.5 py-0.5 text-[11px] font-bold text-green-deep">
              أصلي مع الضمان
            </span>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-2 overflow-x-auto py-1">
            {gallery.map((img, i) => (
              <button
                key={img + i}
                type="button"
                onClick={() => handleSelectThumbnail(i)}
                className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                  i === activeIndex
                    ? 'border-green ring-2 ring-green/20 scale-102'
                    : 'border-line opacity-75 hover:opacity-100'
                }`}
              >
                <Image src={img} alt={`${product.name} ${i + 1}`} fill sizes="56px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details Right / Bottom */}
        <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
          <div>
            <div className="text-xs font-bold text-muted mb-1">{product.brand}</div>
            <h2 className="text-xl sm:text-2xl font-black text-ink">{product.name}</h2>

            {/* Price section */}
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-xs text-muted">يبدأ من:</span>
              <span dir="ltr" className="num text-2xl font-extrabold text-green">
                {product.from}
              </span>
              <span className="text-xs text-muted">ر.س</span>
              {product.drop && (
                <span className="rounded-full bg-green-tint px-2 py-0.5 text-xs font-bold text-green-deep">
                  انخفاض {product.drop}
                </span>
              )}
            </div>

            <div className="mt-1 text-xs text-muted">
              معروض في <span className="font-bold text-ink">{product.stores}</span> متاجر معتمدة · وفر حتى <span className="font-bold text-ink">{product.diff} ر.س</span>
            </div>

            {/* Color Switcher */}
            {colors.length > 0 && (
              <div className="mt-4 pt-3 border-t border-line">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-muted">اختر اللون:</span>
                  {selectedColor && (
                    <span className="text-xs font-bold text-ink">{selectedColor.name}</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {colors.map((c) => {
                    const isSelected = selectedColor?.name === c.name;
                    return (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => handleSelectColor(c)}
                        className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-all ${
                          isSelected
                            ? 'border-green bg-green-tint/50 text-green-deep font-bold ring-2 ring-green/20'
                            : 'border-line bg-surface hover:border-green/40 text-ink'
                        }`}
                      >
                        <span className="h-3 w-3 rounded-full border border-black/20" style={{ backgroundColor: c.hex }} />
                        <span>{c.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quick Specs Pills */}
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-xl border border-line bg-surface/70 p-2.5">
                <span className="block text-[10.5px] text-muted">المعالج</span>
                <span className="font-bold text-ink line-clamp-1">{product.chip}</span>
              </div>
              <div className="rounded-xl border border-line bg-surface/70 p-2.5">
                <span className="block text-[10.5px] text-muted">الشاشة</span>
                <span className="font-bold text-ink line-clamp-1">{product.screen}</span>
              </div>
              <div className="rounded-xl border border-line bg-surface/70 p-2.5">
                <span className="block text-[10.5px] text-muted">البطارية</span>
                <span className="font-bold text-ink line-clamp-1">{product.battery}</span>
              </div>
              <div className="rounded-xl border border-line bg-surface/70 p-2.5">
                <span className="block text-[10.5px] text-muted">سعة التخزين</span>
                <span className="font-bold text-ink">{product.storage}</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-6 flex items-center gap-3 pt-4 border-t border-line">
            <Link
              href={`/booking/${product.id}`}
              className="flex-1 flex h-11 items-center justify-center rounded-xl bg-green text-xs font-bold text-white shadow-xs hover:bg-green-deep transition-colors"
              onClick={onClose}
            >
              احجز بأفضل سعر الآن ←
            </Link>
            <Link
              href={`/product/${product.id}`}
              className="flex h-11 items-center justify-center rounded-xl border border-line bg-surface px-4 text-xs font-bold text-ink hover:border-green hover:text-green transition-colors"
              onClick={onClose}
            >
              كامل المواصفات
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
