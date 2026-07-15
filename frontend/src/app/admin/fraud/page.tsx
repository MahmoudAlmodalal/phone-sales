'use client';

import { useEffect, useState } from 'react';
import { FRAUD_ALERTS, PENALTY_LOG, FRAUD_POINTS, type FraudAlert, type PenaltyEntry, ar } from '@/lib/dash-data';
import { useToastStore } from '@/stores/toast';

const TYPE_LABEL: Record<FraudAlert['type'], string> = {
  hike: 'رفع بعد الحجز',
  dup: 'حجوزات مكرّرة',
  spike: 'تذبذب سعري',
};

export default function AdminFraud() {
  const toast = useToastStore((s) => s.push);
  const [alerts, setAlerts] = useState<FraudAlert[]>(FRAUD_ALERTS);
  const [penalties, setPenalties] = useState<PenaltyEntry[]>(PENALTY_LOG);
  const [scans, setScans] = useState(0);

  // fake live engine heartbeat (design's `engine-live` counter)
  useEffect(() => {
    const t = setInterval(() => setScans((n) => n + 1), 4000);
    return () => clearInterval(t);
  }, []);

  const open = alerts.filter((f) => !f.resolved);
  const urgent = open.filter((f) => f.urgent).length;
  const stores = new Set(open.map((f) => f.store)).size;
  const totalPoints = penalties.reduce((a, p) => a + p.points, 0);

  const penalize = (f: FraudAlert) => {
    setAlerts((as) => as.map((x) => (x.id === f.id ? { ...x, resolved: true } : x)));
    setPenalties((ps) => [
      { id: `pl${Date.now()}`, store: f.store, action: 'عقوبة يدوية', detail: f.title, points: FRAUD_POINTS[f.type], when: 'الآن' },
      ...ps,
    ]);
    toast(`⚠ سُجّلت عقوبة −${FRAUD_POINTS[f.type]} نقطة على «${f.store}»`);
  };

  const dismiss = (id: string) => {
    setAlerts((as) => as.filter((x) => x.id !== id));
    toast('أُغلق التنبيه دون عقوبة');
  };

  return (
    <>
      <div className="fraud-kpis">
        <div className="fk"><span className="fk-lbl">تنبيهات نشطة اليوم</span><span className="fk-val">{ar(open.length)}</span><span className="fk-sub">من محرك الرصد الآلي</span></div>
        <div className="fk hot"><span className="fk-lbl">حالات عاجلة</span><span className="fk-val">{ar(urgent)}</span><span className="fk-sub">تتطلب إجراءً فورياً</span></div>
        <div className="fk"><span className="fk-lbl">متاجر تحت المراقبة</span><span className="fk-val">{ar(stores)}</span><span className="fk-sub">مرتبطة بأنماط مشبوهة</span></div>
        <div className="fk"><span className="fk-lbl">نقاط العقوبات المسجّلة</span><span className="fk-val">{ar(totalPoints)}</span><span className="fk-sub">تراكمية عبر السجلّ</span></div>
      </div>

      <div className="sec-title">
        <h3>تنبيهات الرصد الآلي</h3>
        <span className="engine-live"><span className="lv" />المحرك يعمل · آخر فحص الآن · {ar(scans)} دورة رصد</span>
      </div>

      {alerts.map((f) => (
        <div key={f.id} className={`fraud-card${f.resolved ? ' resolved' : f.urgent ? ' urgent' : ''}`}>
          <div className="fraud-top">
            <span className={`fraud-badge ${f.resolved ? 'resolved' : f.urgent ? 'hi' : 'md'}`}>
              {f.resolved ? 'تمّت المعالجة' : f.urgent ? 'عاجل' : 'مراقبة'}
            </span>
            <span className="fraud-type">{TYPE_LABEL[f.type]}</span>
            <span className="fraud-when">{f.when}</span>
            <span className="fraud-delta">{f.delta}</span>
          </div>
          <div className="fraud-body">
            <div className="fraud-h">{f.title} — <span className="fraud-store">{f.store}</span></div>
            <div className="fraud-detail">{f.detail}</div>
          </div>
          {f.resolved && <div className="fraud-done">✓ عولجت وسُجّلت في سجل العقوبات</div>}
          {!f.resolved && (
            <div className="fraud-btns">
              <button className="act-manual" onClick={() => dismiss(f.id)}>إغلاق التنبيه</button>
              <button className="btn sm btn-danger" onClick={() => penalize(f)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 3 7v6c0 5 3.8 8.4 9 9 5.2-.6 9-4 9-9V7Z" /><path d="M12 8v4M12 16h.01" /></svg>
                تسجيل عقوبة
              </button>
            </div>
          )}
        </div>
      ))}

      <div className="sec-title" style={{ marginTop: 26 }}>
        <h3>سجل العقوبات الموحّد</h3>
        <span className="sec-note">Penalty logging metrics</span>
      </div>
      <table className="dtable">
        <thead><tr><th>المتجر</th><th>نوع العلامة</th><th>التفاصيل</th><th>النقاط</th></tr></thead>
        <tbody>
          {penalties.map((p) => (
            <tr key={p.id}>
              <td data-th="المتجر"><b>{p.store}</b></td>
              <td data-th="النوع">
                <span className={p.action.includes('Automated') || p.action.includes('آلي') ? 'flag-auto' : 'flag-man'}>{p.action}</span>
              </td>
              <td data-th="التفاصيل" className="pen-detail">{p.detail}</td>
              <td data-th="النقاط" className="pen-pts">−{p.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
