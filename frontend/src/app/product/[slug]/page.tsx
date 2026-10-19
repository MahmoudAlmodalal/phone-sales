import { Fragment } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getProduct, getProductStores } from '@/lib/api';
import RatingBar from '@/components/RatingBar';
import Badge from '@/components/Badge';
import ProductPageActions from '@/components/ProductPageActions';

const REVIEWS = [
  { name: 'خالد م. (الرياض)', when: 'تمّ الاستلام في ٤ يونيو', text: 'جهاز أصلي مع الضمان والسعر أقل من معارض السوق بـ ٤٢٠ ريال. الحجز السريع وفّر عليّ عناء البحث.' },
  { name: 'نورة العتيبي (جدة)', when: 'تمّ الاستلام في ٢٨ مايو', text: 'المتجر ملتزم تماماً بالسعر المثبّت في الموقع، والاستلام من المعرض كان في أقل من ١٠ دقائق.' },
  { name: 'فيصل الشمري (الدمام)', when: 'تمّ الاستلام في ١٥ مايو', text: 'منصة ممتازة جداً لمقارنة العروض وتحديثات الأسعار اللحظية وفرت لي الكثير في جهاز Ultra.' },
];

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-5 rounded-card border border-line bg-paper p-5 shadow-soft">
      <h3 className="mb-4 text-lg font-extrabold text-ink">{title}</h3>
      {children}
    </section>
  );
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  const stores = await getProductStores(slug);

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

  const phoneImage = product.image || '/phones/iphone-15-pro-max.svg';
  const gallery = product.gallery && product.gallery.length > 0 ? product.gallery : [phoneImage];

  return (
    <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-start gap-8 px-4 py-6 pb-28 sm:px-6 md:grid-cols-[1fr_400px]">
      <div>
        {/* Breadcrumb */}
        <nav className="mb-4 text-[13px] text-muted" aria-label="مسار التصفح">
          <Link href="/" className="hover:text-green">الرئيسية</Link>
          <span className="mx-1.5">/</span>
          <Link href="/search" className="hover:text-green">{product.brand}</Link>
          <span className="mx-1.5">/</span>
          <span className="text-ink font-semibold">{product.name}</span>
        </nav>

        {/* Product Visual Gallery Card */}
        <div className="flex flex-col gap-5 rounded-[14px] border border-line bg-paper p-6 shadow-soft sm:flex-row-reverse">
          {/* Main Large Display Canvas */}
          <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-xl bg-surface min-h-[380px]">
            <Image
              src={phoneImage}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 600px"
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
            <div className="absolute start-3 top-3 rounded-full bg-white/90 px-3.5 py-1 text-xs font-bold text-green-deep shadow-sm backdrop-blur-md">
              أصلي ١٠٠٪ مع الضمان
            </div>
          </div>

          {/* Gallery Thumbnails */}
          <div className="flex gap-2.5 sm:flex-col">
            {gallery.map((img, i) => (
              <div
                key={img + i}
                className={`relative h-[68px] w-[68px] cursor-pointer overflow-hidden rounded-lg border transition-all ${
                  i === 0 ? 'border-2 border-green shadow-sm ring-2 ring-green/20' : 'border-line opacity-80 hover:opacity-100 hover:border-green/50'
                }`}
              >
                <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Title & Brand */}
        <div className="mt-6 flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h1 className="text-[28px] font-extrabold text-ink">{product.name}</h1>
            <div className="mt-1 text-sm text-muted">
              العلامة التجارية: <span className="font-semibold text-ink">{product.brand}</span> · معروض في {product.stores} متاجر معتمدة
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-green-tint px-3 py-1 text-xs font-bold text-green-deep">
            <span>وفر حتى {product.diff} ر.س</span>
          </div>
        </div>

        {/* Colors Swatches */}
        {product.colors && product.colors.length > 0 && (
          <div className="mt-4 flex items-center gap-3 rounded-card border border-line bg-paper p-3.5 shadow-soft">
            <span className="text-xs font-bold text-muted">الألوان المتاحة:</span>
            <div className="flex flex-wrap items-center gap-2">
              {product.colors.map((c) => (
                <div key={c.name} className="flex items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-1 text-xs">
                  <span className="h-3.5 w-3.5 rounded-full border border-black/15" style={{ backgroundColor: c.hex }} />
                  <span className="font-medium text-ink">{c.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stores Pricing Table */}
        <Block title="الأسعار حسب المتجر (محدّثة لحظياً)">
          <div className="overflow-x-auto">
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
                  <tr key={s.name} className={`border-b border-line transition-colors ${s.best ? 'bg-green-tint/50' : 'hover:bg-surface/50'} ${!s.inStock ? 'text-muted' : ''}`}>
                    <td className="px-3 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-ink">{s.name}</span>
                        {s.best && (
                          <span className="rounded-full bg-green px-2 py-0.5 text-[11px] font-bold text-white shadow-sm">
                            أقل سعر
                          </span>
                        )}
                      </div>
                    </td>
                    <td dir="ltr" className="num px-3 py-3.5 text-[16px] font-extrabold text-ink">
                      {s.price} <span className="text-xs font-normal text-muted">ر.س</span>
                    </td>
                    <td className="px-3 py-3.5 text-[13px]">
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
                        className="inline-flex items-center gap-1 rounded-field bg-green px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-green-deep shadow-sm"
                      >
                        <span>احجز الآن</span>
                        <span>←</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Block>

        {/* Price History Chart */}
        <Block title="تاريخ وتذبذب السعر">
          <div className="mb-3.5 flex gap-1.5">
            {['٣٠ يوماً', '٩٠ يوماً', 'سنة كاملة'].map((t, i) => (
              <button
                key={t}
                className={`rounded-[7px] border px-3 py-1.5 text-[12.5px] font-semibold transition-colors ${
                  i === 0 ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink hover:border-green'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="relative rounded-lg border border-line/60 bg-surface/30 p-2">
            <svg viewBox="0 0 600 200" width="100%" height="200" preserveAspectRatio="none" aria-label="رسم بياني لتاريخ السعر">
              <defs>
                <linearGradient id="gg" x1="0%" y1="0%" x2="0%" y2="1">
                  <stop offset="0%" stopColor="#007A3D" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#007A3D" stopOpacity="0" />
                </linearGradient>
              </defs>
              <line x1="0" y1="90" x2="600" y2="90" stroke="#DDE3E0" strokeDasharray="5 5" />
              <path d="M0 60 L75 72 L150 55 L225 95 L300 80 L375 120 L450 105 L525 140 L600 130 L600 200 L0 200 Z" fill="url(#gg)" />
              <path d="M0 60 L75 72 L150 55 L225 95 L300 80 L375 120 L450 105 L525 140 L600 130" fill="none" stroke="#007A3D" strokeWidth="3" />
              <circle cx="150" cy="55" r="5" fill="#CE1126" stroke="#FFFFFF" strokeWidth="2" />
            </svg>
          </div>
          <div className="mt-3.5 flex items-center justify-between text-sm">
            <span className="font-semibold text-ink">
              أدنى سعر مسجّل للمنتج: <b dir="ltr" className="num text-green">{product.lowest}</b> ر.س
            </span>
            <span className="text-xs text-muted">مقارنة بمتوسط أسعار السوق</span>
          </div>
        </Block>

        {/* Specifications Accordion/Table */}
        <Block title="المواصفات التقنية الكاملة">
          <table className="w-full border-collapse text-sm">
            <tbody>
              {specGroups.map((g) => (
                <Fragment key={g.group}>
                  <tr>
                    <td colSpan={2} className="bg-green-tint/80 px-3.5 py-2.5 font-heading text-[13.5px] font-bold text-green-deep">
                      {g.group}
                    </td>
                  </tr>
                  {g.rows.map(([k, v], i) => (
                    <tr key={g.group + k} className={i % 2 ? 'bg-surface/60' : ''}>
                      <td className="w-[40%] border-b border-line px-3.5 py-2.5 text-muted">{k}</td>
                      <td className="border-b border-line px-3.5 py-2.5 font-medium text-ink">{v}</td>
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </Block>

        {/* Verified Reviews */}
        <Block title="تقييمات موثّقة من مشترين حقيقيين">
          <div className="mb-3 flex items-center gap-3">
            <RatingBar value={4.8} count={142} />
          </div>
          <p className="mb-4 text-xs text-muted">
            تُقبل التقييمات حصرياً من العملاء الذين أتموا حجز واستلام الجهاز عبر المنصة لضمان الشفافية وموثوقية الأسعار.
          </p>
          <div className="flex flex-col gap-3">
            {REVIEWS.map((r) => (
              <div key={r.name} className="rounded-lg border border-line/60 bg-surface/30 p-3.5 text-sm">
                <div className="mb-2 flex items-center gap-2">
                  <span className="font-bold text-ink">{r.name}</span>
                  <Badge variant="verified">حجز واستلام موثّق ✓</Badge>
                  <span className="ms-auto text-xs text-muted">{r.when}</span>
                </div>
                <p className="text-muted leading-relaxed">{r.text}</p>
              </div>
            ))}
          </div>
        </Block>
      </div>

      {/* Sticky Booking Sidebar */}
      <aside className="rounded-[14px] border border-line bg-paper p-6 shadow-soft md:sticky md:top-20">
        <div className="text-xs font-semibold text-muted">أفضل سعر متاح الآن في السوق:</div>
        <div dir="ltr" className="num mt-1 text-[38px] font-black leading-tight text-green">
          {product.from} <span className="text-sm font-bold text-muted">ر.س</span>
        </div>
        <div className="mb-4 mt-1 flex items-center gap-1.5 text-xs text-muted">
          <span className="h-2 w-2 rounded-full bg-green" />
          <span>متجر التقنية · متوفر للاستلام الفوري</span>
        </div>

        <Link
          href={`/booking/${product.id}`}
          className="mb-2.5 block w-full rounded-field bg-green py-3 text-center text-sm font-bold text-white transition-colors hover:bg-green-deep shadow-sm"
        >
          احجز الجهاز وثبّت السعر الآن
        </Link>
        <p className="mb-4 text-center text-[11.5px] leading-5 text-muted">
          الحجز مجاني تماماً ويثبت السعر لمدة ٢٤ ساعة. تدفع عند المعاينة والاستلام في المعرض.
        </p>

        <ProductPageActions productId={product.id} />
      </aside>
    </div>
  );
}
