/**
 * Store profile page — new in the route map (not in the original prototype).
 * Minimal for this frontend-only phase; Phase 13/15 will flesh out reviews
 * and vendor-facing management once the real store/review APIs exist.
 */
export default async function StorePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6">
      <div className="rounded-card border border-line bg-paper p-6">
        <h1 className="text-2xl font-extrabold">{decodeURIComponent(slug)}</h1>
        <p className="mt-2 text-sm text-muted">صفحة المتجر — قيد الإنشاء ضمن مراحل لاحقة.</p>
      </div>
    </div>
  );
}
