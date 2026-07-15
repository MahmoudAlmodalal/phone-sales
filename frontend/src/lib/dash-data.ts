/**
 * Mock seed data for the vendor + admin dashboards, ported 1:1 from the
 * Claude Design source (منصة-مقارنة-الأسعار.dc.html state). Replaced by real
 * APIs in later phases — pages copy these into local state and mutate there.
 */

export type VendorProduct = {
  id: string;
  name: string;
  brand: string;
  storage: string;
  price: number;
  stock: number;
  clicks: string;
  updated: string;
  stale: boolean;
  savedAt: string | null;
  active: boolean;
};

export type BookingStatus = 'active' | 'done' | 'cancel';

export type VendorBooking = {
  id: string;
  product: string;
  customer: string;
  when: string;
  status: BookingStatus;
  /** hours from "now" until the 24h hold expires (active rows only) */
  hoursLeft: number | null;
};

export type VendorReview = {
  id: string;
  name: string;
  product: string;
  stars: number;
  when: string;
  text: string;
  reply: string | null;
};

export type Severity = 'high' | 'med' | 'low';

export type VendorComplaint = {
  id: string;
  user: string;
  product: string;
  when: string;
  sev: Severity;
  text: string;
  status: 'open' | 'replied' | 'resolved';
  reply: string | null;
};

export type AdminJob = { id: string; name: string; ok: boolean; meta: string };

export type AdminUser = {
  id: string;
  name: string;
  type: 'بائع' | 'مستخدم';
  status: 'verified' | 'active' | 'pending' | 'suspended';
};

export type AdminReview = { id: string; text: string; product: string; booking: string };

export type FraudAlert = {
  id: string;
  store: string;
  type: 'hike' | 'dup' | 'spike';
  title: string;
  detail: string;
  delta: string;
  when: string;
  urgent: boolean;
  resolved: boolean;
};

export type PenaltyEntry = {
  id: string;
  store: string;
  action: string;
  detail: string;
  points: number;
  when: string;
};

export type AdminComplaint = {
  id: string;
  user: string;
  store: string;
  context: string;
  severity: Severity;
  status: 'open' | 'warned' | 'frozen' | 'hold';
};

export type AdminStore = {
  id: string;
  name: string;
  bookings: number;
  cancelRate: number;
  freq: string;
  risk: 'low' | 'med' | 'high';
  flags: number;
  status: 'clean' | 'flagged' | 'frozen';
  rating: number;
  since: string;
};

/** Western digits -> Arabic-Indic (matches the design's `ar()` helper). */
export const ar = (x: number | string) => String(x).replace(/[0-9]/g, (d) => '٠١٢٣٤٥٦٧٨٩'[+d]);

/** 4999 -> "4,999" */
export const fmt = (n: number) => n.toLocaleString('en-US');

export const LOW_STOCK_THRESHOLD = 5;
export const PRODUCTS_PER_PAGE = 3;

export const VENDOR_PRODUCTS: VendorProduct[] = [
  { id: 'v1', name: 'iPhone 15 Pro Max', brand: 'آبل', storage: '256GB', price: 4999, stock: 12, clicks: '1,204', updated: 'قبل ٣ د', stale: false, savedAt: null, active: true },
  { id: 'v2', name: 'Galaxy S24 Ultra', brand: 'سامسونج', storage: '512GB', price: 4299, stock: 7, clicks: '980', updated: 'قبل ٣ أيام', stale: true, savedAt: null, active: true },
  { id: 'v3', name: 'Xiaomi 14', brand: 'شاومي', storage: '256GB', price: 2499, stock: 20, clicks: '640', updated: 'قبل ٥ س', stale: false, savedAt: null, active: false },
  { id: 'v4', name: 'Redmi Note 13 Pro', brand: 'شاومي', storage: '128GB', price: 999, stock: 3, clicks: '1,510', updated: 'قبل ١ س', stale: false, savedAt: null, active: true },
];

export const VENDOR_BOOKINGS: VendorBooking[] = [
  { id: 'BK-7F42Q', product: 'iPhone 15 Pro Max', customer: 'عبدالله ا.', when: 'غداً ١٢–٢ م', status: 'active', hoursLeft: 3.5 },
  { id: 'BK-6620P', product: 'Galaxy S24', customer: 'سارة م.', when: 'اليوم ٤–٦ م', status: 'active', hoursLeft: 19 },
  { id: 'BK-8830M', product: 'Redmi Note 13 Pro', customer: 'نورة س.', when: 'اليوم ٨–٩ م', status: 'active', hoursLeft: 0.7 },
  { id: 'BK-5901K', product: 'Xiaomi 14', customer: 'فهد ع.', when: '—', status: 'done', hoursLeft: null },
  { id: 'BK-4410R', product: 'iPhone 15 Pro Max', customer: 'ماجد ط.', when: '—', status: 'cancel', hoursLeft: null },
];

