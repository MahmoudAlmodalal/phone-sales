'use client';

import { useState } from 'react';
import { ADMIN_COMPLAINTS, type AdminComplaint, type Severity, ar } from '@/lib/dash-data';
import { useToastStore } from '@/stores/toast';
import ConfirmDialog from '@/components/dash/ConfirmDialog';

const SEV: Record<Severity, [string, string]> = {
  high: ['sev-badge sev-hi', 'عالية'],
  med: ['sev-badge sev-md', 'متوسطة'],
  low: ['sev-badge sev-lo', 'منخفضة'],
};

const RESOLVED_TXT: Record<Exclude<AdminComplaint['status'], 'open'>, string> = {
  warned: 'أُنذر المتجر',
  frozen: 'جُمّد المتجر',
  hold: 'قيد التحقيق',
};

export default function AdminComplaints() {
  const toast = useToastStore((s) => s.push);
  const [complaints, setComplaints] = useState<AdminComplaint[]>(ADMIN_COMPLAINTS);
  const [freezing, setFreezing] = useState<AdminComplaint | null>(null);

  const openCount = complaints.filter((c) => c.status === 'open').length;

  const act = (id: string, status: AdminComplaint['status'], msg: string) => {
    setComplaints((cs) => cs.map((c) => (c.id === id ? { ...c, status } : c)));
    toast(msg);
  };

  return (
    <>
      <div className="sec-title">
        <h3>شكاوى وبلاغات المستخدمين</h3>
        <span className="sec-note">{ar(openCount)} بلاغ بانتظار القرار</span>
      </div>

      <table className="dtable cmp-table">
        <thead>
          <tr><th>رقم البلاغ</th><th>المستخدم</th><th>المتجر المُبلَّغ عنه</th><th>الوصف</th><th>الخطورة</th><th>القرار</th></tr>
        </thead>
        <tbody>
          {complaints.map((c) => (
            <tr key={c.id}>
              <td data-th="البلاغ" className="mono">{c.id}</td>
              <td data-th="المستخدم">{c.user}</td>
              <td data-th="المتجر"><b>{c.store}</b></td>
              <td data-th="الوصف" className="cmp-ctx">{c.context}</td>
              <td data-th="الخطورة"><span className={SEV[c.severity][0]}>{SEV[c.severity][1]}</span></td>
              <td data-th="القرار">
                {c.status === 'open' ? (
                  <div className="cmp-acts">
                    <button className="btn sm" onClick={() => act(c.id, 'warned', `⚠ أُرسل إنذار آلي لمتجر «${c.store}»`)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4M12 17h.01" /></svg>
                      توجيه إنذار آلي
                    </button>
                    <button className="act-freeze" onClick={() => setFreezing(c)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M4.2 7l15.6 10M19.8 7 4.2 17" /></svg>
                      تجميد المتجر مؤقتاً
                    </button>
                    <button className="act-hold" onClick={() => act(c.id, 'hold', `حُفظ البلاغ ${c.id} للتحقيق`)}>حفظ للتحقيق</button>
                  </div>
                ) : (
                  <span className={`cmp-state ${c.status}`}>{RESOLVED_TXT[c.status]}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {freezing && (
        <ConfirmDialog
          title={`تجميد «${freezing.store}» مؤقتاً؟`}
          body="سيُخفى المتجر ومنتجاته من المقارنة فوراً ويُسجَّل في سجل المخالفات حتى انتهاء التحقيق."
          okLabel="تجميد المتجر"
          danger
          onOk={() => { act(freezing.id, 'frozen', `جُمّد متجر «${freezing.store}» مؤقتاً`); setFreezing(null); }}
          onCancel={() => setFreezing(null)}
        />
      )}
    </>
  );
}
