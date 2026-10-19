import { useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import Star from '../components/Star.jsx'

/**
 * Auth screen. Split layout per spec: an animated flag-bars art panel + the
 * form. Until a real backend exists, the buttons call `login(role)` and bounce
 * back to where a guard sent the user (location.state.from) or home.
 */
export default function Auth() {
  const { login } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const signInAs = (role) => {
    login(role)
    navigate(from, { replace: true })
  }

  return (
    <div className="mx-auto grid min-h-[70vh] max-w-content grid-cols-1 md:grid-cols-2">
      {/* Art panel */}
      <div className="relative hidden items-center justify-center overflow-hidden bg-ink md:flex">
        <div
          className="absolute inset-0 opacity-90"
          style={{
            background:
              'linear-gradient(180deg,#007A3D 0 33.3%,#fff 33.3% 66.6%,#0E1311 66.6% 100%)',
          }}
        />
        <div className="relative z-10 flex gap-6 text-star">
          <Star size={34} />
          <Star size={34} />
          <Star size={34} />
        </div>
      </div>

      {/* Form */}
      <div className="flex flex-col justify-center bg-paper px-8 py-12 sm:px-12">
        <h2 className="text-2xl font-extrabold">تسجيل الدخول</h2>
        <p className="mt-1 text-sm text-muted">تابع أسعارك وحجوزاتك من مكان واحد.</p>

        <label className="mt-6 block text-sm font-semibold">البريد الإلكتروني</label>
        <input
          type="email"
          dir="ltr"
          placeholder="name@example.com"
          className="mt-1.5 h-12 w-full rounded-field border border-line px-3 text-sm outline-none focus:border-green"
        />

        <label className="mt-4 block text-sm font-semibold">كلمة المرور</label>
        <input
          type="password"
          className="mt-1.5 h-12 w-full rounded-field border border-line px-3 text-sm outline-none focus:border-green"
        />

        <button
          onClick={() => signInAs('user')}
          className="mt-6 h-12 w-full rounded-field bg-green text-sm font-semibold text-white hover:bg-green-deep"
        >
          دخول
        </button>

        {/* Dev shortcut — sign in directly as any role while building */}
        <div className="mt-5 border-t border-line pt-4">
          <p className="mb-2 text-xs font-semibold text-muted">
            دخول سريع للتطوير (بدون خادم مصادقة):
          </p>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => signInAs('user')} className="rounded-field border border-line px-3 py-2 text-xs font-semibold hover:border-green hover:text-green">
              كمستخدم
            </button>
            <button onClick={() => signInAs('vendor')} className="rounded-field border border-line px-3 py-2 text-xs font-semibold hover:border-green hover:text-green">
              كبائع
            </button>
            <button onClick={() => signInAs('admin')} className="rounded-field border border-line px-3 py-2 text-xs font-semibold hover:border-green hover:text-green">
              كمدير نظام
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
