'use client';

import { use, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { findProduct } from '@/lib/mock-data';
import Star from '@/components/Star';
import Countdown from '@/components/Countdown';
import { useToastStore } from '@/stores/toast';

function Steps({ step }: { step: number }) {
  const items: [string, number][] = [
    ['اختيار المتجر', 1],
    ['مراجعة وتأكيد', 2],
    ['تثبيت الحجز', 3],
  ];

  return (
    <div className="mb-8 flex items-center justify-center">
      {items.map(([cap, n], i) => {
        const isPassed = step >= n;
        const isCurrent = step === n;
        return (
          <div key={n} className="flex items-center">
            <div className="flex w-[100px] sm:w-[120px] flex-col items-center gap-2">
              <div className="relative flex items-center justify-center">
                <Star
                  size={36}
                  filled={isPassed}
                  className={isPassed ? 'text-star' : 'text-line'}
                />
                {isCurrent && (
                  <span className="absolute -inset-1.5 animate-ping rounded-full border border-star/40 pointer-events-none" />
                )}
              </div>
              <span
                className={[
                  'text-xs sm:text-[13px] font-bold text-center',
                  isPassed ? 'text-ink' : 'text-muted',
                ].join(' ')}
              >
                {cap}
              </span>
            </div>
            {i < 2 && (
              <div
                className={`mt-[-28px] h-0.5 w-8 sm:w-16 transition-colors ${
                  step > n ? 'bg-star' : 'bg-line'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

const Chip = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className={[
      'h-10 rounded-full border px-4 text-xs font-bold transition-all active:scale-95',
      active
        ? 'border-green bg-green-tint text-green-deep shadow-xs'
        : 'border-line bg-paper text-muted hover:border-green/50 hover:text-ink',
    ].join(' ')}
  >
    {label}
  </button>
);

export default function Booking({ params }: { params: Promise<{ number: string }> }) {
  const { number: id } = use(params);
  const product = findProduct(id);
  const pushToast = useToastStore((s) => s.push);

  const [phase, setPhase] = useState<'step1' | 'locking' | 'step2' | 'step3' | 'cancelled'>('step1');
  const [store, setStore] = useState(0);
  const [color, setColor] = useState(0);
  const [cap, setCap] = useState(1);
  const [slot, setSlot] = useState(1);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const confirm = () => {
    setPhase('locking');
    setTimeout(() => {
      setPhase('step3');
      pushToast('تم حجز الجهاز وتثبيت السعر بنجاح ✓');
    }, 1200);
  };

  const handleCancelBooking = () => {
    setShowCancelDialog(false);
    setPhase('cancelled');
    pushToast('تم إلغاء الحجز بنجاح.');
  };

  const card = 'rounded-2xl border border-line bg-paper p-5 sm:p-7 shadow-soft';
  const warn = 'my-5 rounded-xl border border-green/20 bg-green-tint/60 px-4 py-3.5 text-xs sm:text-[13px] leading-relaxed text-green-deep';

  const phoneImage = product.image || '/phones/iphone-15-pro-max.svg';
  const colorsList = product.colors && product.colors.length > 0
    ? product.colors.map((c) => c.name)
    : ['تيتانيوم طبيعي', 'أسود فلكي', 'أبيض ثلجي'];

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 pb-28 sm:px-6">
      {/* Product Summary Header Bar */}
      <div className="mb-6 flex items-center gap-4 rounded-xl border border-line bg-paper p-4 shadow-soft">
        <div className="relative h-16 w-14 flex-none overflow-hidden rounded-lg bg-surface p-1">
          <Image src={phoneImage} alt={product.name} fill sizes="60px" className="object-contain" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-base font-bold text-ink">{product.name}</h2>
          <div className="text-xs text-muted">
            العلامة: <span className="font-semibold text-ink">{product.brand}</span> · التخزين: {product.storage}
          </div>
        </div>
        <div className="text-left">
          <span className="text-[11px] text-muted block">أقل سعر</span>
          <span dir="ltr" className="num text-lg font-black text-green">{product.from} ر.س</span>
        </div>
      </div>

      <Steps step={phase === 'step3' ? 3 : phase === 'step2' || phase === 'locking' ? 2 : 1} />

      {/* STEP 1: Store & Spec Selection */}
      {phase === 'step1' && (
        <div className={card}>
          <h3 className="mb-4 text-lg font-extrabold text-ink">اختر المتجر ومواصفات الجهاز</h3>

          {/* Store Selector */}
          <div className="mb-5">
            <div className="mb-2.5 text-xs font-bold text-muted uppercase tracking-wider">
              المتجر الأقرب إليك:
            </div>
            {[
              ['متجر التقنية', 'حي العليا، الرياض · على بعد 2.4 كم', product.from, 'متوفر للاستلام الفوري'],
              ['مكتبة جرير', 'طريق الملك فهد · على بعد 5.1 كم', product.p2, 'متوفر في المعرض'],
            ].map(([n, a, p, st], i) => (
              <button
                type="button"
                key={n}
                onClick={() => setStore(i)}
                className={[
                  'mb-2.5 flex w-full items-center gap-3.5 rounded-xl border-[1.5px] p-3.5 text-right transition-all active:scale-99',
                  store === i
                    ? 'border-green bg-green-tint/60 shadow-xs ring-1 ring-green/20'
                    : 'border-line bg-paper hover:border-green/40',
                ].join(' ')}
              >
                <span
                  className={[
                    'h-5 w-5 flex-none rounded-full border-2 transition-colors',
                    store === i ? 'border-green bg-green ring-2 ring-inset ring-white' : 'border-line',
                  ].join(' ')}
                />
                <span className="flex-1">
                  <span className="block text-[14.5px] font-bold text-ink">{n}</span>
                  <span className="mt-0.5 block text-xs text-muted">
                    {a} · <span className="text-green font-medium">{st}</span>
                  </span>
                </span>
                <span dir="ltr" className="num text-base font-extrabold text-green">{p} ر.س</span>
              </button>
            ))}
          </div>

          {/* Color Selector */}
          <div className="mb-5">
            <div className="mb-2 text-xs font-bold text-muted uppercase tracking-wider">اختر اللون:</div>
            <div className="flex flex-wrap gap-2">
              {colorsList.map((c, i) => (
                <Chip key={c} label={c} active={color === i} onClick={() => setColor(i)} />
              ))}
            </div>
          </div>

          {/* Quantity Counter (>= 44px touch targets) */}
          <div className="mb-5">
            <div className="mb-2 text-xs font-bold text-muted uppercase tracking-wider">
              الكمية (حد أقصى جهازين لكل عميل):
            </div>
            <div className="flex w-fit items-center overflow-hidden rounded-xl border border-line bg-surface">
              <button
                type="button"
                onClick={() => setCap((c) => Math.max(1, c - 1))}
                className="h-11 w-11 text-xl font-bold hover:bg-line/50 transition-colors flex items-center justify-center"
                aria-label="إنقاص الكمية"
              >
                −
              </button>
              <span dir="ltr" className="num w-12 border-x border-line bg-paper text-center font-bold leading-11">
                {cap}
              </span>
              <button
                type="button"
                onClick={() => setCap((c) => Math.min(2, c + 1))}
                className="h-11 w-11 text-xl font-bold hover:bg-line/50 transition-colors flex items-center justify-center"
                aria-label="زيادة الكمية"
              >
                +
              </button>
            </div>
          </div>

          <div className={warn}>
            الحجز يثبّت السعر والكمية لمدة ٤٨ ساعة. لا يتطلب الدفع الآن، ويتم السداد عند الاستلام في المعرض.
          </div>

          <button
            type="button"
            onClick={() => setPhase('step2')}
            className="flex h-12 w-full items-center justify-center rounded-xl bg-green text-sm font-bold text-white transition-colors hover:bg-green-deep shadow-md active:scale-98"
          >
            المتابعة إلى مراجعة وتأكيد الحجز ←
          </button>
        </div>
      )}

      {/* Concurrency Lock State */}
      {phase === 'locking' && (
        <div className={`${card} text-center py-14 animate-pulse`}>
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-tint text-green">
            <svg className="h-7 w-7 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          </div>
          <div className="mb-2 font-heading text-xl font-extrabold text-ink">
            نثبّت لك القطعة…
          </div>
          <p className="text-xs text-muted">
            جارٍ التواصل مع نظام المتجر وتأكيد قفل الوحدة في المعرض بالسعر الأقل
          </p>
        </div>
      )}

      {/* STEP 2: Review and Confirm */}
      {phase === 'step2' && (
        <div className={card}>
          <h3 className="mb-4 text-lg font-extrabold text-ink">راجع بيانات الحجز قبل الاعتماد</h3>

          <div className="mb-5">
            <div className="mb-2 text-xs font-bold text-muted uppercase tracking-wider">
              الموعد المتوقع للحضور والاستلام:
            </div>
            <div className="flex flex-wrap gap-2">
              {['اليوم ٥–٧ مساءً', 'غداً ١٢–٢ ظهراً', 'غداً ٤–٦ مساءً'].map((t, i) => (
                <Chip key={t} label={t} active={slot === i} onClick={() => setSlot(i)} />
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-line mb-5">
            <table className="w-full border-collapse text-sm">
              <tbody>
                {[
                  ['المنتج والمواصفات', `${product.name} · ${product.storage} · ${colorsList[color] || 'تيتانيوم'}`],
                  ['المتجر والفرع', store === 0 ? 'متجر التقنية — حي العليا، الرياض' : 'مكتبة جرير — طريق الملك فهد'],
                  ['السعر المثبّت', `${product.from} ر.س`],
                  ['مدة صلاحية الحجز', '٤٨ ساعة كاملة'],
                ].map(([k, v], i) => (
                  <tr key={k} className={i % 2 ? 'bg-surface/50' : 'bg-paper'}>
                    <td className="w-[38%] border-b border-line px-4 py-3 text-xs font-semibold text-muted">{k}</td>
                    <td className={`border-b border-line px-4 py-3 font-bold text-xs ${i === 2 ? 'num text-green text-sm' : 'text-ink'}`}>
                      {v}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={warn}>
            بالضغط على «تأكيد الحجز» يتم حجز القطعة حصرياً لك بالمعرض لمدة ٤٨ ساعة.
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => setPhase('step1')}
              className="flex h-12 flex-1 items-center justify-center rounded-xl border border-line text-xs font-bold text-muted hover:text-ink transition-colors"
            >
              تعديل الاختيارات
            </button>
            <button
              type="button"
              onClick={confirm}
              className="flex h-12 flex-[2] items-center justify-center rounded-xl bg-green text-sm font-bold text-white shadow-md transition-colors hover:bg-green-deep active:scale-98"
            >
              تأكيد الحجز وقفل السعر ✓
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Completed / Hold countdown */}
      {phase === 'step3' && (
        <div className={`${card} text-center py-8`}>
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-green-tint text-green">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h3 className="text-2xl font-extrabold text-ink">تمّ تثبيت حجزك بنجاح!</h3>
          <p className="mt-1 text-xs text-muted">
            القطعة محجوزة ومغلقة باسمك في المعرض. يرجى إبراز كود الحجز عند الكاشير.
          </p>

          <div className="my-5 flex flex-col items-center justify-center gap-3 rounded-2xl border border-line bg-surface p-5">
            <div className="text-xs font-semibold text-muted">رقم الحجز الرسمي:</div>
            <div dir="ltr" className="num text-3xl font-black tracking-widest text-ink">
              BK-7F42Q
            </div>

            {/* Simulated QR barcode canvas */}
            <div className="flex h-24 w-24 items-center justify-center rounded-xl border border-line bg-paper p-2 shadow-xs">
              <svg viewBox="0 0 100 100" className="h-full w-full" aria-label="رمز الاستجابة السريعة QR">
                <rect width="100" height="100" fill="#fff" />
                <path d="M10 10h30v30H10zm40 0h40v20H50zm0 30h20v20H50zm20 0h20v40H70zm-60 20h20v40H10zm30 10h20v30H40zm-10-50h10v10H30zm0 50h10v10H30z" fill="#0E1311" />
              </svg>
            </div>
            <span className="text-[11px] text-muted">امسح الكود ضوئياً لدى موظف الاستلام</span>
          </div>

          {/* Countdown timer — Sanctioned red countdown */}
          <div className="mb-4">
            <div className="text-xs text-muted mb-1 font-semibold">يُلغى الحجز تلقائياً بعد:</div>
            <Countdown seconds={47 * 3600 + 12 * 60 + 33} label="مهلة تثبيت السعر والكمية" />
          </div>

          <div className="mb-5 flex items-center justify-center gap-2 rounded-xl bg-surface px-4 py-3 text-xs text-muted">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green flex-none" aria-hidden="true">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>العنوان: فرع العليا، الرياض (ساعات العمل: ٩:٠٠ ص – ١١:٠٠ م)</span>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="flex h-12 w-full items-center justify-center rounded-xl bg-green text-sm font-bold text-white transition-colors hover:bg-green-deep shadow-sm"
            >
              العودة للرئيسية وتصفّح عروض أخرى ←
            </Link>

            {/* Calm text link for cancellation, strictly complying with design-brief.md */}
            <button
              type="button"
              onClick={() => setShowCancelDialog(true)}
              className="text-xs font-semibold text-muted hover:text-ink transition-colors py-2"
            >
              إلغاء هذا الحجز
            </button>
          </div>
        </div>
      )}

      {/* Cancelled State */}
      {phase === 'cancelled' && (
        <div className={`${card} text-center py-10`}>
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-surface text-xl text-muted">
            ✕
          </div>
          <h3 className="text-xl font-extrabold text-ink">تم إلغاء الحجز</h3>
          <p className="mt-1 text-xs text-muted mb-5">
            تم تحرير القطعة وأصبحت متاحة لعملاء آخرين في المعرض.
          </p>
          <button
            type="button"
            onClick={() => setPhase('step1')}
            className="rounded-xl bg-green px-5 py-2.5 text-xs font-bold text-white hover:bg-green-deep"
          >
            إعادة الحجز من جديد
          </button>
        </div>
      )}

      {/* Cancellation Confirmation Dialog (conforming to design-brief.md) */}
      {showCancelDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setShowCancelDialog(false)}
            aria-hidden="true"
          />
          <div className="relative z-10 w-full max-w-sm rounded-2xl bg-paper p-6 shadow-2xl text-right animate-in zoom-in-95 duration-150">
            <h4 className="text-base font-extrabold text-ink mb-2">تأكيد إلغاء الحجز</h4>
            <p className="text-xs text-muted leading-relaxed mb-4">
              هذا إلغاؤك الأول هذا الشهر. نتيح حتى ٣ إلغاءات شهرياً، وبعد الإلغاء الثالث يُعلّق الحجز مؤقتاً لمدة ١٤ يوماً لضمان موثوقية المخزون مع المتاجر.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowCancelDialog(false)}
                className="flex-1 rounded-xl border border-line py-2.5 text-xs font-bold text-ink hover:bg-surface"
              >
                تراجع
              </button>
              <button
                type="button"
                onClick={handleCancelBooking}
                className="flex-1 rounded-xl bg-star-tint py-2.5 text-xs font-bold text-star hover:bg-star/15"
              >
                تأكيد الإلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
