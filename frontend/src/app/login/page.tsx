'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Star from '@/components/Star';
import { useSessionStore, type Role } from '@/stores/session';
import { useToastStore } from '@/stores/toast';

const FEATURES = [
  'تتبّع أسعار أكثر من ٥٠٠ متجر في المملكة العربية السعودية',
  'تنبيهات فورية ومباشرة عند انخفاض السعر في المتاجر',
  'حجز وتثبيت السعر مباشرةً دون رسوم إضافية',
  'مقارنة ذكية للمواصفات وكاميرات الهواتف وأفضل الصفقات',
];

function LoginForm() {
  const router = useRouter();
  const login = useSessionStore((s) => s.login);
  const pushToast = useToastStore((s) => s.push);

  const [tab, setTab] = useState<'login' | 'register'>('login');

  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Quick Demo Login for testing roles
  const handleQuickDemoLogin = (role: Role) => {
    login(role);
    pushToast(`تم تسجيل الدخول بنجاح بصلاحية: ${role === 'admin' ? 'مدير النظام' : role === 'vendor' ? 'بائع معتمد' : 'مستخدم'} ✓`);
    if (role === 'admin') router.push('/admin');
    else if (role === 'vendor') router.push('/vendor');
    else router.push('/account');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!loginEmail.trim() || !loginPassword) {
      setError('يرجى إدخال البريد الإلكتروني وكلمة المرور.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      // If user typed 'admin' in email, log in as admin, if 'vendor' as vendor, else as normal user
      const lower = loginEmail.toLowerCase();
      if (lower.includes('admin')) {
        login('admin');
        pushToast('أهلاً بك! تم تسجيل الدخول كمدير للنظام ✓');
        router.push('/admin');
      } else if (lower.includes('vendor') || lower.includes('store') || lower.includes('seller')) {
        login('vendor');
        pushToast('أهلاً بك! تم تسجيل الدخول كبائع معتمد ✓');
        router.push('/vendor');
      } else {
        login({
          name: loginEmail.split('@')[0] || 'عبدالله الشمري',
          email: loginEmail.trim(),
        });
        pushToast('تم تسجيل الدخول بنجاح! أهلاً بك في أسعار ✓');
        router.push('/account');
      }
    }, 500);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!regName.trim() || !regEmail.trim() || !regPassword) {
      setError('يرجى ملء جميع الحقول المطلوبة.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      login({
        name: regName.trim(),
        email: regEmail.trim(),
        phone: regPhone.trim() || '+966 55 000 0000',
      });
      pushToast('تم إنشاء الحساب وتسجيل الدخول بنجاح! أهلاً بك ✓');
      router.push('/account');
    }, 600);
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    setError(null);
    if (!loginEmail.trim()) {
      setError('يرجى كتابة بريدك الإلكتروني أولاً لاستعادة كلمة المرور.');
      return;
    }
    setSuccess(`تم إرسال رابط إعادة تعيين كلمة المرور إلى ${loginEmail.trim()}`);
  };

  const inputClass =
    'h-12 w-full rounded-xl border border-line bg-paper px-3.5 text-sm outline-none transition-colors focus:border-green focus:ring-2 focus:ring-green/20';

  return (
    <div className="mx-auto grid min-h-[660px] max-w-[1200px] grid-cols-1 md:grid-cols-[1.05fr_1fr]">
      {/* Brand Art Panel */}
      <div
        className="relative flex flex-col justify-center overflow-hidden px-6 py-10 text-white sm:px-12 md:py-16"
        style={{ background: 'linear-gradient(150deg,var(--color-green-deep),var(--color-green))' }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 80% 16%,rgba(255,255,255,.14),transparent 44%),radial-gradient(circle at 10% 90%,rgba(255,255,255,.09),transparent 42%)',
          }}
        />
        <div className="relative z-[2] mb-6 flex items-center gap-2 text-2xl font-extrabold">
          <span className="flex gap-0.5 text-star">
            <Star size={18} />
            <Star size={18} />
            <Star size={18} />
          </span>
          <span className="font-heading">أسعار</span>
        </div>
        <h3 className="relative z-[2] mb-3.5 max-w-[390px] text-2xl sm:text-[28px] font-extrabold leading-[1.4]">
          قارن الأسعار، احجز بثقة، ووفّر أكثر.
        </h3>
        <p className="relative z-[2] mb-7 max-w-[360px] text-sm sm:text-[14.5px] leading-[1.75] text-white/85">
          منصة سعودية تجمع أسعار المتاجر في مكان واحد وتراقب تغيّراتها لحظة بلحظة لضمان أفضل خيار.
        </p>
        <div className="relative z-[2] flex flex-col gap-3.5">
          {FEATURES.map((f) => (
            <div key={f} className="flex items-center gap-3 text-xs sm:text-sm text-white/95">
              <span className="flex h-7 w-7 flex-none items-center justify-center rounded-lg bg-white/20 text-white">
                ✓
              </span>
              <span>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Official Sign-in / Sign-up Form */}
      <div className="flex flex-col justify-center bg-paper px-6 py-8 sm:px-12 md:py-12">
        {/* Quick Demo Role Logins helper card */}
        <div className="mb-6 rounded-2xl border border-green/30 bg-green-tint/50 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-green-deep">تسجيل دخول تجريبي سريع بنقرة واحدة:</span>
            <span className="text-[10px] text-muted">للمعاينة والاختبار</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('user')}
              className="flex h-9 items-center justify-center rounded-lg bg-white text-xs font-bold text-ink shadow-xs border border-line hover:border-green hover:text-green transition-all active:scale-95"
            >
              مستخدم عادي
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('vendor')}
              className="flex h-9 items-center justify-center rounded-lg bg-white text-xs font-bold text-ink shadow-xs border border-line hover:border-green hover:text-green transition-all active:scale-95"
            >
              بائع معتمد
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('admin')}
              className="flex h-9 items-center justify-center rounded-lg bg-white text-xs font-bold text-ink shadow-xs border border-line hover:border-green hover:text-green transition-all active:scale-95"
            >
              مدير النظام
            </button>
          </div>
        </div>

        {/* Tabs: Sign In / Create Account */}
        <div className="mb-6 flex rounded-xl border border-line bg-surface p-1">
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setError(null);
              setSuccess(null);
            }}
            className={`flex-1 rounded-lg py-2.5 text-xs font-bold transition-all ${
              tab === 'login'
                ? 'bg-paper text-ink shadow-xs'
                : 'text-muted hover:text-ink'
            }`}
          >
            تسجيل الدخول
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('register');
              setError(null);
              setSuccess(null);
            }}
            className={`flex-1 rounded-lg py-2.5 text-xs font-bold transition-all ${
              tab === 'register'
                ? 'bg-paper text-ink shadow-xs'
                : 'text-muted hover:text-ink'
            }`}
          >
            إنشاء حساب جديد
          </button>
        </div>

        <div className="mb-5">
          <h2 className="mb-1 text-2xl font-extrabold text-ink">
            {tab === 'login' ? 'أهلاً بك مجدداً!' : 'أنشئ حسابك الآن'}
          </h2>
          <p className="text-xs text-muted">
            {tab === 'login'
              ? 'سجّل دخولك لمتابعة أسعار الهواتف المفضلة وإدارة حجوزاتك.'
              : 'انضم إلينا للاستفادة من تنبيهات انخفاض الأسعار وتثبيت الحجز.'}
          </p>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-star/25 bg-star-tint p-3 text-xs sm:text-sm font-semibold text-star animate-in fade-in-50" role="alert">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-none" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-green/30 bg-green-tint p-3 text-xs sm:text-sm font-semibold text-green-deep animate-in fade-in-50" role="status">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-none" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>{success}</span>
          </div>
        )}

        {tab === 'login' ? (
          /* Sign-in Form */
          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="login-email" className="mb-1.5 block text-xs font-bold text-ink">
                البريد الإلكتروني
              </label>
              <input
                id="login-email"
                type="email"
                dir="ltr"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="name@example.com"
                className={inputClass}
                autoComplete="email"
                required
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="login-password" className="text-xs font-bold text-ink">
                  كلمة المرور
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs text-green hover:underline"
                >
                  نسيت كلمة المرور؟
                </button>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  dir="ltr"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`${inputClass} pe-11`}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 end-0 flex items-center px-3.5 text-muted hover:text-ink focus:outline-none"
                  aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <label className="flex cursor-pointer items-center gap-2 text-xs text-muted">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded accent-[var(--color-green)]"
                />
                <span>تذكّرني على هذا الجهاز</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex h-12 w-full items-center justify-center rounded-xl bg-green text-sm font-bold text-white transition-colors hover:bg-green-deep disabled:opacity-70 shadow-sm active:scale-98"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>جاري تسجيل الدخول...</span>
                </span>
              ) : (
                'تسجيل الدخول'
              )}
            </button>
          </form>
        ) : (
          /* Sign-up Form */
          <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-3.5">
            <div>
              <label className="mb-1 block text-xs font-bold text-ink">الاسم الكامل</label>
              <input
                type="text"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="محمد السالم"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-ink">البريد الإلكتروني</label>
              <input
                type="email"
                dir="ltr"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="name@example.com"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-ink">رقم الجوال</label>
              <input
                type="tel"
                dir="ltr"
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
                placeholder="+966 50 000 0000"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-ink">كلمة المرور</label>
              <input
                type="password"
                dir="ltr"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="••••••••"
                className={inputClass}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex h-12 w-full items-center justify-center rounded-xl bg-green text-sm font-bold text-white transition-colors hover:bg-green-deep disabled:opacity-70 shadow-sm active:scale-98"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>جاري إنشاء الحساب...</span>
                </span>
              ) : (
                'إنشاء الحساب الآن'
              )}
            </button>
          </form>
        )}

        <div className="mt-8 border-t border-line pt-5 text-center text-xs text-muted">
          ترغب بالتصفح فقط؟{' '}
          <Link href="/" className="font-bold text-ink hover:text-green">
            العودة للرئيسية وتصفّح الهواتف ←
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted">جاري تحميل صفحة الدخول...</div>}>
      <LoginForm />
    </Suspense>
  );
}
