'use client';

import { useState } from 'react';
import { ADMIN_USERS, ADMIN_STORES, PENALTY_LOG, ADMIN_COMPLAINTS, type AdminUser, type AdminStore } from '@/lib/dash-data';
import { useToastStore } from '@/stores/toast';
import ConfirmDialog from '@/components/dash/ConfirmDialog';
import MerchantProfileDrawer from '@/components/dash/MerchantProfileDrawer';

const STATUS_BADGE: Record<AdminUser['status'], [string, string]> = {
  verified: ['st-badge st-active', 'موثّق'],
  active: ['st-badge st-active', 'نشط'],
  pending: ['st-badge st-cancel', 'قيد المراجعة'],
  suspended: ['st-badge st-cancel', 'معلّق'],
};

export default function AdminUsers() {
  const toast = useToastStore((s) => s.push);
  const [users, setUsers] = useState<AdminUser[]>(ADMIN_USERS);
  const [blocking, setBlocking] = useState<AdminUser | null>(null);
  const [profile, setProfile] = useState<AdminStore | null>(null);

  const setStatus = (id: string, status: AdminUser['status'], msg: string) => {
    setUsers((us) => us.map((u) => (u.id === id ? { ...u, status } : u)));
    toast(msg);
  };

  return (
    <>
      <table className="dtable">
        <thead><tr><th>الاسم</th><th>النوع</th><th>الحالة</th><th>إجراءات</th></tr></thead>
        <tbody>
          {users.map((u) => {
            const isVendor = u.type === 'بائع';
            const store = isVendor ? ADMIN_STORES.find((s) => s.name === u.name) : undefined;
            const blockLabel = isVendor ? 'تعليق' : 'تقييد';
            return (
              <tr key={u.id}>
                <td data-th="الاسم">{u.name}</td>
                <td data-th="النوع">{u.type}</td>
                <td data-th="الحالة"><span className={STATUS_BADGE[u.status][0]}>{STATUS_BADGE[u.status][1]}</span></td>
                <td data-th="إجراءات">
                  <div className="row-acts">
                    {isVendor && store && (
                      <button className="act-profile" onClick={() => setProfile(store)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6M9 13h6M9 17h4" /></svg>
                        ملف الامتثال
                      </button>
                    )}
                    {u.status === 'pending' && (
                      <button className="btn sm" onClick={() => setStatus(u.id, 'verified', `✓ وُثّق «${u.name}» وأصبح ظاهراً للعملاء`)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                        توثيق
                      </button>
                    )}
                    {(u.status === 'verified' || u.status === 'active') && (
                      <button className="act-del" onClick={() => setBlocking(u)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M5.6 5.6l12.8 12.8" /></svg>
                        {blockLabel}
                      </button>
                    )}
                    {u.status === 'suspended' && <span style={{ fontSize: 12.5, color: 'var(--muted)' }}>أُوقف الحساب</span>}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {blocking && (
        <ConfirmDialog
          title={`${blocking.type === 'بائع' ? 'تعليق' : 'تقييد'} «${blocking.name}»؟`}
          body={
            blocking.type === 'بائع'
              ? 'سيُخفى المتجر ومنتجاته من نتائج المقارنة فوراً حتى ترفع التعليق.'
              : 'لن يستطيع هذا المستخدم إجراء حجوزات جديدة حتى يُرفع القيد.'
          }
          okLabel={blocking.type === 'بائع' ? 'تعليق' : 'تقييد'}
          danger
          onOk={() => {
            setStatus(blocking.id, 'suspended', `${blocking.type === 'بائع' ? 'عُلّق' : 'قُيّد'} «${blocking.name}»`);
            setBlocking(null);
          }}
          onCancel={() => setBlocking(null)}
        />
      )}

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