export const VENDOR_REVIEWS: VendorReview[] = [
  { id: 'vr1', name: 'خالد المطيري', product: 'iPhone 15 Pro Max', stars: 5, when: 'استُلم ٤ يونيو', text: 'جهاز أصلي والسعر أقل من المعارض. الحجز وفّر عليّ التنقّل.', reply: 'شكراً خالد! سعداء بخدمتك ونتطلّع لزيارتك القادمة.' },
  { id: 'vr2', name: 'نورة العتيبي', product: 'Galaxy S24 Ultra', stars: 5, when: 'استُلم ٢٨ مايو', text: 'المتجر ملتزم بالسعر المعلن، والاستلام كان سريعاً.', reply: null },
  { id: 'vr3', name: 'سعد الدوسري', product: 'Xiaomi 14', stars: 4, when: 'استُلم ٢٢ مايو', text: 'كل شيء ممتاز، بس التغليف كان بسيطاً شوي.', reply: null },
  { id: 'vr4', name: 'ريم القحطاني', product: 'iPhone 15', stars: 3, when: 'استُلم ١٨ مايو', text: 'انتظرت وقتاً أطول من المتوقّع عند الاستلام.', reply: null },
  { id: 'vr5', name: 'فهد الحربي', product: 'iPhone 15 Pro Max', stars: 5, when: 'استُلم ١٢ مايو', text: 'تعامل راقٍ وأسعار منافسة، أنصح فيهم.', reply: 'يسعدنا رضاك يا فهد 🙏' },
];

export const VENDOR_COMPLAINTS: VendorComplaint[] = [
  { id: 'CMP-4102', user: 'ماجد العتيبي', product: 'iPhone 15 Pro Max', when: 'قبل ٣ ساعات', sev: 'high', text: 'السعر عند الاستلام كان أعلى من المعلن في الحجز بـ ١٥٠ ر.س.', status: 'open', reply: null },
  { id: 'CMP-4098', user: 'هند الشهري', product: 'Galaxy S24 Ultra', when: 'أمس', sev: 'med', text: 'تأخّر تجهيز الطلب أكثر من ساعة عن الموعد المحدّد.', status: 'open', reply: null },
  { id: 'CMP-4091', user: 'تركي الغامدي', product: 'Xiaomi 14', when: 'قبل ٣ أيام', sev: 'low', text: 'اللون المستلم مختلف قليلاً عن الصورة المعروضة.', status: 'resolved', reply: 'اعتذرنا للعميل وتم استبدال الوحدة باللون الصحيح.' },
];

export const VENDOR_COMPLAINTS_OPEN = VENDOR_COMPLAINTS.filter((c) => c.status !== 'resolved').length;

