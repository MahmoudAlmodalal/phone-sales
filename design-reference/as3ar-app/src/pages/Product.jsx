import { useParams, Link, useNavigate } from 'react-router-dom'
import { Fragment } from 'react'
import { PRODUCTS, STORES } from '../data/products.js'
import { useApp } from '../context/AppContext.jsx'
import Star from '../components/Star.jsx'

const SPECS = [
  { group: 'الشاشة', rows: [['الحجم', '6.7 بوصة OLED'], ['معدل التحديث', '120Hz']] },
  { group: 'المعالج والذاكرة', rows: [['المعالج', null /* filled from product.chip */], ['الذاكرة / التخزين', '8GB / 256GB']] },
  { group: 'الكاميرا والبطارية', rows: [['الكاميرا الرئيسية', '48 ميجابكسل'], ['البطارية', null /* product.battery */]] },
]

const REVIEWS = [
  { name: 'خالد م.', when: 'تمّ الاستلام في ٤ يونيو', text: 'جهاز أصلي والسعر أقل من المعارض. الحجز وفّر عليّ التنقّل.' },
  { name: 'نورة العتيبي', when: 'تمّ الاستلام في ٢٨ مايو', text: 'المتجر ملتزم بالسعر المعلن، والاستلام كان سريعاً.' },
]

function Block({ title, children }) {
  return (
    <section className="mt-5 rounded-card border border-line bg-paper p-5">
      <h3 className="mb-4 text-lg font-extrabold">{title}</h3>
      {children}
    </section>
  )
}

