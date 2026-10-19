/**
 * Shared product catalogue — populated with high-resolution, professional
 * smartphone photography and studio renders for portfolio presentation.
 */

export type ProductColor = {
  name: string;
  hex: string;
};

export type Product = {
  id: string;
  name: string;
  brand: string;
  image: string;
  gallery: string[];
  colors: ProductColor[];
  from: string;
  p2: string;
  drop: string | null;
  rise: string | null;
  stores: number;
  diff: string;
  chip: string;
  battery: string;
  screen: string;
  camera: string;
  storage: string;
  lowest: string;
};

export type Store = {
  name: string;
  price: string;
  avail: string;
  inStock: boolean;
  updated: string;
  best: boolean;
  delivery: string;
  rating: number;
};

export type Category = {
  id: string;
  label: string;
  brand: string;
  count: number;
};

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'iPhone 15 Pro Max',
    brand: 'آبل',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/IPhone_15_pro_max.png/800px-IPhone_15_pro_max.png',
    ],
    colors: [
      { name: 'تيتانيوم طبيعي', hex: '#9C958E' },
      { name: 'تيتانيوم أزرق', hex: '#2A3442' },
      { name: 'تيتانيوم أسود', hex: '#262524' },
      { name: 'تيتانيوم أبيض', hex: '#E2E0D8' },
    ],
    from: '4,999',
    p2: '5,120',
    drop: '3.2%',
    rise: null,
    stores: 9,
    diff: '420',
    chip: 'Apple A17 Pro (3nm)',
    battery: '4,441 ملّي أمبير (شحن 25W)',
    screen: '6.7 بوصة Super Retina XDR OLED 120Hz',
    camera: '48 + 12 + 12 ميجابكسل (زووم بصري 5x)',
    storage: '256GB',
    lowest: '4,650',
  },
  {
    id: 'p2',
    name: 'Galaxy S24 Ultra',
    brand: 'سامسونج',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Samsung_Galaxy_S24_Ultra.jpg/800px-Samsung_Galaxy_S24_Ultra.jpg',
    gallery: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Samsung_Galaxy_S24_Ultra.jpg/800px-Samsung_Galaxy_S24_Ultra.jpg',
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80',
    ],
    colors: [
      { name: 'تيتانيوم رمادي', hex: '#52525B' },
      { name: 'تيتانيوم أسود', hex: '#27272A' },
      { name: 'تيتانيوم بنفسجي', hex: '#4C1D95' },
      { name: 'تيتانيوم أصفر', hex: '#CA8A04' },
    ],
    from: '4,299',
    p2: '4,410',
    drop: '4.1%',
    rise: null,
    stores: 8,
    diff: '380',
    chip: 'Snapdragon 8 Gen 3 for Galaxy',
    battery: '5,000 ملّي أمبير (شحن 45W)',
    screen: '6.8 بوصة Dynamic AMOLED 2X 120Hz مسطحة',
    camera: '200 + 50 + 12 + 10 ميجابكسل (زووم رقمي 100x)',
    storage: '256GB',
    lowest: '4,050',
  },
  {
    id: 'p3',
    name: 'iPhone 15',
    brand: 'آبل',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80',
    ],
    colors: [
      { name: 'أزرق سماوي', hex: '#BAE6FD' },
      { name: 'وردي ناعم', hex: '#FBCFE8' },
      { name: 'أصفر مشرق', hex: '#FEF08A' },
      { name: 'أسود فحمي', hex: '#27272A' },
    ],
    from: '3,199',
    p2: '3,290',
    drop: '2.4%',
    rise: null,
    stores: 7,
    diff: '230',
    chip: 'Apple A16 Bionic (4nm)',
    battery: '3,349 ملّي أمبير',
    screen: '6.1 بوصة Super Retina XDR OLED',
    camera: '48 + 12 ميجابكسل (مع خاصية تقريب 2x)',
    storage: '128GB',
    lowest: '3,050',
  },
  {
    id: 'p4',
    name: 'Galaxy S24',
    brand: 'سامسونج',
    image: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=800&q=80',
    ],
    colors: [
      { name: 'أسود أونيكس', hex: '#27272A' },
      { name: 'رمادي رخامي', hex: '#A1A1AA' },
      { name: 'بنفسجي كوبالت', hex: '#6D28D9' },
    ],
    from: '2,899',
    p2: '2,970',
    drop: '1.8%',
    rise: null,
    stores: 7,
    diff: '190',
    chip: 'Exynos 2400 Deca-Core',
    battery: '4,000 ملّي أمبير (شحن 25W)',
    screen: '6.2 بوصة Dynamic AMOLED 2X 120Hz',
    camera: '50 + 10 + 12 ميجابكسل',
    storage: '256GB',
    lowest: '2,780',
  },
  {
    id: 'p5',
    name: 'Xiaomi 14',
    brand: 'شاومي',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02560?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02560?auto=format&fit=crop&w=800&q=80',
    ],
    colors: [
      { name: 'أخضر يشمي', hex: '#065F46' },
      { name: 'أسود كلاسيكي', hex: '#18181B' },
      { name: 'أبيض لؤلؤي', hex: '#F8FAFC' },
    ],
    from: '2,499',
    p2: '2,560',
    drop: '5.0%',
    rise: null,
    stores: 6,
    diff: '210',
    chip: 'Snapdragon 8 Gen 3',
    battery: '4,610 ملّي أمبير (شحن سريع 90W)',
    screen: '6.36 بوصة LTPO OLED 120Hz سطوع 3000nits',
    camera: '50 + 50 + 50 ميجابكسل بعدسات Leica Summilux',
    storage: '512GB',
    lowest: '2,350',
  },
  {
    id: 'p6',
    name: 'Google Pixel 8',
    brand: 'جوجل',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Google_Pixel_8_Rose_rear.jpg/800px-Google_Pixel_8_Rose_rear.jpg',
    gallery: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Google_Pixel_8_Rose_rear.jpg/800px-Google_Pixel_8_Rose_rear.jpg',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
    ],
    colors: [
      { name: 'وردي (Rose)', hex: '#FECDD3' },
      { name: 'رمادي بندقي (Hazel)', hex: '#84947C' },
      { name: 'سبجي (Obsidian)', hex: '#1C1917' },
    ],
    from: '2,699',
    p2: '2,650',
    drop: null,
    rise: '1.2%',
    stores: 5,
    diff: '160',
    chip: 'Google Tensor G3 مع شريحة Titan M2',
    battery: '4,575 ملّي أمبير (شحن سريع)',
    screen: '6.2 بوصة Actua OLED 120Hz',
    camera: '50 + 12 ميجابكسل مع معالجة الذكاء الاصطناعي',
    storage: '256GB',
    lowest: '2,590',
  },
  {
    id: 'p7',
    name: 'OnePlus 12',
    brand: 'ون بلس',
    image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80',
    ],
    colors: [
      { name: 'أخضر زمردي', hex: '#0F5132' },
      { name: 'أسود حريري', hex: '#18181B' },
    ],
    from: '2,999',
    p2: '3,080',
    drop: '3.6%',
    rise: null,
    stores: 5,
    diff: '240',
    chip: 'Snapdragon 8 Gen 3',
    battery: '5,400 ملّي أمبير (شحن خارق 100W)',
    screen: '6.82 بوصة ProXDR 2K LTPO 120Hz سطوع 4500nits',
    camera: '50 + 64 + 48 ميجابكسل بالتعاون مع Hasselblad',
    storage: '512GB',
    lowest: '2,820',
  },
  {
    id: 'p8',
    name: 'Redmi Note 13 Pro',
    brand: 'شاومي',
    image: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=800&q=80',
    ],
    colors: [
      { name: 'أرجواني ليلي', hex: '#4C1D95' },
      { name: 'أسود منتصف الليل', hex: '#09090B' },
      { name: 'أزرق محيطي', hex: '#0284C7' },
    ],
    from: '999',
    p2: '1,040',
    drop: '6.4%',
    rise: null,
    stores: 8,
    diff: '120',
    chip: 'Snapdragon 7s Gen 2 (4nm)',
    battery: '5,100 ملّي أمبير (شحن توربو 67W)',
    screen: '6.67 بوصة AMOLED 1.5K 120Hz حواف فائقة النحافة',
    camera: '200 ميجابكسل فائق الدقة مع تثبيت بصري OIS',
    storage: '256GB',
    lowest: '930',
  },
  {
    id: 'p9',
    name: 'iPhone 15 Pro',
    brand: 'آبل',
    image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80',
    ],
    colors: [
      { name: 'تيتانيوم أسود', hex: '#262524' },
      { name: 'تيتانيوم طبيعي', hex: '#9C958E' },
      { name: 'تيتانيوم أبيض', hex: '#E2E0D8' },
    ],
    from: '4,199',
    p2: '4,290',
    drop: '2.8%',
    rise: null,
    stores: 8,
    diff: '310',
    chip: 'Apple A17 Pro (3nm)',
    battery: '3,274 ملّي أمبير',
    screen: '6.1 بوصة Super Retina XDR OLED 120Hz ProMotion',
    camera: '48 + 12 + 12 ميجابكسل (زووم 3x)',
    storage: '128GB',
    lowest: '3,990',
  },
  {
    id: 'p10',
    name: 'Galaxy Z Fold 5',
    brand: 'سامسونج',
    image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80',
    ],
    colors: [
      { name: 'أزرق جليدي', hex: '#60A5FA' },
      { name: 'أسود فانتوم', hex: '#18181B' },
      { name: 'بيج كلاسيكي', hex: '#F5F5DC' },
    ],
    from: '5,799',
    p2: '5,999',
    drop: '5.2%',
    rise: null,
    stores: 6,
    diff: '450',
    chip: 'Snapdragon 8 Gen 2 for Galaxy',
    battery: '4,400 ملّي أمبير',
    screen: '7.6 بوصة قابلة للطي Dynamic AMOLED 2X 120Hz',
    camera: '50 + 12 + 10 ميجابكسل',
    storage: '512GB',
    lowest: '5,450',
  },
  {
    id: 'p11',
    name: 'Honor Magic 6 Pro',
    brand: 'هونر',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80',
    ],
    colors: [
      { name: 'أخضر أبيقور', hex: '#0D9488' },
      { name: 'أسود كلاسيكي', hex: '#18181B' },
    ],
    from: '3,699',
    p2: '3,850',
    drop: '3.9%',
    rise: null,
    stores: 6,
    diff: '290',
    chip: 'Snapdragon 8 Gen 3',
    battery: '5,600 ملّي أمبير سيليكون-كربون (شحن 80W)',
    screen: '6.8 بوصة LTPO OLED حماية NanoCrystal Shield',
    camera: '180 ميجابكسل بيريسكوب + 50 + 50 ميجابكسل',
    storage: '512GB',
    lowest: '3,490',
  },
  {
    id: 'p12',
    name: 'Huawei Pura 70',
    brand: 'هواوي',
    image: 'https://images.unsplash.com/photo-1567581935884-3349723552ca?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1567581935884-3349723552ca?auto=format&fit=crop&w=800&q=80',
    ],
    colors: [
      { name: 'أبيض ثلجي', hex: '#F8FAFC' },
      { name: 'أسود ليلي', hex: '#0F172A' },
    ],
    from: '3,299',
    p2: '3,399',
    drop: '2.1%',
    rise: null,
    stores: 5,
    diff: '220',
    chip: 'Kirin 9010 الثماني النواة',
    battery: '4,900 ملّي أمبير (شحن 66W)',
    screen: '6.6 بوصة LTPO OLED زجاج Kunlun Glass 2',
    camera: '50 + 12 + 13 ميجابكسل XMAGE فائقة الإضاءة',
    storage: '256GB',
    lowest: '3,150',
  },
];

