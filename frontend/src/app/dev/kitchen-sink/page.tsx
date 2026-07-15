'use client';

import ProductCard from '@/components/ProductCard';
import Badge from '@/components/Badge';
import Skeleton from '@/components/Skeleton';
import RatingBar from '@/components/RatingBar';
import Countdown from '@/components/Countdown';
import EmptyState from '@/components/EmptyState';
import Star from '@/components/Star';
import { PRODUCTS } from '@/lib/mock-data';

/**
 * Storybook-less component catalogue — every shared component in every
 * state, kept out of the production build's nav (not linked anywhere).
 */
export default function KitchenSink() {
  return (
    <div className="mx-auto max-w-[1200px] space-y-10 px-6 py-10">
      <h1 className="text-2xl font-extrabold">Kitchen Sink — /dev only</h1>

      <section>
        <h2 className="mb-3 text-lg font-bold">ProductCard</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <ProductCard product={PRODUCTS[0]} />
          <ProductCard product={PRODUCTS[5]} showCompare />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold">Badge</h2>
        <div className="flex flex-wrap gap-3">
          <Badge variant="drop">▼ 4.1%</Badge>
          <Badge variant="rise">▲ 1.2%</Badge>
          <Badge variant="neutral">مكتمل</Badge>
          <Badge variant="verified">موثّق</Badge>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold">Skeleton</h2>
        <div className="flex gap-3">
          <Skeleton className="h-24 w-24" />
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-6 w-24" />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold">RatingBar (never stars)</h2>
        <RatingBar value={4.6} count={87} />
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold">Countdown</h2>
        <Countdown seconds={23 * 3600 + 12 * 60 + 33} />
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold">EmptyState</h2>
        <EmptyState title="لا نتائج" description="جرّب تعديل الفلاتر." actionLabel="مسح الفلاتر" onAction={() => {}} />
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold">Star (booking steps + verified badge only)</h2>
        <div className="flex items-center gap-4 text-star">
          <Star size={28} filled />
          <Star size={28} filled={false} className="text-line" />
        </div>
      </section>
    </div>
  );
}
