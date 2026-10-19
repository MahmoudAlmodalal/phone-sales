import Link from 'next/link';
import PriceTicker from '@/components/PriceTicker';
import ProductCard from '@/components/ProductCard';
import HomeSearch from '@/components/HomeSearch';
import { getHome } from '@/lib/api';

function BrandLogo({ id }: { id: string }) {
  switch (id) {
    case 'apple':
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.66-.82 1.11-1.95.98-3.09-1 .04-2.14.65-2.82 1.45-.59.69-1.12 1.83-.98 2.94 1.11.09 2.16-.48 2.82-1.3" />
        </svg>
      );
    case 'samsung':
      return (
        <span className="font-extrabold text-[15px] tracking-wider text-blue-600 font-sans">
          SAMSUNG
        </span>
      );
    case 'xiaomi':
      return (
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 font-black text-white text-[13px]">
          mi
        </span>
      );
    case 'google':
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
      );
    case 'oneplus':
      return (
        <div className="flex items-center gap-0.5 font-black text-red-600 text-[14px]">
          <span className="flex h-6 w-6 items-center justify-center rounded border-2 border-red-600">1+</span>
        </div>
      );
    default:
      return (
        <span className="font-bold text-sm text-green-deep">
          HONOR
        </span>
      );
  }
}

/** Homepage: live ticker + central search + rich smartphone showcase. */
export default async function Home() {
  const { drops, categories, mostCompared, trust } = await getHome();

  return (
    <>
      {/* Hero Section */}
      <section className="border-b border-line bg-paper pb-10">
        <PriceTicker />
        <div className="mx-auto max-w-3xl px-6 pt-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-green/30 bg-green-tint px-3.5 py-1 text-xs font-bold text-green-deep mb-4 shadow-sm">
            <span className="h-2 w-2 animate-pulse2 rounded-full bg-green" />
            <span>مقارنة حيّة لأسعار الهواتف في المتاجر السعودية</span>
          </div>
          <h1 className="text-3xl font-extrabold sm:text-[38px] text-ink leading-tight">
            قارن أسعار الهواتف الذكية ووفر أكثر من ٥٠٠ ر.س
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-[15.5px] leading-relaxed text-muted">
            منصة بحث ومقارنة تجمع لك أسعار الهواتف من كبرى المتاجر الرسمية لحظة بلحظة، وتتيح تثبيت السعر والحجز فوراً.
          </p>

          <HomeSearch />

          <p className="mt-4 flex items-center justify-center gap-2 text-[12.5px] text-muted">
            <span className="h-2 w-2 rounded-full bg-green" />
            <span>محدّث لحظياً من مكتبة جرير، إكسترا، نون، وأكثر من ٥٠ متجراً معتمداً</span>
          </p>
        </div>
      </section>

      {/* Biggest Price Drops Today */}
      <section className="mx-auto max-w-[1200px] px-6 pt-10">
        <div className="mb-5 flex items-baseline justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-ink sm:text-2xl">أكبر انخفاضات الأسعار اليوم</h2>
            <p className="text-xs text-muted mt-1">هواتف رائدة هبطت أسعارها إلى أدنى مستوياتها خلال الـ ٧ أيام الماضية</p>
          </div>
          <Link href="/search" className="text-sm font-bold text-green hover:underline">
            عرض كل العروض ←
          </Link>
        </div>
        <div className="rounded-2xl border border-green/20 bg-green-tint/40 p-5 shadow-soft">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {drops.map((p) => (
              <ProductCard key={p.id} product={p} showCompare />
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Brand */}
      <section className="mx-auto max-w-[1200px] px-6 pt-10">
        <div className="mb-5 flex items-baseline justify-between">
          <h2 className="text-xl font-extrabold text-ink sm:text-2xl">تصفّح حسب العلامة التجارية</h2>
          <Link href="/search" className="text-sm font-bold text-green hover:underline">
            تصفح الكل ←
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-6">
          {categories.map((c) => (
            <Link
              key={c.id}
              href="/search"
              className="group flex flex-col items-center justify-center gap-2.5 rounded-xl border border-line bg-paper p-4 transition-all hover:border-green hover:shadow-md"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface transition-colors group-hover:bg-green-tint">
                <BrandLogo id={c.id} />
              </div>
              <div className="text-center">
                <span className="block text-xs font-bold text-ink group-hover:text-green">{c.label}</span>
                <span className="block text-[11px] text-muted mt-0.5">{c.count} هواتف معروضة</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Most Compared Flagships */}
      <section className="mx-auto max-w-[1200px] px-6 pt-10">
        <div className="mb-5 flex items-baseline justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-ink sm:text-2xl">الهواتف الأكثر مقارنة</h2>
            <p className="text-xs text-muted mt-1">الهواتف الذكية الأكثر بحثاً ومقارنة للمواصفات هذا الأسبوع</p>
          </div>
          <Link href="/compare" className="text-sm font-bold text-green hover:underline">
            فتح جدول المقارنة ←
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {mostCompared.map((p) => (
            <ProductCard key={p.id} product={p} showCompare />
          ))}
        </div>
      </section>

      {/* Trust & Guarantee Bar */}
      <section className="mx-auto my-12 flex max-w-[1200px] flex-wrap justify-around gap-6 rounded-card border border-line bg-paper p-6 shadow-soft">
        {trust.map(([n, l]) => (
          <div key={l} className="flex flex-col items-center text-center">
            <span dir="ltr" className="num text-3xl font-black text-green">
              {n}
            </span>
            <span className="mt-1 text-xs font-semibold text-muted">{l}</span>
          </div>
        ))}
      </section>
    </>
  );
}
