export default function Backup() {
  const input = 'h-11 w-full rounded-field border border-line px-3 text-sm outline-none focus:border-green';
  return (
    <div className="max-w-[520px] rounded-card border border-line bg-paper p-[18px]">
      <h4 className="mb-3 text-sm font-bold">النسخ الاحتياطي</h4>
      <div className="rounded-[9px] bg-green-tint px-3 py-2.5 text-[13px] font-semibold text-green-deep">
        آخر نسخة ناجحة: اليوم ٠٣:٠٠ · <span dir="ltr" className="num">412 م.ب</span>
      </div>
      <div className="mb-3.5 mt-[18px]">
        <label className="mb-1.5 block text-[12.5px] font-semibold">الجدولة</label>
        <select className={input}><option>يومي ٠٣:٠٠</option><option>أسبوعي</option></select>
      </div>
      <button className="rounded-field border-[1.5px] border-green px-5 py-2.5 text-sm font-semibold text-green hover:bg-green-tint">استعادة نسخة…</button>
      <p className="mt-3 text-xs text-muted">الاستعادة تتطلب كتابة كلمة «استعادة» للتأكيد.</p>
    </div>
  );
}
