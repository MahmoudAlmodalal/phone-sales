import { Fragment } from 'react';
import Link from 'next/link';
import { getProduct, getProductStores } from '@/lib/api';
import RatingBar from '@/components/RatingBar';
import Badge from '@/components/Badge';
import {
  ProductGallery,
  PriceHistoryChart,
  PriceAlertBox,
  ProductDesktopSidebar,
  ProductMobileStickyBar,
} from '@/components/ProductInteractiveClient';

const REVIEWS = [
  { name: 'خالد م. (الرياض)', when: 'تمّ الاستلام في ٤ يونيو', text: 'جهاز أصلي مع الضمان والسعر أقل من معارض السوق بـ ٤٢٠ ريال. الحجز السريع وفّر عليّ عناء البحث.' },
  { name: 'نورة العتيبي (جدة)', when: 'تمّ الاستلام في ٢٨ مايو', text: 'المتجر ملتزم تماماً بالسعر المثبّت في الموقع، والاستلام من المعرض كان في أقل من ١٠ دقائق.' },
  { name: 'فيصل الشمري (الدمام)', when: 'تمّ الاستلام في ١٥ مايو', text: 'منصة ممتازة جداً لمقارنة العروض وتحديثات الأسعار اللحظية وفرت لي الكثير في جهاز Ultra.' },
];

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-5 rounded-2xl border border-line bg-paper p-5 shadow-soft sm:p-6">
      <h3 className="mb-4 text-lg font-extrabold text-ink">{title}</h3>
      {children}
    </section>
  );
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  const stores = await getProductStores(slug);
  const bestStore = stores[0] || {
    name: 'متجر التقنية',
    price: product.from,
    avail: 'متوفر فوراً',
    inStock: true,
  };

  const specGroups = [
    {
      group: 'الشاشة والعرض',
      rows: [
        ['نوع الشاشة', product.screen || '6.7 بوصة OLED 120Hz'],
        ['معدل التحديث', '120Hz ديناميكي سلس'],
        ['مقاومة الماء والغبار', 'IP68 بمعيار رسمي (حتى 6 أمتار لمدة 30 دقيقة)'],
      ],
    },
    {
      group: 'الأداء والعتاد',
      rows: [
        ['المعالج الرئيسي', product.chip],
        ['سعة التخزين', product.storage || '256GB'],
        ['دعم الشبكات', '5G / Dual SIM / eSIM'],
      ],
    },
    {
      group: 'منظومة التصوير',
      rows: [
        ['الكاميرا الأساسية', product.camera || '48 ميجابكسل فائقة الدقة'],
        ['تسجيل الفيديو', '4K بدقة 60 إطار / ثانية مع تثبيت بصري'],
      ],
    },
    {
      group: 'البطارية والطاقة',
      rows: [
        ['سعة البطارية', product.battery],
        ['الشحن السريع', 'شحن سلكي سريع + شحن لاسلكي Qi / MagSafe'],
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6 pb-36 sm:px-6">
      {/* Breadcrumb Navigation */}
      <nav className="mb-4 text-xs font-semibold text-muted" aria-label="مسار التصفح">
        <Link href="/" className="hover:text-green">الرئيسية</Link>
        <span className="mx-1.5 text-line">/</span>
        <Link href={`/search?brand=${encodeURIComponent(product.brand)}`} className="hover:text-green">
          {product.brand}
        </Link>
        <span className="mx-1.5 text-line">/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-[1fr_380px]">
        {/* Main Content Column */}
        <div className="min-w-0">
          {/* Interactive Product Gallery */}
          <ProductGallery product={product} />

          {/* Title, Brand & Savings Badge */}
          <div className="mt-6 flex flex-wrap items-baseline justify-between gap-3">
            <div>
              <h1 className="text-2xl font-extrabold text-ink sm:text-[28px]">{product.name}</h1>
              <div className="mt-1 text-xs text-muted">
                العلامة التجارية: <span className="font-bold text-ink">{product.brand}</span> · معروض في {product.stores} متاجر معتمدة
              </div>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-green-tint px-3.5 py-1 text-xs font-bold text-green-deep">
              <span>وفر حتى {product.diff} ر.س</span>
            </div>
          </div>

          {/* Mobile Price Summary Card (Visible only on mobile before tables) */}
          <div className="mt-4 flex items-center justify-between rounded-xl border border-green/30 bg-green-tint/50 p-4 md:hidden">
            <div>
              <span className="text-xs text-muted block">أفضل سعر متاح:</span>
              <span dir="ltr" className="num text-2xl font-black text-green">
                {product.from} <span className="text-xs text-muted font-normal">ر.س</span>
              </span>
            </div>
            <Link
              href={`/booking/${product.id}`}
              className="flex h-10 items-center justify-center rounded-lg bg-green px-4 text-xs font-bold text-white shadow-sm active:bg-green-deep"
            >
              احجز الآن ←
            </Link>
          </div>


          {/* Stores Pricing Table */}
          <Block title="الأسعار حسب المتجر (محدّثة لحظياً)">
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-line text-xs text-muted">
                    <th className="px-3 py-2.5 text-right font-semibold">المتجر</th>
                    <th className="px-3 py-2.5 text-right font-semibold">السعر</th>
                    <th className="px-3 py-2.5 text-right font-semibold">حالة التوفر</th>
                    <th className="px-3 py-2.5 text-right font-semibold">التوصيل والضمان</th>
                    <th className="px-3 py-2.5 text-right font-semibold">آخر تحديث</th>
                    <th className="px-3 py-2.5" />
                  </tr>
                </thead>
                <tbody>
                  {stores.map((s) => (
                    <tr
                      key={s.name}
                      className={`border-b border-line transition-colors ${
                        s.best ? 'bg-green-tint/50' : 'hover:bg-surface/50'
                      } ${!s.inStock ? 'text-muted' : ''}`}
                    >
                      <td className="px-3 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-ink">{s.name}</span>
                          {s.best && (
                            <span className="rounded-full bg-green px-2 py-0.5 text-[10.5px] font-bold text-white shadow-xs">
                              أقل سعر
                            </span>
                          )}
                        </div>
                      </td>
                      <td dir="ltr" className="num px-3 py-3.5 text-[15px] font-extrabold text-ink">
                        {s.price} <span className="text-xs font-normal text-muted">ر.س</span>
                      </td>
                      <td className="px-3 py-3.5 text-xs">
                        <span className={s.inStock ? 'font-semibold text-green' : 'text-muted'}>
                          {s.avail}
                        </span>
                      </td>
                      <td className="px-3 py-3.5 text-xs text-muted">
                        {s.delivery}
                      </td>
                      <td dir="ltr" className="num px-3 py-3.5 text-xs text-muted">
                        {s.updated}
                      </td>
                      <td className="px-3 py-3.5 text-left">
                        <Link
                          href={`/booking/${product.id}`}
                          className="inline-flex h-9 items-center gap-1 rounded-lg bg-green px-3.5 text-xs font-bold text-white transition-colors hover:bg-green-deep shadow-xs active:scale-95"
                        >
                          <span>احجز</span>
                          <span>←</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Block>

          {/* Interactive Price History Chart */}
          <Block title="تاريخ وتذبذب السعر">
            <PriceHistoryChart lowest={product.lowest} />
          </Block>

          {/* Price Alert Box */}
          <PriceAlertBox defaultPrice={product.lowest} />

          {/* Specifications Accordion/Table */}
          <Block title="المواصفات التقنية الكاملة">
            <div className="overflow-hidden rounded-xl border border-line">
              <table className="w-full border-collapse text-sm">
                <tbody>
                  {specGroups.map((g) => (
                    <Fragment key={g.group}>
                      <tr>
                        <td colSpan={2} className="bg-green-tint/80 px-4 py-2.5 font-heading text-[13px] font-bold text-green-deep border-b border-line">
                          {g.group}
                        </td>
                      </tr>
                      {g.rows.map(([k, v], i) => (
                        <tr key={g.group + k} className={i % 2 ? 'bg-surface/50' : 'bg-paper'}>
                          <td className="w-[38%] border-b border-line px-4 py-2.5 text-xs font-semibold text-muted">{k}</td>
                          <td className="border-b border-line px-4 py-2.5 text-xs font-medium text-ink">{v}</td>
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </Block>

          {/* Verified Reviews */}
          <Block title="تقييمات موثّقة من مشترين حقيقيين">
            <div className="mb-3 flex items-center gap-3">
              <RatingBar value={4.8} count={142} />
            </div>
            <p className="mb-4 text-xs text-muted leading-relaxed">
              تُقبل التقييمات حصرياً من العملاء الذين أتموا حجز واستلام الجهاز عبر المنصة لضمان الشفافية وموثوقية الأسعار.
            </p>
            <div className="flex flex-col gap-3">
              {REVIEWS.map((r) => (
                <div key={r.name} className="rounded-xl border border-line/70 bg-surface/40 p-4 text-sm">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="font-bold text-ink">{r.name}</span>
                    <Badge variant="verified">حجز واستلام موثّق ✓</Badge>
                    <span className="ms-auto text-xs text-muted">{r.when}</span>
                  </div>
                  <p className="text-muted text-xs leading-relaxed">{r.text}</p>
                </div>
              ))}
            </div>
          </Block>
        </div>

        {/* Desktop Sticky Booking Sidebar */}
        <ProductDesktopSidebar product={product} bestStore={bestStore} />
      </div>

      {/* Mobile Sticky Bottom CTA */}
      <ProductMobileStickyBar product={product} />
    </div>
  );
}
