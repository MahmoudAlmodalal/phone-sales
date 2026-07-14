const badge = (cls) => `rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${cls}`
const ACTIVE = 'bg-green-tint text-green-deep'
const DONE = 'bg-surface text-muted'

export function Overview() {
  const kpis = [
    ['منتجات نشطة', '142', '+6 هذا الأسبوع', 'text-green', false],
    ['حجوزات اليوم', '18', '+3 عن أمس', 'text-green', false],
    ['معدّل التحويل', '7.4%', 'آخر ٣٠ يوم', 'text-muted', false],
    ['نسبة الإلغاء', '14.2%', 'فوق العتبة (10%)', 'text-star', true],
  ]
  const bars = [40, 55, 35, 70, 60, 85, 50, 75, 65, 90, 80, 100]
  return (
    <>
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map(([k, v, d, dc, bad]) => (
          <div key={k} className="rounded-card border border-line bg-paper p-[18px]">
            <div className="mb-2 text-[13px] text-muted">{k}</div>
            <div className={['num text-[28px] font-semibold', bad ? 'text-star' : ''].join(' ')}>{v}</div>
            <div className={`mt-1.5 text-xs ${dc}`}>{d}</div>
          </div>
        ))}
      </div>
      <div className="rounded-card border border-line bg-paper p-[18px]">
        <h4 className="mb-3 text-sm font-bold">الحجوزات — آخر ٣٠ يوم</h4>
        <div className="flex h-32 items-end gap-1.5 pt-2.5">
          {bars.map((h, i) => <div key={i} className="flex-1 rounded-t bg-green opacity-85 hover:opacity-100" style={{ height: `${h}%` }} />)}
        </div>
      </div>
    </>
  )
}

export function Products() {
  const rows = [
    ['iPhone 15 Pro Max', '4,999', '12', '1,204', 'قبل ٣ د', false, true],
    ['Galaxy S24 Ultra', '4,299', '7', '980', 'قبل ٣ أيام', true, false],
    ['Xiaomi 14', '2,499', '20', '640', 'قبل ٥ س', false, false],
    ['Redmi Note 13 Pro', '999', '3', '1,510', 'قبل ١ س', false, false],
  ]
  const edit = 'inline-flex items-center gap-1.5 rounded-[7px] border border-transparent px-2 py-1.5 font-semibold num cursor-text hover:border-green hover:bg-green-tint'
  return (
    <table className="w-full overflow-hidden rounded-card border border-line bg-paper text-sm">
      <thead><tr className="bg-surface text-[12.5px] text-muted">{['المنتج', 'السعر (تحرير مباشر)', 'المخزون', 'النقرات', 'آخر تحديث'].map((h) => <th key={h} className="px-3.5 py-2.5 text-right font-semibold">{h}</th>)}</tr></thead>
      <tbody>
        {rows.map(([n, p, s, c, u, stale, saved]) => (
          <tr key={n}>
            <td className="border-t border-line px-3.5 py-3">{n}</td>
            <td className="border-t border-line px-3.5 py-3"><span className={edit}>{p}{saved && <span className="text-[11px] font-semibold text-green">حُفظ ١٤:٣٢</span>}</span></td>
            <td className="border-t border-line px-3.5 py-3"><span className={edit}>{s}</span></td>
            <td className="num border-t border-line px-3.5 py-3">{c}</td>
            <td className={['num border-t border-line px-3.5 py-3 text-[12.5px]', stale ? 'text-[#b7c0bb]' : 'text-muted'].join(' ')}>{u}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export function Import() {
  return (
    <div className="grid gap-3.5">
      <div className="rounded-card border border-line bg-paper p-4"><span className="me-2.5 inline-flex h-[26px] w-[26px] items-center justify-center rounded-full bg-green text-[13px] font-bold text-white">١</span><b>ارفع الملف</b><div className="mt-3 rounded-card border-2 border-dashed border-line px-6 py-6 text-center text-muted hover:border-green hover:text-green">اسحب ملف CSV أو XLSX هنا، أو انقر للاختيار</div></div>
      <div className="rounded-card border border-line bg-paper p-4"><span className="me-2.5 inline-flex h-[26px] w-[26px] items-center justify-center rounded-full bg-green text-[13px] font-bold text-white">٢</span><b>طابق الأعمدة</b><div className="mt-2 text-[13.5px]">عمودك «سعر البيع» <span className="text-muted">←</span> حقلنا <code className="num">price</code></div><div className="mt-1 text-[13.5px]">عمودك «الكمية» <span className="text-muted">←</span> حقلنا <code className="num">stock</code></div></div>
      <div className="rounded-card border border-line bg-paper p-4"><span className="me-2.5 inline-flex h-[26px] w-[26px] items-center justify-center rounded-full bg-green text-[13px] font-bold text-white">٣</span><b>التقرير</b><div className="mt-2.5"><span className="font-semibold text-green">✓ ١٤٠ صفاً جاهزاً</span> · <span className="font-semibold text-star">✗ ٦ صفوف بها أخطاء</span></div><div dir="ltr" className="num mt-1.5 rounded-[7px] bg-star-tint px-2.5 py-1.5 text-[12.5px] text-star">الصف ٢٣: السعر غير رقمي (1,2o0)</div></div>
    </div>
  )
}

export function VendorBookings() {
  const rows = [
    ['BK-7F42Q', 'iPhone 15 Pro Max', 'عبدالله ا.', 'غداً ١٢–٢ م', 'active'],
    ['BK-6620P', 'Galaxy S24', 'سارة م.', 'اليوم ٤–٦ م', 'active'],
    ['BK-5901K', 'Xiaomi 14', 'فهد ع.', '—', 'done'],
  ]
  return (
    <table className="w-full overflow-hidden rounded-card border border-line bg-paper text-sm">
      <thead><tr className="bg-surface text-[12.5px] text-muted">{['رقم الحجز', 'المنتج', 'العميل', 'وقت الحضور', 'الحالة', ''].map((h, i) => <th key={i} className="px-3.5 py-2.5 text-right font-semibold">{h}</th>)}</tr></thead>
      <tbody>
        {rows.map(([id, n, c, t, st]) => (
          <tr key={id}>
            <td className="num border-t border-line px-3.5 py-3">{id}</td>
            <td className="border-t border-line px-3.5 py-3">{n}</td>
            <td className="border-t border-line px-3.5 py-3">{c}</td>
            <td className="border-t border-line px-3.5 py-3">{t}</td>
            <td className="border-t border-line px-3.5 py-3"><span className={badge(st === 'active' ? ACTIVE : DONE)}>{st === 'active' ? 'نشط' : 'مكتمل'}</span></td>
            <td className="border-t border-line px-3.5 py-3">{st === 'active' && <button className="rounded-field bg-green px-3.5 py-1.5 text-[13px] font-semibold text-white hover:bg-green-deep">تم الاستلام</button>}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
