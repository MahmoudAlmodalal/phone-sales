import Link from 'next/link';
import Star from './Star';

/** The ink (near-black) footer — the base of the flag hierarchy. */
export default function Footer() {
  const cols = [
    { h: 'المنصة', items: ['عن أسعار', 'كيف نحدّث الأسعار', 'اتصل بنا'] },
    { h: 'للبائعين', items: ['سجّل متجرك', 'لوحة البائع', 'الربط التقني (API)'] },
    { h: 'قانوني', items: ['الشروط والأحكام', 'سياسة الخصوصية', 'الإفصاح عن العمولات'] },
  ];

  return (
    <footer className="mt-16 bg-ink text-white/80">
      <div className="mx-auto grid max-w-[1200px] gap-8 px-6 py-12 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-heading text-xl font-extrabold text-white">
            <span className="flex gap-0.5 text-star">
              <Star size={14} />
              <Star size={14} />
              <Star size={14} />
            </span>
            أسعار
          </div>
          <p className="mt-3 text-sm leading-7 text-white/60">
            منصة حيّة لمقارنة أسعار الجوالات عبر المتاجر، والحجز المسبق بالدفع عند الحضور.
          </p>
        </div>
        {cols.map((c) => (
          <div key={c.h}>
            <h4 className="mb-3 text-sm font-bold text-white">{c.h}</h4>
            <ul className="space-y-2 text-sm">
              {c.items.map((i) => (
                <li key={i}>
                  <Link href="/" className="text-white/60 transition-colors hover:text-white">
                    {i}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-[1200px] px-6 py-4 text-xs text-white/40">
          © 2026 أسعار — جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
}
