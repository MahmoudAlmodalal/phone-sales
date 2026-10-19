import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PRODUCTS, CATEGORIES, byDrop } from '../data/products.js'
import PriceTicker from '../components/PriceTicker.jsx'
import ProductCard from '../components/ProductCard.jsx'

/** Homepage: live ticker + central search (with live suggestions) + smart sections. */
export default function Home() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)

  const suggestions = useMemo(() => {
    if (!query.trim()) return []
    return PRODUCTS.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())).slice(0, 4)
  }, [query])

  const drops = useMemo(() => [...PRODUCTS].sort(byDrop).slice(0, 4), [])
  const mostCompared = PRODUCTS.slice(0, 4)

  const submit = () => navigate('/search')
  const showSugg = focused && suggestions.length > 0

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

          {/* Search + suggestions */}
          <div className="relative mx-auto mt-7 max-w-xl">
            <div className="flex h-[58px] items-center gap-0 rounded-xl border-2 border-green bg-white px-1.5 ps-[18px] shadow-soft">
              <input
                value={query}
                onChange={(e) => { setQuery(e.target.value); setFocused(true) }}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 150)}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
                placeholder="ابحث عن جوال، أو الصق رابطاً…"
                className="h-full flex-1 border-none bg-transparent text-base outline-none"
              />
              <button
                onClick={submit}
                aria-label="بحث"
                className="flex h-[46px] w-[46px] items-center justify-center rounded-[9px] bg-green text-white hover:bg-green-deep"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" />
                </svg>
              </button>
            </div>

            {showSugg && (
              <div className="absolute inset-x-0 top-[70px] z-30 overflow-hidden rounded-xl border border-line bg-white text-right shadow-[0_12px_30px_rgba(0,0,0,.12)]">
                <div className="px-4 pb-1 pt-2.5 text-[11px] font-bold tracking-wide text-muted">منتجات</div>
                {suggestions.map((s) => (
                  <button
                    key={s.id}
                    onMouseDown={() => navigate(`/product/${s.id}`)}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-right hover:bg-surface"
                  >
                    <span className="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-[7px] border border-line bg-surface text-[11px] font-bold text-muted">
                      {s.brand.charAt(0)}
                    </span>
                    <span className="flex-1 text-sm">{s.name}</span>
                    <span className="num text-[13px]">{s.from}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <p className="mt-3.5 flex items-center justify-center gap-2 text-[12.5px] text-muted">
            <span className="h-2 w-2 animate-pulse2 rounded-full bg-green" /> آخر تحديث للأسعار قبل ٧ دقائق
          </p>
        </div>
      </section>

      {/* Biggest drop today */}
      <section className="mx-auto max-w-content px-6 pt-8">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-xl font-extrabold">أكبر انخفاض اليوم</h2>
          <Link to="/search" className="text-[13px] font-semibold text-green">عرض الكل ←</Link>
        </div>
        <div className="rounded-2xl bg-green-tint p-5">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {drops.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-content px-6 pt-8">
        <h2 className="mb-4 text-xl font-extrabold">تصفّح حسب الفئة</h2>
        <div className="flex flex-wrap gap-3.5">
          {CATEGORIES.map((c) => (
            <Link key={c.label} to="/search" className="group flex flex-col items-center gap-2">
              <span className="flex h-[76px] w-[76px] items-center justify-center rounded-full border border-line bg-white text-[26px] group-hover:border-green group-hover:bg-green-tint">
                {c.icon}
              </span>
              <span className="text-[13px] font-semibold">{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Most compared */}
      <section className="mx-auto max-w-content px-6 pt-8">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-xl font-extrabold">الأكثر مقارنة</h2>
          <Link to="/search" className="text-[13px] font-semibold text-green">عرض الكل ←</Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {mostCompared.map((p) => <ProductCard key={p.id} product={p} showCompare />)}
        </div>
      </section>

      {/* Trust bar */}
      <section className="mx-auto mt-9 flex max-w-content flex-wrap justify-center gap-10 border-t border-line px-6 pt-5">
        {[
          ['١٤٢', 'متجراً مشاركاً'],
          ['٨٬٤٠٠', 'منتجاً متتبَّعاً'],
          ['١٫٢م', 'نقطة سعر مسجّلة'],
        ].map(([n, l]) => (
          <div key={l} className="text-center">
            <b className="num block text-2xl font-semibold">{n}</b>
            <small className="text-[12.5px] text-muted">{l}</small>
          </div>
        ))}
      </section>
    </>
  )
}
