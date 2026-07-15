'use client';

import { useState } from 'react';
import { useToastStore } from '@/stores/toast';

export default function AdminBackup() {
  const toast = useToastStore((s) => s.push);
  const [restoreOpen, setRestoreOpen] = useState(false);
  const [input, setInput] = useState('');

  const valid = input.trim() === 'استعادة';

  const doRestore = () => {
    if (!valid) return;
    setRestoreOpen(false);
    setInput('');
    toast('⟳ بدأت الاستعادة من نسخة اليوم ٠٣:٠٠ — تشغيل الهجرة…');
  };

  return (
    <>
      <div className="side-card" style={{ maxWidth: 520 }}>
        <h4>النسخ الاحتياطي</h4>
        <div className="acct-good">آخر نسخة ناجحة: اليوم ٠٣:٠٠ · <span className="mono">412 م.ب</span></div>
        <div className="field" style={{ marginTop: 18 }}>
          <label>الجدولة</label>
          <select><option>يومي ٠٣:٠٠</option><option>أسبوعي</option></select>
        </div>
        <button className="btn btn-ghost" onClick={() => setRestoreOpen(true)}>استعادة نسخة…</button>
        <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 12 }}>الاستعادة تتطلب كتابة كلمة «استعادة» للتأكيد.</p>
      </div>

      {restoreOpen && (
        <div className="modal-ov" onClick={() => setRestoreOpen(false)}>
          <div className="modal confirm-card rst-card" onClick={(e) => e.stopPropagation()} role="alertdialog" aria-modal="true">
            <div className="ic">⟳</div>
            <h3>استعادة قاعدة البيانات</h3>
            <p>
              هذا إجراء حسّاس يستبدل البيانات الحالية بآخر نسخة احتياطية ويشغّل هجرة قاعدة البيانات. للمتابعة، اكتب كلمة{' '}
              <b className="rst-word">استعادة</b> بالأسفل.
            </p>
            <input className="rst-input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="اكتب: استعادة" dir="rtl" />
            <div className="acts" style={{ marginTop: 18 }}>
              <button className="btn btn-ghost" onClick={() => setRestoreOpen(false)}>إلغاء</button>
              <button className={`btn btn-danger${valid ? '' : ' rst-off'}`} onClick={doRestore}>تشغيل الاستعادة</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
