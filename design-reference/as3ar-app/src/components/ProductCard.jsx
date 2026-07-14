import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'

/**
 * Product card shared across home / search / favorites.
 * - Phone-body placeholder (no invented product photography)
 * - Favorite heart (star-red only when active — a "loss avoidance" cue)
 * - Price + 7-day change badge (green = drop, red = rise)
 * - Optional "add to compare" toggle
 */
export default function ProductCard({ product, showCompare = false }) {
  const { favorites, toggleFavorite, compare, toggleCompare } = useApp()
  const isFav = favorites.includes(product.id)
  const inCompare = compare.includes(product.id)

  return (
    <div className="relative flex flex-col gap-1.5 rounded-card border border-line bg-paper p-3.5 transition-colors hover:border-[#c4cec9]">
      <button
        onClick={() => toggleFavorite(product.id)}
        aria-label={isFav ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
        aria-pressed={isFav}
        className={[
          'absolute end-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border text-base transition-colors',
          isFav
            ? 'border-star-tint bg-star-tint text-star'
            : 'border-line bg-white/90 text-muted hover:text-ink',
        ].join(' ')}
      >
        ♥
      </button>

      <Link
        to={`/product/${product.id}`}
        className="mb-1.5 flex h-36 items-center justify-center rounded-[10px] bg-gradient-to-b from-[#eef1f0] to-[#e2e8e5]"
      >
        <span className="relative h-24 w-12 rounded-xl border-2 border-[#cfd8d4] bg-white after:absolute after:left-1/2 after:top-1.5 after:h-[3px] after:w-4 after:-translate-x-1/2 after:rounded after:bg-[#cfd8d4]" />
      </Link>

      <Link to={`/product/${product.id}`} className="text-[14.5px] font-semibold leading-6 text-ink hover:text-green">
        {product.name}
      </Link>
      <div className="text-[11.5px] text-muted">ابتداءً من</div>

      <div className="flex items-center gap-2">
        <span className="num text-[22px] font-semibold">{product.from}</span>
        <span className="text-xs text-muted">ر.س</span>
        {product.drop ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-tint px-2 py-0.5 text-xs font-semibold text-green-deep">
            ▼ {product.drop}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-star-tint px-2 py-0.5 text-xs font-semibold text-star">
            ▲ {product.rise}
          </span>
        )}
      </div>
      <div className="text-xs text-muted">من {product.stores} متاجر · فرق {product.diff} ر.س</div>

      {showCompare && (
        <button
          onClick={() => toggleCompare(product.id)}
          className={[
            'mt-1.5 flex items-center justify-center gap-2 rounded-field border p-2 text-[13px] transition-colors',
            inCompare
              ? 'border-green bg-green text-white'
              : 'border-dashed border-line text-ink hover:border-green hover:text-green',
          ].join(' ')}
        >
          {inCompare ? '✓ في المقارنة' : '☐ أضف للمقارنة'}
        </button>
      )}
    </div>
  )
}
