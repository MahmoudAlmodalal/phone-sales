'use client';

import { useToastStore } from '@/stores/toast';

/** Toast queue host — grey neutral by default, red only for destructive actions. */
export default function ToastHost() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-24 z-50 mx-auto flex max-w-sm flex-col gap-2 px-4">
      {toasts.map((t) => (
        <button
          key={t.id}
          onClick={() => dismiss(t.id)}
          className={[
            'rounded-field px-4 py-3 text-start text-[13px] font-semibold shadow-soft',
            t.variant === 'destructive' ? 'bg-star-tint text-star' : 'bg-ink text-white',
          ].join(' ')}
        >
          {t.message}
        </button>
      ))}
    </div>
  );
}
