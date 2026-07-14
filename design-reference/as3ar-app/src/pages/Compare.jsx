import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PRODUCTS, numeric } from '../data/products.js'
import { useApp } from '../context/AppContext.jsx'

/** Horizontal compare table: attribute column fixed, best value per row highlighted. */
export default function Compare() {
  const navigate = useNavigate()
  const { compare, clearCompare } = useApp()
  const [hideSame, setHideSame] = useState(false)

  const cols = compare.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean)

  if (cols.length === 0) {
    return (
      <div className="mx-auto max-w-content px-6 py-16 text-center">
        <h3 className="text-lg font-bold">لم تختر أي منتج للمقارنة بعد</h3>
        <p className="mt-2 text-sm text-muted">أضف منتجات من صفحة البحث وستظهر هنا جنباً إلى جنب.</p>
        <button onClick={() => navigate('/search')} className="mt-6 rounded-field bg-green px-5 py-3 text-sm font-semibold text-white hover:bg-green-deep">تصفّح المنتجات</button>
      </div>
    )
  }

  const minPrice = Math.min(...cols.map((c) => numeric(c.from)))
  const maxBatt = Math.max(...cols.map((c) => parseInt(c.battery)))

  const rows = [
    { attr: 'أقل سعر', price: true },
    { attr: 'العلامة', get: (c) => c.brand },
    { attr: 'المعالج', get: (c) => c.chip },
    { attr: 'الشاشة', get: () => '6.7" OLED 120Hz', same: true },
    { attr: 'البطارية', get: (c) => c.battery, win: (c) => parseInt(c.battery) === maxBatt },
    { attr: 'عدد المتاجر', get: (c) => c.stores },
  ].filter((r) => !(hideSame && r.same))

  const cell = 'border border-line px-4 py-3 text-right bg-white'
  const attrCell = 'border border-line px-4 py-3 text-right bg-surface font-semibold sticky start-0 z-[2] min-w-[150px]'

  return (
    <div className="mx-auto max-w-content px-4 py-7 sm:px-6">
      <h1 className="mb-1 text-2xl font-extrabold">مقارنة المنتجات</h1>
      <p className="mb-5 text-sm text-muted">حتى ٤ منتجات جنباً إلى جنب — القيمة الأفضل في كل صف مميّزة بالأخضر.</p>

      <div className="mb-4 flex items-center gap-4">
        <label onClick={() => setHideSame((v) => !v)} className="flex cursor-pointer items-center gap-2.5 text-[13.5px]">
          <span className={['flex h-[17px] w-[17px] items-center justify-center rounded border text-[11px] text-white', hideSame ? 'border-green bg-green' : 'border-line'].join(' ')}>{hideSame && '✓'}</span>
          إخفاء المتشابه
        </label>
        <button onClick={clearCompare} className="text-[13px] font-semibold text-star">مسح الكل</button>
      </div>

      <div className="overflow-x-auto pb-4">
        <table className="border-collapse text-sm">
          <thead>
            <tr>
              <th className={attrCell} />
              {cols.map((c) => (
                <th key={c.id} className="border border-line bg-white px-4 py-3 text-right align-top min-w-[170px]">
                  <div className="mb-2 h-20 rounded-lg bg-gradient-to-b from-[#eef1f0] to-[#e2e8e5]" />
                  {c.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.attr}>
                <td className={attrCell}>{r.attr}</td>
                {cols.map((c) => {
                  if (r.price) {
                    const win = numeric(c.from) === minPrice
                    return <td key={c.id} className={[cell, win ? '!bg-green-tint font-semibold' : ''].join(' ')}><span className="num text-lg font-semibold text-green">{c.from}</span> ر.س</td>
                  }
                  const win = r.win && r.win(c)
                  return <td key={c.id} className={[cell, win ? '!bg-green-tint font-semibold' : ''].join(' ')}>{r.get(c)}</td>
                })}
              </tr>
            ))}
            <tr>
              <td className={attrCell} />
              {cols.map((c) => (
                <td key={c.id} className={cell}>
                  <button onClick={() => navigate(`/booking/${c.id}`)} className="rounded-field bg-green px-4 py-2 text-[13px] font-semibold text-white hover:bg-green-deep">احجز</button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
