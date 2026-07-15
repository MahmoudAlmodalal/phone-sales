'use client';

import { useState } from 'react';
import { ADMIN_STORES, PENALTY_LOG, ADMIN_COMPLAINTS, type AdminStore, ar } from '@/lib/dash-data';
import MerchantProfileDrawer from '@/components/dash/MerchantProfileDrawer';

const RISK_TXT = { high: 'مخاطر عالية', med: 'مخاطر متوسطة', low: 'ملتزم' } as const;

export default function AdminMerchants() {
  const [profile, setProfile] = useState<AdminStore | null>(null);

  return (
    <>
      <div className="sec-title">
        <h3>لوحة متابعة ومراقبة المتاجر</h3>
        <span className="sec-note">اضغط على أي متجر لعرض ملف الامتثال الكامل</span>
      </div>

      <div className="store-grid">
        {ADMIN_STORES.map((m) => {
          const frozen = m.status === 'frozen';
          return (
            <div
              key={m.id}
              className={`store-card${frozen ? ' frozen' : m.status === 'flagged' ? ' flagged' : ''}`}
              onClick={() => setProfile(m)}
            >
              <div className="store-head">
                <span className="store-name">{m.name}</span>
                <span className={`risk-badge ${frozen ? 'frozen' : m.risk}`}>{frozen ? 'مجمّد' : RISK_TXT[m.risk]}</span>
              </div>
              <div className="store-metrics">
                <div className="sm-cell"><span className="sm-lbl">حجوزات نشطة</span><span className="sm-val">{ar(m.bookings)}</span></div>
                <div className="sm-cell">
                  <span className="sm-lbl">نسبة الإلغاء</span>
                  <span className={`m-val ${m.cancelRate >= 20 ? 'm-bad' : m.cancelRate >= 12 ? 'm-warn' : 'm-ok'}`}>{ar(m.cancelRate)}٪</span>
                </div>
                <div className="sm-cell"><span className="sm-lbl">تحديث الأسعار</span><span className="sm-freq">{m.freq}</span></div>
              </div>
              <div className="store-foot">
                <span className="store-rating">★ {m.rating}</span>
                <span className="store-flags">{ar(m.flags)} مخالفة مسجّلة</span>
                <span className="store-open">الملف ←</span>
              </div>
            </div>
          );
        })}
      </div>

      {profile && (
        <MerchantProfileDrawer
          store={profile}
          penalties={PENALTY_LOG.filter((p) => p.store === profile.name)}
          complaints={ADMIN_COMPLAINTS.filter((c) => c.store === profile.name)}
          onClose={() => setProfile(null)}
        />
      )}
    </>
  );
}
