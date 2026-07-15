import RoleGuard from '@/components/RoleGuard';
import DashboardLayout from '@/components/DashboardLayout';

const ACCOUNT_TABS = [
  { href: '/account', label: 'الملف', end: true },
  { href: '/account/favorites', label: 'المفضلة' },
  { href: '/account/alerts', label: 'تنبيهات السعر' },
  { href: '/account/bookings', label: 'حجوزاتي' },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard roles={['user', 'vendor', 'admin']}>
      <DashboardLayout title="حسابي" tabs={ACCOUNT_TABS}>
        {children}
      </DashboardLayout>
    </RoleGuard>
  );
}
