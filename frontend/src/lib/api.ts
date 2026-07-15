/**
 * Typed data client — shaped like the real Phase 05 catalog API
 * (plans/05-catalog-api.md) so pages can be wired to `fetch(NEXT_PUBLIC_API_URL)`
 * later without touching call sites. For this frontend-only phase every
 * function resolves from local mock data instead of a network call.
 */
import { PRODUCTS, STORES, CATEGORIES, byDrop, byPrice, findProduct, type Product, type Store, type Category } from './mock-data';

function ok<T>(data: T): Promise<T> {
  return Promise.resolve(data);
}

export async function getHome() {
  return ok({
    drops: [...PRODUCTS].sort(byDrop).slice(0, 4),
    categories: CATEGORIES,
    mostCompared: PRODUCTS.slice(0, 4),
    trust: [
      ['١٤٢', 'متجراً مشاركاً'],
      ['٨٬٤٠٠', 'منتجاً متتبَّعاً'],
      ['١٫٢م', 'نقطة سعر مسجّلة'],
    ] as const,
  });
}

export type ProductSort = 'low' | 'drop' | 'compared' | 'new';

export async function getProducts(params: { sort?: ProductSort } = {}) {
  const list = [...PRODUCTS];
  if (params.sort === 'low') list.sort(byPrice);
  else if (params.sort === 'drop') list.sort(byDrop);
  return ok(list);
}

export async function getProduct(id: string): Promise<Product> {
  return ok(findProduct(id));
}

export async function getProductStores(id: string): Promise<Store[]> {
  void id; // real API will scope stores by product id; mock data is shared for now
  return ok(STORES);
}

export async function suggest(query: string): Promise<Product[]> {
  if (!query.trim()) return ok([]);
  const q = query.toLowerCase();
  return ok(PRODUCTS.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 4));
}

export type { Product, Store, Category };
