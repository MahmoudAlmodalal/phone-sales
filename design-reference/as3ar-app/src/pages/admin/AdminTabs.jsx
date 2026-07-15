const badge = (cls) => `rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${cls}`

export function Health() {
  const rows = [
    [false, 'Scraper — إكسترا (تغيّرت بنية الصفحة)', 'آخر تشغيل ٠٢:١٤ · فشل — بانتظار إدخال يدوي'],
    [true, 'API Sync — متجر التقنية', 'آخر تشغيل ٠٣:٠٠ · 1.2s'],
    [true, 'API Sync — مكتبة جرير', 'آخر تشغيل ٠٣:٠٠ · 0.9s'],
    [true, 'Cron — توليد Sitemap', 'آخر تشغيل ٠٣:٣٠ · 4.1s'],
    [true, 'Cron — تنبيهات الأسعار', 'آخر تشغيل ٠٤:٠٠ · 2.6s'],
  ]
  return (
    <div className="space-y-2.5">
      {rows.map(([ok, n, m]) => (
        <div key={n} className={['flex items-center gap-3.5 rounded-[10px] border bg-paper px-4 py-3', ok ? 'border-line' : 'border-[#f3c9cf]'].join(' ')}>
          <span className={['flex h-[26px] w-[26px] flex-none items-center justify-center rounded-full text-sm font-bold text-white', ok ? 'bg-green' : 'bg-star'].join(' ')}>{ok ? '✓' : '✗'}</span>
          <span className="flex-1 text-sm font-semibold">{n}</span>
          <span className="num text-xs text-muted">{m}</span>
        </div>
      ))}
    </div>
  )
}

export function Users() {
  const rows = [
    ['متجر التقنية', 'بائع', 'موثّق', 'تعليق', 'star'],
    ['عبدالله الشمري', 'مستخدم', 'نشط', 'تقييد', 'star'],
    ['متجر النخبة', 'بائع', 'قيد المراجعة', 'توثيق', 'green'],
  ]
  return (
    <table className="w-full overflow-hidden rounded-card border border-line bg-paper text-sm">
      <thead><tr className="bg-surface text-[12.5px] text-muted">{['الاسم', 'النوع', 'الحالة', 'إجراءات'].map((h) => <th key={h} className="px-3.5 py-2.5 text-right font-semibold">{h}</th>)}</tr></thead>
      <tbody>
        {rows.map(([n, t, st, action, ac]) => (
          <tr key={n}>
            <td className="border-t border-line px-3.5 py-3">{n}</td>
            <td className="border-t border-line px-3.5 py-3">{t}</td>
            <td className="border-t border-line px-3.5 py-3"><span className={badge(st === 'قيد المراجعة' ? 'bg-surface text-muted' : 'bg-green-tint text-green-deep')}>{st}</span></td>
            <td className="border-t border-line px-3.5 py-3"><button className={['font-semibold', ac === 'star' ? 'text-star' : 'text-green'].join(' ')}>{action}</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export function Reviews() {
  const rows = [
    ['«جهاز أصلي والسعر ممتاز» — 5.0', 'iPhone 15 Pro Max', 'BK-7F42Q ✓'],
    ['«الاستلام كان سريعاً» — 4.0', 'Galaxy S24', 'BK-6620P ✓'],
  ]
  return (
    <table className="w-full overflow-hidden rounded-card border border-line bg-paper text-sm">
      <thead><tr className="bg-surface text-[12.5px] text-muted">{['التقييم', 'المنتج', 'الحجز المرتبط', 'إجراء'].map((h) => <th key={h} className="px-3.5 py-2.5 text-right font-semibold">{h}</th>)}</tr></thead>
      <tbody>
        {rows.map(([r, p, b]) => (
          <tr key={b}>
            <td className="border-t border-line px-3.5 py-3">{r}</td>
            <td className="border-t border-line px-3.5 py-3">{p}</td>
            <td className="num border-t border-line px-3.5 py-3">{b}</td>
            <td className="border-t border-line px-3.5 py-3 whitespace-nowrap"><button className="font-semibold text-green">قبول</button> · <button className="font-semibold text-star">رفض</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export function Backup() {
  const input = 'h-11 w-full rounded-field border border-line px-3 text-sm outline-none focus:border-green'
  return (
    <div className="max-w-[520px] rounded-card border border-line bg-paper p-[18px]">
      <h4 className="mb-3 text-sm font-bold">النسخ الاحتياطي</h4>
      <div className="rounded-[9px] bg-green-tint px-3 py-2.5 text-[13px] font-semibold text-green-deep">آخر نسخة ناجحة: اليوم ٠٣:٠٠ · <span className="num">412 م.ب</span></div>
      <div className="mb-3.5 mt-[18px]"><label className="mb-1.5 block text-[12.5px] font-semibold">الجدولة</label><select className={input}><option>يومي ٠٣:٠٠</option><option>أسبوعي</option></select></div>
      <button className="rounded-field border-[1.5px] border-green px-5 py-2.5 text-sm font-semibold text-green hover:bg-green-tint">استعادة نسخة…</button>
      <p className="mt-3 text-xs text-muted">الاستعادة تتطلب كتابة كلمة «استعادة» للتأكيد.</p>
    </div>
  )
}
