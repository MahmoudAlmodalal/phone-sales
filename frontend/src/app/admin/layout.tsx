import '../dashboards.css';
import RoleGuard from '@/components/RoleGuard';
import DashShell from '@/components/dash/DashShell';
import { FRAUD_URGENT_COUNT, ADMIN_COMPLAINTS_OPEN } from '@/lib/dash-data';

const ADMIN_TABS = [
  { href: '/admin', label: 'صحة النظام', end: true },
  { href: '/admin/fraud', label: 'مكافحة الاستغلال', alert: FRAUD_URGENT_COUNT },
  { href: '/admin/complaints', label: 'شكاوى وبلاغات المستخدمين', alert: ADMIN_COMPLAINTS_OPEN, alertAmber: true },
  { href: '/admin/merchants', label: 'متابعة المتاجر' },
  { href: '/admin/users', label: 'المستخدمون والبائعون' },
  { href: '/admin/reviews', label: 'مراجعة التقييمات' },
  { href: '/admin/backup', label: 'النسخ الاحتياطي' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard roles={['admin']}>
      <DashShell
        title="لوحة الإدارة"
        subtitle="مراقبة صحة النظام وإدارة المستخدمين والمحتوى"
        admin
        tabs={ADMIN_TABS}
      >
        {children}
      </DashShell>
    </RoleGuard>
  );
}
