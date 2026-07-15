/**
 * Ratings render as a number + horizontal bar + review count — NEVER as
 * stars. The five-point star is reserved for the booking steps and the
 * "موثّق" verified-review badge only.
 */
export default function RatingBar({
  value,
  count,
  max = 5,
}: {
  value: number;
  count: number;
  max?: number;
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="flex items-center gap-5">
      <div dir="ltr" className="num font-heading text-[42px] font-extrabold leading-none">
        {value.toFixed(1)}
      </div>
      <div className="max-w-[240px] flex-1">
        <div className="h-2 overflow-hidden rounded bg-line">
          <div className="h-full rounded bg-green" style={{ width: `${pct}%` }} />
        </div>
        <div className="mt-1.5 text-[13px] text-muted">{count} تقييماً موثّقاً</div>
      </div>
    </div>
  );
}
