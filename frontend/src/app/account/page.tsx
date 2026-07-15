export default function Profile() {
  const field = 'mb-3.5';
  const input = 'h-11 w-full rounded-field border border-line px-3 text-sm outline-none focus:border-green';
  const rows: [string, string, 'rtl' | 'ltr'][] = [
    ['الاسم', 'عبدالله الشمري', 'rtl'],
    ['البريد الإلكتروني', 'a.alshammari@example.com', 'ltr'],
    ['الجوال', '+966 55 123 4567', 'ltr'],
  ];
  return (
    <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[280px_1fr]">
      <aside className="rounded-card border border-line bg-paper p-[18px]">
        <h4 className="mb-3 text-sm font-bold">حالة الحساب</h4>
        <div className="rounded-[9px] bg-green-tint px-3 py-2.5 text-[13px] font-semibold text-green-deep">جيدة — لا قيود على الحجز</div>
        <p className="mt-3.5 text-[12.5px] leading-7 text-muted">تلتزم بالحضور في مواعيد حجوزاتك. الإلغاء المتكرر قد يقيّد الحساب مؤقتاً.</p>
      </aside>
      <div className="rounded-card border border-line bg-paper p-[18px]">
        {rows.map(([l, v, dir]) => (
          <div key={l} className={field}>
            <label className="mb-1.5 block text-[12.5px] font-semibold">{l}</label>
            <input dir={dir} defaultValue={v} className={`${input} ${dir === 'ltr' ? 'num' : ''}`} />
          </div>
        ))}
        <div className={field}><label className="mb-1.5 block text-[12.5px] font-semibold">اللغة</label><select className={input}><option>العربية</option><option>English</option></select></div>
        <button className="rounded-field bg-green px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-deep">حفظ التغييرات</button>
      </div>
    </div>
  );
}