export const CHART_SETS: Record<string, { labels: string[]; data: number[] }> = {
  '7': { labels: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'], data: [6, 9, 5, 11, 8, 14, 10] },
  '30': { labels: ['أ١', 'أ٢', 'أ٣', 'أ٤', 'أ٥', 'أ٦', 'أ٧', 'أ٨', 'أ٩', 'أ١٠', 'أ١١', 'أ١٢'], data: [4, 6, 3, 8, 7, 10, 5, 9, 7, 12, 10, 14] },
  ytd: { labels: ['ينا', 'فبر', 'مار', 'أبر', 'ماي', 'يون', 'يول', 'أغس', 'سبت', 'أكت', 'نوف', 'ديس'], data: [210, 240, 198, 320, 280, 360, 410, 390, 300, 450, 420, 510] },
};

export const ADMIN_JOBS: AdminJob[] = [
  { id: 'j1', name: 'Scraper — إكسترا (تغيّرت بنية الصفحة)', ok: false, meta: 'آخر تشغيل ٠٢:١٤ · فشل — بانتظار إدخال يدوي' },
  { id: 'j2', name: 'API Sync — متجر التقنية', ok: true, meta: 'آخر تشغيل ٠٣:٠٠ · 1.2s' },
  { id: 'j3', name: 'API Sync — مكتبة جرير', ok: true, meta: 'آخر تشغيل ٠٣:٠٠ · 0.9s' },
  { id: 'j4', name: 'Cron — توليد Sitemap', ok: true, meta: 'آخر تشغيل ٠٣:٣٠ · 4.1s' },
  { id: 'j5', name: 'Cron — تنبيهات الأسعار', ok: true, meta: 'آخر تشغيل ٠٤:٠٠ · 2.6s' },
];

export const ADMIN_USERS: AdminUser[] = [
  { id: 'au1', name: 'متجر التقنية', type: 'بائع', status: 'verified' },
  { id: 'au2', name: 'عبدالله الشمري', type: 'مستخدم', status: 'active' },
  { id: 'au3', name: 'متجر النخبة', type: 'بائع', status: 'pending' },
  { id: 'au4', name: 'سارة المطيري', type: 'مستخدم', status: 'active' },
];

export const ADMIN_REVIEWS: AdminReview[] = [
  { id: 'ar1', text: '«جهاز أصلي والسعر ممتاز» — 5.0', product: 'iPhone 15 Pro Max', booking: 'BK-7F42Q' },
  { id: 'ar2', text: '«الاستلام كان سريعاً» — 4.0', product: 'Galaxy S24', booking: 'BK-6620P' },
  { id: 'ar3', text: '«السعر ارتفع بعد الحجز» — 2.0', product: 'Xiaomi 14', booking: 'BK-5901K' },
];

export const FRAUD_ALERTS: FraudAlert[] = [
  { id: 'f1', store: 'إكسترا', type: 'hike', title: 'رفع السعر فور تأكيد الحجز', detail: 'iPhone 15 Pro Max · ٤٬٩٩٩ ← ٥٬٤٩٩ ر.س خلال ٤ دقائق من تأكيد BK-7F42Q', delta: '+10%', when: 'قبل ٧ د', urgent: true, resolved: false },
  { id: 'f2', store: 'متجر النخبة', type: 'dup', title: 'حجوزات مكرّرة عبر حسابات متعددة', detail: '٦ حجوزات لنفس الوحدة من ٣ حسابات مرتبطة بجهاز واحد', delta: '×6', when: 'قبل ٣١ د', urgent: true, resolved: false },
  { id: 'f3', store: 'جوال ستور', type: 'spike', title: 'تذبذب سعري حاد خلال اليوم', detail: 'Galaxy S24 Ultra · تغيّر ٤ مرات بمدى ٪١٨ خلال ٦ ساعات', delta: '±18%', when: 'قبل ١ س', urgent: false, resolved: false },
];

export const FRAUD_URGENT_COUNT = FRAUD_ALERTS.filter((f) => f.urgent && !f.resolved).length;

/** penalty points recorded when an alert of this type is penalized */
export const FRAUD_POINTS: Record<FraudAlert['type'], number> = { hike: 15, dup: 20, spike: 5 };

export const PENALTY_LOG: PenaltyEntry[] = [
  { id: 'pl1', store: 'إكسترا', action: 'Automated Flag', detail: 'Store price mismatch detected — رفع بعد الحجز', points: 15, when: 'اليوم ٠٢:١٤' },
  { id: 'pl2', store: 'متجر النخبة', action: 'Automated Flag', detail: 'Duplicate booking pattern detected', points: 20, when: 'اليوم ٠١:٤٠' },
  { id: 'pl3', store: 'جوال ستور', action: 'تحذير آلي', detail: 'Price volatility above threshold', points: 5, when: 'أمس ٢٢:١٠' },
];

export const ADMIN_COMPLAINTS: AdminComplaint[] = [
  { id: 'CMP-3092', user: 'عبدالله الشمري', store: 'إكسترا', context: 'رُفع السعر عند الاستلام في الفرع — الحجز كان بسعر أقل من المطلوب فعلياً', severity: 'high', status: 'open' },
  { id: 'CMP-3088', user: 'سارة المطيري', store: 'متجر النخبة', context: 'المخزون المعروض غير حقيقي — الوحدة غير متوفرة عند الوصول', severity: 'high', status: 'open' },
  { id: 'CMP-3081', user: 'فهد القحطاني', store: 'جوال ستور', context: 'اختلاف بسيط في السعر النهائي عن المعلن (٢٪)', severity: 'low', status: 'open' },
  { id: 'CMP-3077', user: 'نورة العتيبي', store: 'مكتبة جرير', context: 'تأخّر تحديث حالة الطلب وسوء تواصل من المتجر', severity: 'med', status: 'hold' },
];

export const ADMIN_COMPLAINTS_OPEN = ADMIN_COMPLAINTS.filter((c) => c.status === 'open').length;

export const ADMIN_STORES: AdminStore[] = [
  { id: 'st1', name: 'متجر التقنية', bookings: 34, cancelRate: 4, freq: 'API · كل ١٥ د', risk: 'low', flags: 0, status: 'clean', rating: 4.7, since: '٢٠٢٢' },
  { id: 'st2', name: 'مكتبة جرير', bookings: 52, cancelRate: 6, freq: 'API · كل ٣٠ د', risk: 'low', flags: 0, status: 'clean', rating: 4.6, since: '٢٠٢١' },
  { id: 'st3', name: 'إكسترا', bookings: 41, cancelRate: 19, freq: 'Scraper · كل ساعة', risk: 'high', flags: 3, status: 'flagged', rating: 3.9, since: '٢٠٢٣' },
  { id: 'st4', name: 'متجر النخبة', bookings: 12, cancelRate: 33, freq: 'يدوي', risk: 'high', flags: 2, status: 'flagged', rating: 3.4, since: '٢٠٢٤' },
  { id: 'st5', name: 'جوال ستور', bookings: 27, cancelRate: 11, freq: 'Scraper · كل ٢ س', risk: 'med', flags: 1, status: 'clean', rating: 4.2, since: '٢٠٢٢' },
];
