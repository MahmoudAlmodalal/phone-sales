import Star from './Star';

type BadgeVariant = 'drop' | 'rise' | 'verified' | 'neutral';

const VARIANT_CLASS: Record<BadgeVariant, string> = {
  drop: 'bg-green-tint text-green-deep',
  rise: 'bg-star-tint text-star',
  verified: 'bg-transparent text-star',
  neutral: 'bg-surface text-muted',
};

/**
 * Small pill badge. `rise` is one of the four sanctioned red uses (price
 * increase); `verified` shows the signature star next to "موثّق" reviews —
 * never use red/star for anything else (ratings, generic status, etc).
 */
export default function Badge({
  variant = 'neutral',
  children,
}: {
  variant?: BadgeVariant;
  children: React.ReactNode;
}) {
  if (variant === 'verified') {
    return (
      <span className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-star">
        <Star size={12} /> {children}
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${VARIANT_CLASS[variant]}`}>
      {children}
    </span>
  );
}
