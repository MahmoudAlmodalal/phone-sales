'use client';

import { PRODUCTS } from '@/lib/mock-data';
import ProductCard from '@/components/ProductCard';
import EmptyState from '@/components/EmptyState';
import { useFavoritesStore } from '@/stores/favorites';

export default function Favorites() {
  const ids = useFavoritesStore((s) => s.ids);
  const items = ids.map((id) => PRODUCTS.find((p) => p.id === id)).filter((p): p is NonNullable<typeof p> => Boolean(p));

  if (items.length === 0) {
    return <EmptyState title="لسّه ما تابعت أي جوال" description="تابع واحداً ومنخبرك أول ما ينزل سعره." />;
  }
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {items.map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
