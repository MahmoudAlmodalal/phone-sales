'use client';

import { type AdminStore, type PenaltyEntry, type AdminComplaint, ar } from '@/lib/dash-data';

const RISK_TXT = { high: 'مخاطر عالية', med: 'مخاطر متوسطة', low: 'ملتزم' } as const;

/**
 * Merchant compliance profile drawer (design's `prof-drawer`): store metrics
 * plus its slice of the penalty log and user complaints.
 */
export default function MerchantProfileDrawer({
  store,
  penalties,
  complaints,
  onClose,
}: {
  store: AdminStore;
  penalties: PenaltyEntry[];
  complaints: AdminComplaint[];
  onClose: () => void;
}) {
  const frozen = store.status === 'frozen';
  return (
    <div className="modal-ov" onClick={onClose}>
      <div className="prof-drawer" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="prof-head">
          <div>
            <div className="prof-name">{store.name}</div>
            <div className="prof-meta">عضو منذ {store.since} · تقييم العملاء {store.rating} ★</div>
          </div>
          <span className={`risk-badge ${frozen ? 'frozen' : store.risk}`}>{frozen ? 'مجمّد' : RISK_TXT[store.risk]}</span>
          <button className="modal-x" onClick={onClose}>✕</button>
        </div>
        <div className="prof-metrics">
          <div className="pm"><span className="pm-lbl">حجوزات نشطة</span><span className="pm-val">{store.bookings}</span></div>
          <div className="pm"><span className="pm-lbl">نسبة الإلغاء</span><span className="pm-val">{ar(store.cancelRate)}٪</span></div>
          <div className="pm"><span className="pm-lbl">تحديث الأسعار</span><span className="pm-val sm">{store.freq}</span></div>
          <div className="pm"><span className="pm-lbl">مخالفات مسجّلة</span><span className="pm-val">{ar(store.flags)}</span></div>
        </div>

        <div className="prof-sec-h">سجل الامتثال والعقوبات</div>
        {penalties.length === 0 && <div className="prof-empty">لا مخالفات مسجّلة — سجل نظيف.</div>}
        {penalties.map((p) => (
          <div key={p.id} className="prof-log">
            <div className="prof-log-top">
              <span className="prof-log-act">{p.action}</span>
              <span className="prof-log-when">{p.when}</span>
              <span className="prof-log-pts">−{p.points}</span>
            </div>
            <div className="prof-log-detail">{p.detail}</div>
          </div>
        ))}

        <div className="prof-sec-h">بلاغات العملاء</div>
        {complaints.length === 0 && <div className="prof-empty">لا بلاغات على هذا المتجر.</div>}
        {complaints.map((c) => (
          <div key={c.id} className="prof-cmp">
            <span className="mono prof-cmp-id">{c.id}</span> <span className="prof-cmp-ctx">{c.context}</span>{' '}
            <span className="prof-cmp-user">— {c.user}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
