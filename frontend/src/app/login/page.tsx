'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSessionStore, type Role } from '@/stores/session';

const FEATURES = [
  'تتبّع أسعار أكثر من ٥٠٠ متجر',
  'تنبيهات فورية عند انخفاض السعر',
  'حجز وتثبيت السعر مباشرةً',
];

/**
 * Auth screen per the design's isAuth section: a green-gradient brand art
 * panel (logo, headline, feature list) beside the sign-in form. Until Phase
 * 04's real auth backend exists, signing in just sets the mock session role
 * and bounces back to `?from=` (set by RoleGuard) or home.
 */
function LoginForm() {
  const login = useSessionStore((s) => s.login);
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/';

  const signInAs = (role: Role) => {
    login(role);
    router.replace(from);
  };

  const input = 'h-12 w-full rounded-field border border-line bg-paper px-3 text-sm outline-none focus:border-green';

  return (
    <div className="mx-auto grid min-h-[640px] max-w-[1200px] grid-cols-1 md:grid-cols-[1.05fr_1fr]">
      {/* Art panel */}
      <div
        className="relative flex flex-col justify-center overflow-hidden px-6 py-9 text-white md:px-[52px] md:py-14"
        style={{ background: 'linear-gradient(150deg,var(--color-green-deep),var(--color-green))' }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 80% 16%,rgba(255,255,255,.14),transparent 44%),radial-gradient(circle at 10% 90%,rgba(255,255,255,.09),transparent 42%)',
          }}
        />
        <div className="relative z-[2] mb-[30px] flex items-center gap-[9px] text-[22px] font-extrabold">
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
            <path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z" fill="#fff" />
          </svg>
          <span>مقار</span>
        </div>
        <h3 className="relative z-[2] mb-3.5 max-w-[370px] text-[29px] font-extrabold leading-[1.4]">
          قارن الأسعار، احجز بثقة، ووفّر أكثر.
        </h3>
        <p className="relative z-[2] mb-8 max-w-[350px] text-[14.5px] leading-[1.75] text-white/80">
          منصة سعودية تجمع أسعار المتاجر في مكان واحد وتراقب تغيّراتها لحظة بلحظة.
        </p>
        <div className="relative z-[2] flex flex-col gap-3.5">
          {FEATURES.map((f) => (
            <div key={f} className="flex items-center gap-[11px] text-sm text-white/95">
              <span className="flex h-[26px] w-[26px] flex-none items-center justify-center rounded-lg bg-white/[.17] text-[13px]">✓</span>
              {f}
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="flex flex-col justify-center bg-paper px-6 py-8 md:px-[46px] md:py-[52px]">
        <h2 className="mb-1.5 text-[26px] font-extrabold">تسجيل الدخول</h2>
        <p className="mb-[26px] text-sm text-muted">تابع أسعارك وحجوزاتك من مكان واحد.</p>

        <div className="mb-3.5">
          <label className="mb-1.5 block text-[12.5px] font-semibold">البريد الإلكتروني</label>
          <input type="email" dir="ltr" placeholder="name@example.com" className={input} />
        </div>
        <div className="mb-3.5">
          <label className="mb-1.5 block text-[12.5px] font-semibold">كلمة المرور</label>
          <input type="password" className={input} />
        </div>

        <div className="mb-[18px] mt-0.5 flex items-center justify-between text-[13px]">
          <label className="flex cursor-pointer items-center gap-[7px] text-muted">
            <input type="checkbox" defaultChecked className="accent-[var(--color-green)]" /> تذكّرني
          </label>
          <a className="cursor-pointer text-green hover:text-green-deep">نسيت كلمة المرور؟</a>
        </div>

        <button
          onClick={() => signInAs('user')}
          className="h-[50px] w-full rounded-field bg-green text-sm font-semibold text-white hover:bg-green-deep"
        >
          دخول
        </button>

        <div className="mt-5 border-t border-line pt-[18px] text-[13.5px] text-muted">
          صاحب متجر؟{' '}
          <button onClick={() => signInAs('vendor')} className="font-semibold text-green hover:text-green-deep">
            سجّل كبائع ←
          </button>
        </div>

        {/* Mock-session shortcut — replaced by real auth in Phase 04 */}
        <div className="mt-5 border-t border-line pt-4">
          <p className="mb-2 text-xs font-semibold text-muted">
            دخول سريع للمعاينة (بدون خادم مصادقة):
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
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
