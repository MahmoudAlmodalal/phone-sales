'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useSession, useSessionStore, DEMO_AVATARS } from '@/stores/session';
import { useToastStore } from '@/stores/toast';

export default function Profile() {
  const { user } = useSession();
  const updateProfile = useSessionStore((s) => s.updateProfile);
  const setAvatar = useSessionStore((s) => s.setAvatar);
  const pushToast = useToastStore((s) => s.push);

  const [name, setName] = useState(user?.name || 'عبدالله الشمري');
  const [email, setEmail] = useState(user?.email || 'a.alshammari@example.com');
  const [phone, setPhone] = useState(user?.phone || '+966 55 123 4567');
  const [city, setCity] = useState(user?.city || 'الرياض');
  const [language, setLanguage] = useState('العربية');
  const [customUrl, setCustomUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [saving, setSaving] = useState(false);

  const currentAvatar = user?.avatarUrl || '/avatars/avatar-1.svg';

  const handleSelectAvatar = (url: string) => {
    setAvatar(url);
    pushToast('تم تحديث الصورة الشخصية بنجاح ✓');
  };

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;
    setAvatar(customUrl.trim());
    pushToast('تم تطبيق رابط الصورة الشخصية ✓');
    setCustomUrl('');
    setShowUrlInput(false);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      updateProfile({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        city: city.trim(),
      });
      setSaving(false);
      pushToast('تم حفظ تغييرات الملف الشخصي بنجاح ✓');
    }, 300);
  };

  const field = 'mb-4';
  const labelClass = 'mb-1.5 block text-[13px] font-semibold text-ink';
  const inputClass =
    'h-11 w-full rounded-field border border-line bg-paper px-3 text-sm outline-none transition-colors focus:border-green';

  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[300px_1fr]">
      {/* Sidebar: Account Trust & Status */}
      <aside className="flex flex-col gap-5">
        {/* Account Health Card */}
        <div className="rounded-card border border-line bg-paper p-5 shadow-soft">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-bold text-ink">حالة الحساب</h4>
            <span className="flex h-2 w-2 rounded-full bg-green" aria-hidden="true" />
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-green-tint px-3 py-2 text-[13px] font-semibold text-green-deep">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>جيدة — لا قيود على الحجز</span>
          </div>
          <p className="mt-3 text-[12.5px] leading-6 text-muted">
            تلتزم بالحضور في مواعيد حجوزاتك لدى المتاجر الشريكة. الإلغاء المتكرر أو عدم الحضور قد يقيّد الحساب مؤقتاً.
          </p>

          <div className="mt-4 border-t border-line pt-3.5">
            <div className="flex items-center justify-between text-xs text-muted">
              <span>تاريخ الانضمام</span>
              <span className="font-semibold text-ink">{user?.joinedDate || 'يوليو 2026'}</span>
            </div>
          </div>
        </div>

        {/* Verification Summary Card */}
        <div className="rounded-card border border-line bg-paper p-5 shadow-soft">
          <h4 className="mb-3 text-sm font-bold text-ink">توثيق الحساب</h4>
          <div className="flex flex-col gap-2.5 text-[12.5px]">
            <div className="flex items-center justify-between">
              <span className="text-muted">البريد الإلكتروني</span>
              <span className="inline-flex items-center gap-1 font-semibold text-green">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                موثق
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">رقم الجوال</span>
              <span className="inline-flex items-center gap-1 font-semibold text-green">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                موثق
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">الهوية الوطنية / الإقامة</span>
              <span className="inline-flex items-center gap-1 font-semibold text-green">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                معتمد عبر نفاذ
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col gap-6">
        {/* Avatar Showcase & Picker Card */}
        <div className="rounded-card border border-line bg-paper p-6 shadow-soft">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            {/* Current Large Avatar */}
            <div className="relative h-24 w-24 flex-none overflow-hidden rounded-full border-2 border-green/30 bg-surface shadow-sm">
              <Image
                src={currentAvatar}
                alt={name}
                width={96}
                height={96}
                className="h-full w-full object-cover"
                priority
              />
              <div
                className="absolute bottom-1 end-1 flex h-6 w-6 items-center justify-center rounded-full bg-green text-white shadow-sm ring-2 ring-paper"
                title="حساب موثق"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>

            {/* Avatar Header Info */}
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-extrabold text-ink">{name}</h3>
              <p className="mt-0.5 text-xs text-muted" dir="ltr">{email}</p>
              <p className="mt-2 text-xs text-muted">
                اختر صورتك الرمزية من النماذج الاحترافية أدناه، أو استخدم رابط صورة خارجي:
              </p>
            </div>
          </div>

          {/* Avatars Gallery */}
          <div className="mt-5 border-t border-line pt-4">
            <label className="mb-2.5 block text-xs font-semibold text-muted">
              الصور الرمزية المقترحة لحسابك (انقر للاختيار المباشر):
            </label>
            <div className="flex flex-wrap gap-3">
              {DEMO_AVATARS.map((av) => {
                const isSelected = currentAvatar === av.url;
                return (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => handleSelectAvatar(av.url)}
                    className={`group relative h-12 w-12 overflow-hidden rounded-full border-2 transition-all hover:scale-105 focus:outline-none ${
                      isSelected
                        ? 'border-green ring-2 ring-green ring-offset-2'
                        : 'border-line opacity-80 hover:opacity-100 hover:border-green/60'
                    }`}
                    title={av.label}
                    aria-label={`اختيار ${av.label}`}
                  >
                    <Image
                      src={av.url}
                      alt={av.label}
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 flex items-center justify-center bg-green/20">
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-green text-white">
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Custom Image URL option */}
            <div className="mt-4">
              {!showUrlInput ? (
                <button
                  type="button"
                  onClick={() => setShowUrlInput(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-green hover:underline focus:outline-none"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  <span>أو استخدم رابط صورة مخصص (URL)</span>
                </button>
              ) : (
                <form onSubmit={handleApplyCustomUrl} className="mt-2 flex max-w-md items-center gap-2">
                  <input
                    type="url"
                    dir="ltr"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="h-9 flex-1 rounded-field border border-line bg-surface px-3 text-xs outline-none focus:border-green"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="h-9 rounded-field bg-green px-3.5 text-xs font-semibold text-white hover:bg-green-deep transition-colors"
                  >
                    تطبيق
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUrlInput(false)}
                    className="h-9 rounded-field border border-line px-2.5 text-xs text-muted hover:text-ink transition-colors"
                  >
                    إلغاء
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Profile Information Form */}
        <div className="rounded-card border border-line bg-paper p-6 shadow-soft">
          <h3 className="mb-4 text-base font-bold text-ink">البيانات الشخصية</h3>

          <form onSubmit={handleSaveProfile}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className={field}>
                <label className={labelClass}>الاسم الكامل</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>

              <div className={field}>
                <label className={labelClass}>البريد الإلكتروني</label>
                <input
                  type="email"
                  dir="ltr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`${inputClass} num`}
                  required
                />
              </div>

              <div className={field}>
                <label className={labelClass}>رقم الجوال</label>
                <input
                  type="tel"
                  dir="ltr"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`${inputClass} num`}
                  required
                />
              </div>

              <div className={field}>
                <label className={labelClass}>المدينة</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={inputClass}
                >
                  <option value="الرياض">الرياض</option>
                  <option value="جدة">جدة</option>
                  <option value="الدمام">الدمام</option>
                  <option value="مكة المكرمة">مكة المكرمة</option>
                  <option value="المدينة المنورة">المدينة المنورة</option>
                  <option value="الخبر">الخبر</option>
                </select>
              </div>

              <div className={field}>
                <label className={labelClass}>اللغة المفضلة</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className={inputClass}
                >
                  <option value="العربية">العربية</option>
                  <option value="English">English</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3 border-t border-line pt-4">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex h-11 items-center justify-center rounded-field bg-green px-6 text-sm font-semibold text-white transition-colors hover:bg-green-deep disabled:opacity-70"
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span>جاري الحفظ...</span>
                  </span>
                ) : (
                  'حفظ التغييرات'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
