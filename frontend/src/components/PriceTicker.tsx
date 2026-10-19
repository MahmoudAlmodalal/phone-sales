import Link from 'next/link';
import { PRODUCTS } from '@/lib/mock-data';

/**
 * Live price ticker that scrolls the current market. The row is duplicated so
 * the CSS marquee loops seamlessly; it pauses on hover or focus. Green = price drop,
 * red = price rise (the only sanctioned red-for-loss use here).
 */
export default function PriceTicker() {
  const row = [...PRODUCTS, ...PRODUCTS];
  return (
    <div
      className="overflow-hidden border-b border-line bg-[#fbfcfb]"
      role="region"
      aria-label="شريط الأسعار المباشرة المتغيرة"
    >
      <div className="flex w-max animate-ticker hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]">
        {row.map((p, i) => (
          <Link
            key={`${p.id}-${i}`}
            href={`/product/${p.id}`}
            title={`عرض تفاصيل ومقارنة أسعار ${p.name}`}
            className="flex items-center gap-2.5 whitespace-nowrap border-s border-line px-5 py-3 text-[13px] text-ink transition-colors hover:bg-green-tint/50 focus-visible:bg-green-tint/60"
          >
            <span className="font-bold text-ink hover:text-green">{p.name}</span>
            <span dir="ltr" className="num text-sm font-semibold">{p.from} ر.س</span>
            <span
              className={[
                'inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-bold',
                p.drop ? 'bg-green-tint text-green-deep' : 'bg-star-tint text-star',
              ].join(' ')}
            >
              <span>{p.drop ? '▼' : '▲'}</span>
              {p.drop || p.rise}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

