import { Navigate, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'

/**
 * Route guard. If the current role is not in `roles`, redirect to /login and
 * remember where the user was headed (location state) so we can bounce back
 * after a real login later.
 *
 * During development the DevRoleSwitcher lets you change role to pass the guard.
 */
export default function ProtectedRoute({ roles, children }) {
  const { role } = useApp()
  const location = useLocation()

  if (!roles.includes(role)) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return children
}