export default function Product() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { favorites, toggleFavorite, compare, toggleCompare } = useApp()
  const product = PRODUCTS.find((p) => p.id === id) || PRODUCTS[0]
  const isFav = favorites.includes(product.id)
  const inCompare = compare.includes(product.id)

  const specGroups = SPECS.map((g) => ({
    ...g,
    rows: g.rows.map(([k, v]) => [
      k,
      v ?? (k === 'المعالج' ? product.chip : k === 'البطارية' ? product.battery : ''),
    ]),
  }))

  return (
    <div className="mx-auto grid max-w-content grid-cols-1 items-start gap-8 px-4 py-6 pb-28 sm:px-6 md:grid-cols-[1fr_400px]">
      {/* Main column */}
      <div>
        <div className="mb-3.5 text-[13px] text-muted">
          <Link to="/" className="hover:text-green">الرئيسية</Link> / {product.brand} / {product.name}
        </div>

        {/* Gallery */}
        <div className="flex flex-col gap-5 rounded-[14px] border border-line bg-paper p-6 sm:flex-row-reverse">
          <div className="flex flex-1 items-center justify-center rounded-xl bg-gradient-to-b from-[#eef1f0] to-[#e2e8e5] py-8">
            <span className="relative h-56 w-28 rounded-[20px] border-[3px] border-[#cfd8d4] bg-white after:absolute after:left-1/2 after:top-3 after:h-[5px] after:w-[30px] after:-translate-x-1/2 after:rounded after:bg-[#cfd8d4]" />
          </div>
          <div className="flex gap-2.5 sm:flex-col">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className={['h-[60px] w-[60px] cursor-pointer rounded-[9px] border bg-surface', i === 0 ? 'border-2 border-green' : 'border-line'].join(' ')} />
            ))}
          </div>
        </div>

        <h1 className="mt-5 text-[26px] font-extrabold">{product.name}</h1>
        <div className="mb-5 text-sm text-muted">{product.brand} · {product.stores} متاجر تعرض هذا المنتج</div>

        {/* Store price table */}
        <Block title="الأسعار حسب المتجر">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="text-xs text-muted">
                  <th className="border-b border-line px-3 py-2.5 text-right font-semibold">المتجر</th>
                  <th className="border-b border-line px-3 py-2.5 text-right font-semibold">السعر</th>
                  <th className="border-b border-line px-3 py-2.5 text-right font-semibold">التوفر</th>
                  <th className="border-b border-line px-3 py-2.5 text-right font-semibold">آخر تحديث</th>
                  <th className="border-b border-line px-3 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {STORES.map((s) => (
                  <tr key={s.name} className={[s.best ? 'bg-green-tint' : '', !s.inStock ? 'text-[#aab3af]' : ''].join(' ')}>
                    <td className="border-b border-line px-3 py-3">
                      {s.name}
                      {s.best && <span className="ms-2 rounded-full bg-green px-2 py-0.5 text-[11px] font-semibold text-white">أقل سعر</span>}
                    </td>
                    <td className="num border-b border-line px-3 py-3 text-[15px] font-semibold">{s.price}</td>
                    <td className={['border-b border-line px-3 py-3 text-[13px]', s.inStock ? 'font-semibold text-green' : 'text-[#aab3af]'].join(' ')}>{s.avail}</td>
                    <td className="num border-b border-line px-3 py-3 text-[13px] text-muted">{s.updated}</td>
                    <td className="border-b border-line px-3 py-3">
                      <a href="#" className="rounded-[7px] bg-green px-3.5 py-1.5 text-[13px] font-semibold text-white hover:bg-green-deep">اذهب →</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Block>

        {/* Price history */}
        <Block title="تاريخ السعر">
          <div className="mb-3.5 flex gap-1.5">
            {['٣٠ يوم', '٩٠ يوم', 'سنة'].map((t, i) => (
              <button key={t} className={['rounded-[7px] border px-3 py-1.5 text-[12.5px]', i === 0 ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink'].join(' ')}>{t}</button>
            ))}
          </div>
          <svg viewBox="0 0 600 200" width="100%" height="200" preserveAspectRatio="none">
            <defs>
              <linearGradient id="gg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#007A3D" stopOpacity="0.18" />
                <stop offset="1" stopColor="#007A3D" stopOpacity="0" />
              </linearGradient>
            </defs>
            <line x1="0" y1="90" x2="600" y2="90" stroke="#DDE3E0" strokeDasharray="5 5" />
            <path d="M0 60 L75 72 L150 55 L225 95 L300 80 L375 120 L450 105 L525 140 L600 130 L600 200 L0 200 Z" fill="url(#gg)" />
            <path d="M0 60 L75 72 L150 55 L225 95 L300 80 L375 120 L450 105 L525 140 L600 130" fill="none" stroke="#007A3D" strokeWidth="2.5" />
            <circle cx="150" cy="55" r="4" fill="#CE1126" />
          </svg>
          <div className="mt-3 text-sm font-semibold">
            أدنى سعر مسجّل: <b className="num">{product.lowest}</b> ر.س في ١٢ مارس.
          </div>
        </Block>

        {/* Price alert */}
        <div className="mt-5 flex flex-wrap items-center gap-3.5 rounded-card border border-line bg-surface p-[18px]">
          <div className="min-w-[180px] flex-1">
            <h4 className="text-[15px] font-bold">تنبيه السعر</h4>
            <span className="text-[13px] text-muted">نبّهك إذا نزل السعر تحت الحد الذي تحدده.</span>
          </div>
          <span className="text-[13px]">نبّهني إذا نزل تحت</span>
          <input defaultValue={product.lowest} className="num h-[42px] w-28 rounded-field border border-line px-3 text-center text-[15px]" />
          <span className="text-xs text-muted">ر.س</span>
          <button className="rounded-field bg-green px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-green-deep">فعّل التنبيه</button>
        </div>

        {/* Specs */}
        <Block title="المواصفات">
          <table className="w-full border-collapse text-sm">
            <tbody>
              {specGroups.map((g) => (
                <Fragment key={g.group}>
                  <tr><td colSpan={2} className="bg-green-tint px-3 py-2.5 font-heading text-[13px] font-bold">{g.group}</td></tr>
                  {g.rows.map(([k, v], i) => (
                    <tr key={g.group + k} className={i % 2 ? 'bg-surface' : ''}>
                      <td className="w-[45%] border-b border-line px-3 py-2.5 text-muted">{k}</td>
                      <td className="border-b border-line px-3 py-2.5">{v}</td>
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </Block>

        {/* Verified reviews */}
        <Block title="تقييمات موثّقة">
          <div className="mb-1.5 flex items-center gap-5">
            <div className="font-heading text-[42px] font-extrabold leading-none">4.6</div>
            <div className="max-w-[240px] flex-1">
              <div className="h-2 overflow-hidden rounded bg-line"><div className="h-full rounded bg-green" style={{ width: '92%' }} /></div>
              <div className="mt-1.5 text-[13px] text-muted">٨٧ تقييماً موثّقاً</div>
            </div>
          </div>
          <p className="mb-4 text-[13px] text-muted">تُقبل التقييمات فقط ممّن أتمّ حجزاً واستلاماً داخل النظام — لا يوجد زر تقييم للزوار.</p>
          {REVIEWS.map((r) => (
            <div key={r.name} className="border-t border-line py-3.5 text-sm">
              <div className="mb-1.5 flex items-center gap-2">
                <span className="font-semibold">{r.name}</span>
                <span className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-star"><Star size={12} /> موثّق</span>
                <span className="ms-auto text-xs text-muted">{r.when}</span>
              </div>
              {r.text}
            </div>
          ))}
        </Block>
      </div>

      {/* Sticky best-price card */}
      <aside className="rounded-[14px] border border-line bg-paper p-[22px] md:sticky md:top-20">
        <div className="text-[13px] text-muted">أفضل سعر الآن</div>
        <div className="num text-[38px] font-semibold leading-tight text-green">{product.from}</div>
        <div className="mb-4 text-[13px] text-muted">متجر التقنية · محدّث قبل ٣ د</div>
        <button className="mb-2 w-full rounded-field bg-green py-3 text-sm font-semibold text-white hover:bg-green-deep">اذهب إلى المتجر</button>
        <p className="mb-3.5 text-center text-[11px] leading-5 text-muted">قد نحصل على عمولة من هذا الرابط. السعر لا يتغيّر عليك.</p>
        <button onClick={() => navigate(`/booking/${product.id}`)} className="mb-2 w-full rounded-field border-[1.5px] border-green py-3 text-sm font-semibold text-green hover:bg-green-tint">احجز مسبقاً</button>
        <div className="flex gap-2.5">
          <button
            onClick={() => toggleFavorite(product.id)}
            className={['flex flex-1 items-center justify-center gap-1.5 rounded-field border py-2.5 text-[13px]', isFav ? 'border-star-tint bg-star-tint text-star' : 'border-line text-ink hover:border-green hover:text-green'].join(' ')}
          >♥ مفضلة</button>
          <button
            onClick={() => toggleCompare(product.id)}
            className={['flex flex-1 items-center justify-center gap-1.5 rounded-field border py-2.5 text-[13px]', inCompare ? 'border-green bg-green text-white' : 'border-line text-ink hover:border-green hover:text-green'].join(' ')}
          >⇄ قارن</button>
        </div>
      </aside>
    </div>
  )
}
