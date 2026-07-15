import Link from 'next/link';
import PriceTicker from '@/components/PriceTicker';
import ProductCard from '@/components/ProductCard';
import HomeSearch from '@/components/HomeSearch';
import { getHome } from '@/lib/api';

/** Homepage: live ticker + central search (with live suggestions) + smart sections. */
export default async function Home() {
  const { drops, categories, mostCompared, trust } = await getHome();

  return (
    <>
      {/* Hero */}
      <section className="border-b border-line bg-paper pb-8">
        <PriceTicker />
        <div className="mx-auto max-w-3xl px-6 pt-11 text-center">
          <h1 className="text-3xl font-extrabold sm:text-[34px]">قارن سعر جوالك عبر كل المتاجر</h1>
          <p className="mx-auto mt-2 max-w-xl text-[15px] text-muted">
            أسعار حيّة من عشرات المتاجر، محدّثة على مدار الساعة — وليست كتالوجاً ثابتاً.
          </p>

          <HomeSearch />

          <p className="mt-3.5 flex items-center justify-center gap-2 text-[12.5px] text-muted">
            <span className="h-2 w-2 animate-pulse2 rounded-full bg-green" /> آخر تحديث للأسعار قبل ٧ دقائق
          </p>
        </div>
      </section>

      {/* Biggest drop today */}
      <section className="mx-auto max-w-[1200px] px-6 pt-8">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-xl font-extrabold">أكبر انخفاض اليوم</h2>
          <Link href="/search" className="text-[13px] font-semibold text-green">عرض الكل ←</Link>
        </div>
        <div className="rounded-2xl bg-green-tint p-5">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {drops.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-[1200px] px-6 pt-8">
        <h2 className="mb-4 text-xl font-extrabold">تصفّح حسب الفئة</h2>
        <div className="flex flex-wrap gap-3.5">
          {categories.map((c) => (
            <Link key={c.label} href="/search" className="group flex flex-col items-center gap-2">
              <span className="flex h-[76px] w-[76px] items-center justify-center rounded-full border border-line bg-white text-[26px] group-hover:border-green group-hover:bg-green-tint">
                {c.icon}
              </span>
              <span className="text-[13px] font-semibold">{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Most compared */}
      <section className="mx-auto max-w-[1200px] px-6 pt-8">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-xl font-extrabold">الأكثر مقارنة</h2>
          <Link href="/search" className="text-[13px] font-semibold text-green">عرض الكل ←</Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {mostCompared.map((p) => <ProductCard key={p.id} product={p} showCompare />)}
        </div>
      </section>

      {/* Trust bar */}
      <section className="mx-auto mt-9 flex max-w-[1200px] flex-wrap justify-center gap-10 border-t border-line px-6 pt-5">
        {trust.map(([n, l]) => (
          <div key={l} className="text-center">
            <b dir="ltr" className="num block text-2xl font-semibold">{n}</b>
            <small className="text-[12.5px] text-muted">{l}</small>
          </div>
        ))}
      </section>
    </>
  );
}
