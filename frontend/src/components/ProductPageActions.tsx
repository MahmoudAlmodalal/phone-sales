'use client';

import { useRouter } from 'next/navigation';
import { useFavoritesStore } from '@/stores/favorites';
import { useCompareStore } from '@/stores/compare';

export default function ProductPageActions({ productId }: { productId: string }) {
  const router = useRouter();
  const isFav = useFavoritesStore((s) => s.ids.includes(productId));
  const toggleFavorite = useFavoritesStore((s) => s.toggle);
  const inCompare = useCompareStore((s) => s.ids.includes(productId));
  const toggleCompare = useCompareStore((s) => s.toggle);

  return (
    <>
      <button
        onClick={() => router.push(`/booking/${productId}`)}
        className="mb-2 w-full rounded-field border-[1.5px] border-green py-3 text-sm font-semibold text-green hover:bg-green-tint"
      >
        احجز مسبقاً
      </button>
      <div className="flex gap-2.5">
        <button
          onClick={() => toggleFavorite(productId)}
          className={[
            'flex flex-1 items-center justify-center gap-1.5 rounded-field border py-2.5 text-[13px]',
            isFav ? 'border-green-tint bg-green-tint text-green' : 'border-line text-ink hover:border-green hover:text-green',
          ].join(' ')}
        >♥ مفضلة</button>
        <button
          onClick={() => toggleCompare(productId)}
          className={[
            'flex flex-1 items-center justify-center gap-1.5 rounded-field border py-2.5 text-[13px]',
            inCompare ? 'border-green bg-green text-white' : 'border-line text-ink hover:border-green hover:text-green',
          ].join(' ')}
        >⇄ قارن</button>
      </div>
    </>
  );
}
