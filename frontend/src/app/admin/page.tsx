'use client';

import { useState } from 'react';
import { ADMIN_JOBS, type AdminJob, ar } from '@/lib/dash-data';
import { useToastStore } from '@/stores/toast';

export default function AdminHealth() {
  const toast = useToastStore((s) => s.push);
  const [jobs, setJobs] = useState<AdminJob[]>(ADMIN_JOBS);

  const okCount = jobs.filter((j) => j.ok).length;
  const allOk = okCount === jobs.length;

  const retry = (id: string) => {
    const j = jobs.find((x) => x.id === id);
    setJobs((js) => js.map((x) => (x.id === id ? { ...x, ok: true, meta: 'أُعيد التشغيل الآن · نجح' } : x)));
    toast(`✓ أُعيد تشغيل «${j?.name}» بنجاح`);
  };

  return (
    <>
      <div className={allOk ? 'acct-good' : 'acct-bad'} style={{ marginBottom: 14 }}>
        {ar(okCount)} من {ar(jobs.length)} مهام تعمل بشكل سليم · تُراقَب المهام كل ساعة
      </div>
      {jobs.map((j) => (
        <div key={j.id} className={`health-card${j.ok ? '' : ' fail'}`}>
          <span className={`st-ico ${j.ok ? 'ok' : 'no'}`}>{j.ok ? '✓' : '✗'}</span>
          <span className="nm">{j.name}</span>
          <span className="meta">{j.meta}</span>
          {!j.ok && (
            <div className="job-acts">
              <button className="act-manual" onClick={() => toast(`فُتح نموذج الإدخال اليدوي لأسعار «${j.name}»`)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
                إدخال يدوي
              </button>
              <button className="btn sm" onClick={() => retry(j.id)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6" /><path d="M20.5 15a9 9 0 1 1-2.1-9.4L23 10" /></svg>
                إعادة تشغيل
              </button>
            </div>
          )}
        </div>
      ))}
    </>
  );
}
