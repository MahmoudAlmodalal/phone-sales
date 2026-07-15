'use client';

/**
 * Generic confirm modal (the design's `askOpen` pattern): warning icon for
 * destructive actions, plain check otherwise. Rendered inside a `.dash` tree.
 */
export default function ConfirmDialog({
  title,
  body,
  okLabel,
  danger = false,
  icon,
  onOk,
  onCancel,
}: {
  title: string;
  body: string;
  okLabel: string;
  danger?: boolean;
  icon?: string;
  onOk: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="modal-ov" onClick={onCancel}>
      <div className="modal confirm-card" onClick={(e) => e.stopPropagation()} role="alertdialog" aria-modal="true">
        <div className={danger ? 'ic' : 'ic ok'}>{icon ?? (danger ? '⚠' : '✓')}</div>
        <h3>{title}</h3>
        <p>{body}</p>
        <div className="acts">
          <button className="btn btn-ghost" onClick={onCancel}>تراجع</button>
          <button className={danger ? 'btn btn-danger' : 'btn'} onClick={onOk}>{okLabel}</button>
        </div>
      </div>
    </div>
  );
}
