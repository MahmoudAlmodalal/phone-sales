'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Product, ProductColor } from '@/lib/mock-data';

export default function ProductInteractiveGallery({ product }: { product: Product }) {
  const defaultImage = product.image || product.gallery?.[0] || '/phones/iphone-15-pro-max.svg';
  const gallery = product.gallery && product.gallery.length > 0 ? product.gallery : [defaultImage];
  const colors = product.colors || [];

  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(
    colors.length > 0 ? colors[0] : null
  );
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const activeImage = gallery[activeIndex] || defaultImage;

  const handleSelectColor = (color: ProductColor) => {
    setSelectedColor(color);
    if (color.image) {
      const idx = gallery.findIndex((img) => img === color.image);
      if (idx !== -1) {
        setActiveIndex(idx);
      } else {
        // If the color image isn't directly in gallery, temporarily update or add
        setActiveIndex(0);
      }
    }
  };

  const handleSelectThumbnail = (index: number) => {
    setActiveIndex(index);
    const imgUrl = gallery[index];
    const matchingColor = colors.find((c) => c.image === imgUrl);
    if (matchingColor) {
      setSelectedColor(matchingColor);
    }
  };

  const nextImage = () => {
    handleSelectThumbnail((activeIndex + 1) % gallery.length);
  };

  const prevImage = () => {
    handleSelectThumbnail((activeIndex - 1 + gallery.length) % gallery.length);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Visual Gallery Card */}
      <div className="flex flex-col gap-4 rounded-[16px] border border-line bg-paper p-5 sm:p-6 shadow-soft sm:flex-row-reverse">
        {/* Main Large Display Canvas */}
        <div className="group relative flex flex-1 items-center justify-center overflow-hidden rounded-xl bg-surface min-h-[380px] sm:min-h-[440px]">
          <Image
            src={activeImage}
            alt={`${product.name} - ${selectedColor?.name || 'عرض الهاتف'}`}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 650px"
            className="object-cover transition-transform duration-300 group-hover:scale-105 cursor-zoom-in"
            onClick={() => setIsZoomOpen(true)}
          />

          {/* Quality & Original Guarantee Badge */}
          <div className="absolute start-3 top-3 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-green-deep shadow-sm backdrop-blur-md">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>أصلي ١٠٠٪ مع الضمان</span>
          </div>

          {/* Active Color Pill Badge */}
          {selectedColor && (
            <div className="absolute end-3 top-3 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-ink shadow-sm backdrop-blur-md">
              <span
                className="h-2.5 w-2.5 rounded-full border border-black/20"
                style={{ backgroundColor: selectedColor.hex }}
              />
              <span>{selectedColor.name}</span>
            </div>
          )}

          {/* Previous / Next Arrow Controls */}
          {gallery.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                aria-label="الصورة السابقة"
                className="absolute start-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink shadow-md backdrop-blur-md transition-all hover:bg-white hover:scale-110 active:scale-95"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                aria-label="الصورة التالية"
                className="absolute end-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink shadow-md backdrop-blur-md transition-all hover:bg-white hover:scale-110 active:scale-95"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </>
          )}

          {/* Image Counter & Zoom Action Button */}
          <div className="absolute bottom-3 start-3 flex items-center gap-2">
            <span className="rounded-full bg-black/60 px-3 py-0.5 text-[11px] font-bold text-white backdrop-blur-md">
              صورة {activeIndex + 1} من {gallery.length}
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomOpen(true);
            }}
            aria-label="تكبير الصورة"
            title="تكبير الصورة للمعاينة الكاملة"
            className="absolute bottom-3 end-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm backdrop-blur-md transition-all hover:bg-white hover:scale-110"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="11" y1="8" x2="11" y2="14" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
          </button>
        </div>

        {/* Gallery Thumbnails List */}
        <div className="flex gap-2.5 overflow-x-auto pb-1 sm:flex-col sm:overflow-visible">
          {gallery.map((img, i) => {
            const isCurrent = i === activeIndex;
            return (
              <button
                key={img + i}
                type="button"
                onClick={() => handleSelectThumbnail(i)}
                aria-label={`عرض الصورة رقم ${i + 1}`}
                className={`group relative h-[72px] w-[72px] shrink-0 cursor-pointer overflow-hidden rounded-xl border-2 transition-all duration-200 ${
                  isCurrent
                    ? 'border-green shadow-md ring-2 ring-green/20 scale-102'
                    : 'border-line bg-surface opacity-75 hover:opacity-100 hover:border-green/40'
                }`}
              >
                <Image
                  src={img}
                  alt={`${product.name} مصغر ${i + 1}`}
                  fill
                  sizes="72px"
                  className="object-cover transition-transform duration-200 group-hover:scale-110"
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Color Swatches Selector Card */}
      {colors.length > 0 && (
        <div className="rounded-[16px] border border-line bg-paper p-4 sm:p-5 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-muted">الألوان المتاحة:</span>
              {selectedColor && (
                <span className="text-xs font-extrabold text-ink bg-surface px-2.5 py-0.5 rounded-full border border-line">
                  {selectedColor.name}
                </span>
              )}
            </div>
            <span className="text-[11px] font-semibold text-green flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-green animate-pulse" />
              جميع الألوان متوفرة لدى المعارض
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {colors.map((c) => {
              const isSelected = selectedColor?.name === c.name;
              return (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => handleSelectColor(c)}
                  className={`group relative flex items-center gap-2 rounded-full border py-1.5 pe-3.5 ps-2 text-xs transition-all duration-200 ${
                    isSelected
                      ? 'border-green bg-green-tint/40 text-green-deep font-bold shadow-xs ring-2 ring-green/30'
                      : 'border-line bg-white hover:border-green/40 text-ink font-medium hover:bg-surface'
                  }`}
                  aria-pressed={isSelected}
                  aria-label={`اختيار لون ${c.name}`}
                >
                  <span
                    className="flex h-5 w-5 items-center justify-center rounded-full border border-black/20 shadow-xs transition-transform duration-200 group-hover:scale-110"
                    style={{ backgroundColor: c.hex }}
                  >
                    {isSelected && (
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={['#FEF08A', '#BAE6FD', '#FBCFE8', '#F8FAFC', '#E2E0D8', '#F5F5DC'].includes(c.hex) ? '#000000' : '#ffffff'}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </span>
                  <span>{c.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Lightbox / Zoom Fullscreen Modal */}
      {isZoomOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`تكبير صورة ${product.name}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-fade-in"
          onClick={() => setIsZoomOpen(false)}
        >
          <div
            className="relative flex flex-col items-center max-w-[900px] w-full max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsZoomOpen(false)}
              aria-label="إغلاق المعاينة"
              className="absolute -top-12 end-0 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* High-res Display Image */}
            <div className="relative w-full h-[65vh] sm:h-[75vh] rounded-2xl overflow-hidden bg-black/40">
              <Image
                src={activeImage}
                alt={product.name}
                fill
                sizes="900px"
                className="object-contain"
              />
            </div>

            {/* Zoom Bottom Bar */}
            <div className="mt-3 flex items-center justify-between w-full px-2 text-white/90 text-sm">
              <div className="font-bold">
                {product.name} {selectedColor && `— ${selectedColor.name}`}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-white/70">
                  صورة {activeIndex + 1} من {gallery.length}
                </span>
                <button
                  type="button"
                  onClick={prevImage}
                  className="rounded-lg bg-white/20 px-3 py-1 text-xs hover:bg-white/30"
                >
                  السابق
                </button>
                <button
                  type="button"
                  onClick={nextImage}
                  className="rounded-lg bg-white/20 px-3 py-1 text-xs hover:bg-white/30"
                >
                  التالي
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
