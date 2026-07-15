'use client';

import { useState } from 'react';
import { ADMIN_REVIEWS, type AdminReview } from '@/lib/dash-data';
import { useToastStore } from '@/stores/toast';
import ConfirmDialog from '@/components/dash/ConfirmDialog';

export default function AdminReviews() {
  const toast = useToastStore((s) => s.push);
  const [reviews, setReviews] = useState<AdminReview[]>(ADMIN_REVIEWS);
  const [rejecting, setRejecting] = useState<AdminReview | null>(null);

  const remove = (id: string, msg: string) => {
    setReviews((rs) => rs.filter((r) => r.id !== id));
    toast(msg);
  };

  return (
    <>
      {reviews.length > 0 && (
        <table className="dtable">
          <thead><tr><th>التقييم</th><th>المنتج</th><th>الحجز المرتبط</th><th>إجراء</th></tr></thead>
          <tbody>
            {reviews.map((r) => (
              <tr key={r.id}>
                <td data-th="التقييم">{r.text}</td>
                <td data-th="المنتج">{r.product}</td>
                <td data-th="الحجز" className="mono">{r.booking} ✓</td>
                <td data-th="إجراء">
                  <div className="row-acts">
                    <button className="btn sm" onClick={() => remove(r.id, '✓ قُبل التقييم ونُشر على صفحة المنتج')}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                      قبول
                    </button>
                    <button className="act-del" onClick={() => setRejecting(r)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                      رفض
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {reviews.length === 0 && (
        <div className="empty">
          <h3>لا تقييمات بانتظار المراجعة</h3>
          <p>راجعت كل التقييمات المعلّقة. ستظهر التقييمات الجديدة هنا فور ربطها بحجز مُستلَم.</p>
        </div>
      )}

      {rejecting && (
        <ConfirmDialog
          title="رفض هذا التقييم؟"
          body="سيُحذف التقييم ولن يظهر للعملاء. استخدم الرفض للمحتوى المخالف أو المكرر."
          okLabel="رفض التقييم"
          danger
          onOk={() => { remove(rejecting.id, 'رُفض التقييم وأُزيل من قائمة المراجعة'); setRejecting(null); }}
          onCancel={() => setRejecting(null)}
        />
      )}
    </>
  );
}
