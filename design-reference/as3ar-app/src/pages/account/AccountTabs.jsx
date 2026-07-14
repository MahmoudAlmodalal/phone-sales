import { useApp } from '../../context/AppContext.jsx'
import { PRODUCTS } from '../../data/products.js'
import ProductCard from '../../components/ProductCard.jsx'

const badge = (cls) => `rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${cls}`
const ACTIVE = 'bg-green-tint text-green-deep'
const DONE = 'bg-surface text-muted'
const CANCEL = 'bg-star-tint text-star'

export function Profile() {
  const field = 'mb-3.5'
  const input = 'h-11 w-full rounded-field border border-line px-3 text-sm outline-none focus:border-green'
  return (
    <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[280px_1fr]">
      <aside className="rounded-card border border-line bg-paper p-[18px]">
        <h4 className="mb-3 text-sm font-bold">حالة الحساب</h4>
        <div className="rounded-[9px] bg-green-tint px-3 py-2.5 text-[13px] font-semibold text-green-deep">جيدة — لا قيود على الحجز</div>
        <p className="mt-3.5 text-[12.5px] leading-7 text-muted">تلتزم بالحضور في مواعيد حجوزاتك. الإلغاء المتكرر قد يقيّد الحساب مؤقتاً.</p>
      </aside>
      <div className="rounded-card border border-line bg-paper p-[18px]">
        {[['الاسم', 'عبدالله الشمري', 'rtl'], ['البريد الإلكتروني', 'a.alshammari@example.com', 'ltr'], ['الجوال', '+966 55 123 4567', 'ltr']].map(([l, v, dir]) => (
          <div key={l} className={field}><label className="mb-1.5 block text-[12.5px] font-semibold">{l}</label><input dir={dir} defaultValue={v} className={`${input} ${dir === 'ltr' ? 'num' : ''}`} /></div>
        ))}
        <div className={field}><label className="mb-1.5 block text-[12.5px] font-semibold">اللغة</label><select className={input}><option>العربية</option><option>English</option></select></div>
        <button className="rounded-field bg-green px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-deep">حفظ التغييرات</button>
      </div>
    </div>
  )
}

export function Favorites() {
  const { favorites } = useApp()
  const items = favorites.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean)
  if (items.length === 0)
    return <div className="rounded-card border-2 border-dashed border-line py-14 text-center"><h3 className="text-lg font-bold">لسّه ما تابعت أي جوال</h3><p className="mt-2 text-sm text-muted">تابع واحداً ومنخبرك أول ما ينزل سعره.</p></div>
  return <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{items.map((p) => <ProductCard key={p.id} product={p} />)}</div>
}

export function Alerts() {
  const rows = [
    ['iPhone 15 Pro Max', '4,700', '4,650', '−50', 'hit'],
    ['Galaxy S24 Ultra', '4,000', '4,299', '+299', ''],
    ['Xiaomi 14', '2,300', '2,499', '+199', ''],
  ]
  return (
    <table className="w-full overflow-hidden rounded-card border border-line bg-paper text-sm">
      <thead><tr className="bg-surface text-[12.5px] text-muted">{['المنتج', 'الحد المطلوب', 'السعر الحالي', 'الفارق', 'الحالة'].map((h) => <th key={h} className="px-3.5 py-2.5 text-right font-semibold">{h}</th>)}</tr></thead>
      <tbody>
        {rows.map(([n, t, c, d, hit]) => (
          <tr key={n} className={hit ? 'bg-green-tint' : ''}>
            <td className="border-t border-line px-3.5 py-3">{n}</td>
            <td className="num border-t border-line px-3.5 py-3 font-semibold">{t}</td>
            <td className="num border-t border-line px-3.5 py-3 font-semibold">{c}</td>
            <td className={['num border-t border-line px-3.5 py-3 font-semibold', d.startsWith('−') ? 'text-green' : 'text-muted'].join(' ')}>{d}</td>
            <td className="border-t border-line px-3.5 py-3"><span className={badge(hit ? ACTIVE : DONE)}>{hit ? 'تحقّق ✓' : 'يراقب'}</span></td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export function Bookings() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="rounded-card border border-line bg-paper p-3.5"><div className="flex items-center justify-between"><b>iPhone 15 Pro Max</b><span className={badge(ACTIVE)}>نشط</span></div><div className="mt-1 text-xs text-muted">متجر التقنية · BK-7F42Q</div><div className="mt-2.5 rounded-card bg-star-tint p-3 text-center"><div className="num text-[22px] font-semibold text-star">47:12:33</div><small className="text-[12.5px] text-star">ينتهي بعد</small></div></div>
      <div className="rounded-card border border-line bg-paper p-3.5"><div className="flex items-center justify-between"><b>Galaxy S24</b><span className={badge(DONE)}>مكتمل</span></div><div className="mt-1 text-xs text-muted">مكتبة جرير · BK-6620P</div><div className="mt-3 text-[13px] text-muted">تمّ الاستلام في ٢ يونيو</div></div>
      <div className="rounded-card border border-line bg-paper p-3.5"><div className="flex items-center justify-between"><b className="text-muted line-through">Pixel 8</b><span className={badge(CANCEL)}>ملغي</span></div><div className="mt-1 text-xs text-muted">إكسترا · BK-5410M</div><div className="mt-3 text-[13px] text-muted">أُلغي — لم يتم الحضور</div></div>
    </div>
  )
}
