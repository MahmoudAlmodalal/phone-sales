import { PRODUCTS } from '../data/products.js'

/**
 * Live price ticker that scrolls the current market. The row is duplicated so
 * the CSS marquee loops seamlessly; it pauses on hover. Green = price drop,
 * red = price rise (the only sanctioned red-for-loss use here).
 *
 * The keyframes live in index.css (`ticker` animation) since Tailwind has no
 * built-in marquee.
 */
export default function PriceTicker() {
  const row = [...PRODUCTS, ...PRODUCTS]
  return (
    <div className="overflow-hidden border-b border-line bg-[#fbfcfb]">
      <div className="flex w-max animate-ticker hover:[animation-play-state:paused]">
        {row.map((p, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 whitespace-nowrap border-s border-line px-5 py-3 text-[13px]"
          >
            <span className="font-semibold">{p.name}</span>
            <span className="num text-sm">{p.from}</span>
            <span
              className={[
                'inline-flex items-center gap-0.5 text-xs font-semibold',
                p.drop ? 'text-green' : 'text-star',
              ].join(' ')}
            >
              <span>{p.drop ? '▼' : '▲'}</span>
              {p.drop || p.rise}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
