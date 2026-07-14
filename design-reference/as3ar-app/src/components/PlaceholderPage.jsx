/**
 * Neutral placeholder for pages whose bodies aren't built yet.
 * A dashed card that names the screen and (optionally) what will live there,
 * so the routing/structure is verifiable before content lands.
 */
export default function PlaceholderPage({ title, note }) {
  return (
    <section className="rounded-card border-2 border-dashed border-line bg-paper/60 px-6 py-14 text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-tint text-green">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M3 9h18M8 4v5" />
        </svg>
      </div>
      <h2 className="text-lg font-bold text-ink">{title}</h2>
      {note && <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-muted">{note}</p>}
      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted/70">
        قيد الإنشاء — الهيكل جاهز
      </p>
    </section>
  )
}
