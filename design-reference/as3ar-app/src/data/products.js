/**
 * Shared product catalogue — the single source of truth for the customer-facing
 * screens (home, search, product, compare, booking). Mirrors the dataset used
 * in the interactive prototype so both artifacts stay in parity.
 *
 * Prices are in SAR (ر.س). `drop` / `rise` are the 7-day change; exactly one is
 * set per product.
 */
export const PRODUCTS = [
  { id: 'p1', name: 'iPhone 15 Pro Max', brand: 'آبل', from: '4,999', p2: '5,120', drop: '3.2%', rise: null, stores: 9, diff: '420', chip: 'A17 Pro', battery: '4,441 ملّي أمبير', lowest: '4,650' },
  { id: 'p2', name: 'Galaxy S24 Ultra', brand: 'سامسونج', from: '4,299', p2: '4,410', drop: '4.1%', rise: null, stores: 8, diff: '380', chip: 'Snapdragon 8 Gen 3', battery: '5,000 ملّي أمبير', lowest: '4,050' },
  { id: 'p3', name: 'iPhone 15', brand: 'آبل', from: '3,199', p2: '3,290', drop: '2.4%', rise: null, stores: 7, diff: '230', chip: 'A16 Bionic', battery: '3,349 ملّي أمبير', lowest: '3,050' },
  { id: 'p4', name: 'Galaxy S24', brand: 'سامسونج', from: '2,899', p2: '2,970', drop: '1.8%', rise: null, stores: 7, diff: '190', chip: 'Exynos 2400', battery: '4,000 ملّي أمبير', lowest: '2,780' },
  { id: 'p5', name: 'Xiaomi 14', brand: 'شاومي', from: '2,499', p2: '2,560', drop: '5.0%', rise: null, stores: 6, diff: '210', chip: 'Snapdragon 8 Gen 3', battery: '4,610 ملّي أمبير', lowest: '2,350' },
  { id: 'p6', name: 'Google Pixel 8', brand: 'جوجل', from: '2,699', p2: '2,650', drop: null, rise: '1.2%', stores: 5, diff: '160', chip: 'Tensor G3', battery: '4,575 ملّي أمبير', lowest: '2,590' },
  { id: 'p7', name: 'OnePlus 12', brand: 'ون بلس', from: '2,999', p2: '3,080', drop: '3.6%', rise: null, stores: 5, diff: '240', chip: 'Snapdragon 8 Gen 3', battery: '5,400 ملّي أمبير', lowest: '2,820' },
  { id: 'p8', name: 'Redmi Note 13 Pro', brand: 'شاومي', from: '999', p2: '1,040', drop: '6.4%', rise: null, stores: 8, diff: '120', chip: 'Snapdragon 7s Gen 2', battery: '5,100 ملّي أمبير', lowest: '930' },
]

/** Stores offering a given product, cheapest first (per spec's dynamic table). */
export const STORES = [
  { name: 'متجر التقنية', price: '4,999', avail: 'متوفر', inStock: true, updated: 'قبل ٣ د', best: true },
  { name: 'مكتبة جرير', price: '5,120', avail: 'متوفر', inStock: true, updated: 'قبل ١٢ د', best: false },
  { name: 'إكسترا', price: '5,199', avail: 'متوفر', inStock: true, updated: 'قبل ٢٥ د', best: false },
  { name: 'جوال ستور', price: '5,250', avail: 'قطعة أخيرة', inStock: true, updated: 'قبل ١ س', best: false },
  { name: 'أسواق المتقدمة', price: '5,419', avail: 'غير متوفر', inStock: false, updated: 'قبل ٤ س', best: false },
]

export const CATEGORIES = [
  { icon: '🍎', label: 'آبل' },
  { icon: '📱', label: 'سامسونج' },
  { icon: '⚡', label: 'شاومي' },
  { icon: '🅶', label: 'جوجل' },
  { icon: '➊', label: 'ون بلس' },
  { icon: '🌸', label: 'هواوي' },
]

export const numeric = (price) => parseFloat(String(price).replace(/,/g, ''))

export const byDrop = (a, b) => parseFloat(b.drop || 0) - parseFloat(a.drop || 0)
export const byPrice = (a, b) => numeric(a.from) - numeric(b.from)