/** Stores offering a given product, sorted by price ascending */
export const STORES: Store[] = [
  { name: 'متجر التقنية', price: '4,999', avail: 'متوفر فوراً', inStock: true, updated: 'قبل ٣ د', best: true, delivery: 'استلام فوري / شحن خلال ٢٤ ساعة', rating: 4.9 },
  { name: 'مكتبة جرير', price: '5,120', avail: 'متوفر', inStock: true, updated: 'قبل ١٢ د', best: false, delivery: 'توصيل مجاني خلال يومين', rating: 4.8 },
  { name: 'إكسترا', price: '5,199', avail: 'متوفر في المعرض', inStock: true, updated: 'قبل ٢٥ د', best: false, delivery: 'استلام من أقرب فرع', rating: 4.7 },
  { name: 'جوال ستور', price: '5,250', avail: 'آخر قطعتين', inStock: true, updated: 'قبل ١ س', best: false, delivery: 'شحن سريع نفس اليوم', rating: 4.6 },
  { name: 'أسواق المتقدمة', price: '5,419', avail: 'نفدت الكمية', inStock: false, updated: 'قبل ٤ س', best: false, delivery: 'إعادة التوفر قريباً', rating: 4.5 },
];

export const CATEGORIES: Category[] = [
  { id: 'apple', label: 'آبل (Apple)', brand: 'آبل', count: 4 },
  { id: 'samsung', label: 'سامسونج (Samsung)', brand: 'سامسونج', count: 3 },
  { id: 'xiaomi', label: 'شاومي (Xiaomi)', brand: 'شاومي', count: 2 },
  { id: 'google', label: 'جوجل (Google)', brand: 'جوجل', count: 1 },
  { id: 'oneplus', label: 'ون بلس (OnePlus)', brand: 'ون بلس', count: 1 },
  { id: 'honor', label: 'هونر (Honor)', brand: 'هونر', count: 1 },
];

export const numeric = (price: string | number) => parseFloat(String(price).replace(/,/g, ''));

export const byDrop = (a: Product, b: Product) => parseFloat(b.drop || '0') - parseFloat(a.drop || '0');
export const byPrice = (a: Product, b: Product) => numeric(a.from) - numeric(b.from);

export function findProduct(id: string): Product {
  return PRODUCTS.find((p) => p.id === id) || PRODUCTS[0];
}
