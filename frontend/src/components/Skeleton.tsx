/** Pulsing rectangle placeholder — per brief, loading states never use spinners. */
export default function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-[8px] bg-line/60 ${className}`} />;
}
