import { Outlet } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import DevRoleSwitcher from '../components/DevRoleSwitcher.jsx'
import CompareBar from '../components/CompareBar.jsx'

/**
 * The outer shell wrapping every route:
 *   green Navbar (top, sticky)  ->  page content (<Outlet/>)  ->  ink Footer.
 * DevRoleSwitcher is a development-only helper for flipping the viewer role.
 */
export default function RootLayout() {
  const { pathname } = useLocation()
  // The floating compare tray is hidden on the compare page itself and on auth.
  const showCompareBar = pathname !== '/compare' && pathname !== '/login'
  return (
    <div className="flex min-h-screen flex-col bg-surface text-ink">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      {showCompareBar && <CompareBar />}
      <DevRoleSwitcher />
    </div>
  )
}
