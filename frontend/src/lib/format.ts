/**
 * Formatting helpers per the design brief: prices/numbers render in IBM Plex
 * Mono, kept LTR with Latin digits even inside RTL Arabic pages (Intl's
 * 'ar-SA-u-nu-latn' locale gives Arabic grouping/decimal conventions without
 * switching to Eastern Arabic numerals). Every numeric span should also carry
 * `dir="ltr"` and the `num` utility class (see globals.css) at the call site.
 */

const moneyFormatter = new Intl.NumberFormat('ar-SA-u-nu-latn', {
  maximumFractionDigits: 0,
});

const relTimeFormatter = new Intl.RelativeTimeFormat('ar', { numeric: 'auto' });

export function money(value: number | string): string {
  const n = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;
  return `${moneyFormatter.format(n)} ر.س`;
}

export function pct(value: number): string {
  const n = Math.abs(value);
  const arrow = value < 0 ? '▼' : '▲';
  return `${arrow} ${moneyFormatter.format(n)}%`;
}

export function relTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const diffMs = d.getTime() - Date.now();
  const diffMin = Math.round(diffMs / 60000);
  if (Math.abs(diffMin) < 60) return relTimeFormatter.format(diffMin, 'minute');
  const diffHour = Math.round(diffMin / 60);
  if (Math.abs(diffHour) < 24) return relTimeFormatter.format(diffHour, 'hour');
  const diffDay = Math.round(diffHour / 24);
  return relTimeFormatter.format(diffDay, 'day');
}

export function date(d: Date | string): string {
  const dt = typeof d === 'string' ? new Date(d) : d;
  return new Intl.DateTimeFormat('ar-SA-u-nu-latn', { day: 'numeric', month: 'long' }).format(dt);
}

/** mm:ss / hh:mm:ss countdown formatter used by the booking hold timer. */
export function countdown(totalSeconds: number): string {
  const s = Math.max(0, totalSeconds);
  return [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60]
    .map((n) => String(n).padStart(2, '0'))
    .join(':');
}
