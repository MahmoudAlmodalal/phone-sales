export default function EmptyState({
  icon = '🔍',
  title,
  description,
  actionLabel,
  onAction,
}: {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="rounded-card border-2 border-dashed border-line py-14 text-center">
      <div className="text-3xl">{icon}</div>
      <h3 className="mt-3 text-lg font-bold">{title}</h3>
      {description && <p className="mt-2 text-sm text-muted">{description}</p>}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-6 rounded-field bg-green px-5 py-3 text-sm font-semibold text-white hover:bg-green-deep"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
