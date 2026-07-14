import { Routes, Route } from 'react-router-dom'

import RootLayout from './layouts/RootLayout.jsx'
import DashboardLayout from './components/DashboardLayout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { Profile, Favorites, Alerts, Bookings } from './pages/account/AccountTabs.jsx'
import { Overview, Products, Import, VendorBookings } from './pages/vendor/VendorTabs.jsx'
import { Health, Users, Reviews, Backup } from './pages/admin/AdminTabs.jsx'

// Top-level pages (bodies are placeholders at this stage — structure only)
import Home from './pages/Home.jsx'
import Search from './pages/Search.jsx'
import Product from './pages/Product.jsx'
import Compare from './pages/Compare.jsx'
import Booking from './pages/Booking.jsx'
import Auth from './pages/Auth.jsx'
import NotFound from './pages/NotFound.jsx'

// Tab definitions for the three dashboards (routes exist now; content comes later)
const ACCOUNT_TABS = [
  { to: '/account', label: 'الملف', end: true },
  { to: '/account/favorites', label: 'المفضلة' },
  { to: '/account/alerts', label: 'تنبيهات السعر' },
  { to: '/account/bookings', label: 'حجوزاتي' },
]

const VENDOR_TABS = [
  { to: '/vendor', label: 'نظرة عامة', end: true },
  { to: '/vendor/products', label: 'منتجاتي' },
  { to: '/vendor/import', label: 'الاستيراد الجماعي' },
  { to: '/vendor/bookings', label: 'الحجوزات' },
]

const ADMIN_TABS = [
  { to: '/admin', label: 'صحة النظام', end: true },
  { to: '/admin/users', label: 'المستخدمون والبائعون' },
  { to: '/admin/reviews', label: 'مراجعة التقييمات' },
  { to: '/admin/backup', label: 'النسخ الاحتياطي' },
]

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        {/* ---- Public / customer-facing ---- */}
        <Route index element={<Home />} />
        <Route path="search" element={<Search />} />
        <Route path="product/:id" element={<Product />} />
        <Route path="compare" element={<Compare />} />
        <Route path="booking/:id" element={<Booking />} />
        <Route path="login" element={<Auth />} />

        {/* ---- User dashboard (لوحة المستخدم) ---- */}
        <Route
          path="account"
          element={
            <ProtectedRoute roles={['user', 'vendor', 'admin']}>
              <DashboardLayout title="حسابي" tabs={ACCOUNT_TABS} />
            </ProtectedRoute>
          }
        >
          <Route index element={<Profile />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="bookings" element={<Bookings />} />
        </Route>

        {/* ---- Vendor dashboard (لوحة البائع) ---- */}
        <Route
          path="vendor"
          element={
            <ProtectedRoute roles={['vendor', 'admin']}>
              <DashboardLayout title="لوحة البائع — متجر التقنية" tabs={VENDOR_TABS} />
            </ProtectedRoute>
          }
        >
          <Route index element={<Overview />} />
          <Route path="products" element={<Products />} />
          <Route path="import" element={<Import />} />
          <Route path="bookings" element={<VendorBookings />} />
        </Route>

        {/* ---- Admin dashboard (لوحة الإدارة) ---- */}
        <Route
          path="admin"
          element={
            <ProtectedRoute roles={['admin']}>
              <DashboardLayout title="لوحة الإدارة" tabs={ADMIN_TABS} dense />
            </ProtectedRoute>
          }
        >
          <Route index element={<Health />} />
          <Route path="users" element={<Users />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="backup" element={<Backup />} />
        </Route>

        {/* ---- 404 ---- */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
