import RoleGuard from '@/components/RoleGuard';
import DashboardLayout from '@/components/DashboardLayout';

const ADMIN_TABS = [
  { href: '/admin', label: 'صحة النظام', end: true },
  { href: '/admin/users', label: 'المستخدمون والبائعون' },
  { href: '/admin/reviews', label: 'مراجعة التقييمات' },
  { href: '/admin/backup', label: 'النسخ الاحتياطي' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard roles={['admin']}>
      <DashboardLayout title="لوحة الإدارة" tabs={ADMIN_TABS} dense>
        {children}
      </DashboardLayout>
    </RoleGuard>
  );
}
