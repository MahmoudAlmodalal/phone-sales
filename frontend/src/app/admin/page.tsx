const ROWS: [boolean, string, string][] = [
  [false, 'Scraper — إكسترا (تغيّرت بنية الصفحة)', 'آخر تشغيل ٠٢:١٤ · فشل — بانتظار إدخال يدوي'],
  [true, 'API Sync — متجر التقنية', 'آخر تشغيل ٠٣:٠٠ · 1.2s'],
  [true, 'API Sync — مكتبة جرير', 'آخر تشغيل ٠٣:٠٠ · 0.9s'],
  [true, 'Cron — توليد Sitemap', 'آخر تشغيل ٠٣:٣٠ · 4.1s'],
  [true, 'Cron — تنبيهات الأسعار', 'آخر تشغيل ٠٤:٠٠ · 2.6s'],
];

export default function Health() {
  return (
    <div className="space-y-2.5">
      {ROWS.map(([ok, n, m]) => (
        <div key={n} className={['flex items-center gap-3.5 rounded-[10px] border bg-paper px-4 py-3', ok ? 'border-line' : 'border-[#f3c9cf]'].join(' ')}>
          <span className={['flex h-[26px] w-[26px] flex-none items-center justify-center rounded-full text-sm font-bold text-white', ok ? 'bg-green' : 'bg-star'].join(' ')}>{ok ? '✓' : '✗'}</span>
          <span className="flex-1 text-sm font-semibold">{n}</span>
          <span dir="ltr" className="num text-xs text-muted">{m}</span>
        </div>
      ))}
    </div>
  );
}
