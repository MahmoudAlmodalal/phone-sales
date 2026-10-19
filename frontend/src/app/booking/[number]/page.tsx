'use client';

import { use, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { findProduct } from '@/lib/mock-data';
import Star from '@/components/Star';
import Countdown from '@/components/Countdown';

function Steps({ step }: { step: number }) {
  const items: [string, number][] = [['اختيار المتجر', 1], ['مراجعة وتأكيد', 2], ['تثبيت الحجز', 3]];
  return (
    <div className="mb-8 flex items-center justify-center">
      {items.map(([cap, n], i) => (
        <div key={n} className="flex items-center">
          <div className="flex w-[110px] flex-col items-center gap-2">
            <Star size={38} filled={step >= n} className={step >= n ? 'text-star' : 'text-line'} />
            <span className={['text-[13px] font-semibold', step >= n ? 'text-ink' : 'text-muted'].join(' ')}>{cap}</span>
          </div>
          {i < 2 && <div className="mt-[-30px] h-0.5 w-12 bg-line" />}
        </div>
      ))}
    </div>
  );
}

const Chip = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className={[
      'rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors',
      active ? 'border-green bg-green-tint text-green-deep shadow-sm' : 'border-line bg-paper text-muted hover:border-green/50 hover:text-ink',
    ].join(' ')}
  >
    {label}
  </button>
);

export default function Booking({ params }: { params: Promise<{ number: string }> }) {
  const { number: id } = use(params);
  const product = findProduct(id);
  const [phase, setPhase] = useState<'step1' | 'locking' | 'step2' | 'step3'>('step1');
  const [store, setStore] = useState(0);
  const [color, setColor] = useState(0);
  const [cap, setCap] = useState(1);
  const [slot, setSlot] = useState(1);

  const confirm = () => {
    setPhase('locking');
    setTimeout(() => setPhase('step3'), 1400);
  };

  const card = 'rounded-[14px] border border-line bg-paper p-6 shadow-soft';
  const warn = 'my-5 rounded-[10px] border border-green/20 bg-green-tint/50 px-4 py-3.5 text-[13px] leading-relaxed text-green-deep';

  const phoneImage = product.image || '/phones/iphone-15-pro-max.svg';
  const colorsList = product.colors && product.colors.length > 0
    ? product.colors.map(c => c.name)
    : ['تيتانيوم طبيعي', 'أسود', 'أبيض'];

  return (
    <div className="mx-auto max-w-2xl px-4 py-7 pb-28 sm:px-6">
      {/* Product Summary Header */}
      <div className="mb-5 flex items-center gap-4 rounded-xl border border-line bg-paper p-4 shadow-soft">
        <div className="relative h-16 w-14 flex-none overflow-hidden rounded-lg bg-surface p-1">
          <Image src={phoneImage} alt={product.name} fill className="object-contain" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-base font-bold text-ink">{product.name}</h2>
          <div className="text-xs text-muted">
            العلامة: <span className="font-semibold text-ink">{product.brand}</span> · التخزين: {product.storage}
          </div>
        </div>
        <div className="text-left">
          <span className="text-xs text-muted block">أقل سعر</span>
          <span dir="ltr" className="num text-lg font-black text-green">{product.from} ر.س</span>
        </div>
      </div>

      <Steps step={phase === 'step3' ? 3 : phase === 'step2' ? 2 : 1} />

      {phase === 'step1' && (
        <div className={card}>
          <h3 className="mb-4 text-lg font-extrabold text-ink">اختر المتجر ومواصفات الجهاز</h3>

          {/* Store Selector */}
          <div className="mb-5">
            <div className="mb-2 text-[13px] font-semibold text-ink">المتجر الأقرب إليك:</div>
            {[
              ['متجر التقنية', 'حي العليا، الرياض · على بعد 2.4 كم', product.from, 'متوفر للاستلام الفوري'],
              ['مكتبة جرير', 'طريق الملك فهد · على بعد 5.1 كم', product.p2, 'متوفر في المعرض'],
            ].map(([n, a, p, st], i) => (
              <button
                type="button"
                key={n}
                onClick={() => setStore(i)}
                className={[
                  'mb-2.5 flex w-full items-center gap-3.5 rounded-xl border-[1.5px] p-3.5 text-right transition-colors',
                  store === i ? 'border-green bg-green-tint/60 shadow-sm' : 'border-line bg-paper hover:border-green/40',
                ].join(' ')}
              >
                <span className={['h-5 w-5 flex-none rounded-full border-2', store === i ? 'border-green bg-green ring-2 ring-inset ring-white' : 'border-line'].join(' ')} />
                <span className="flex-1">
                  <b className="text-[14.5px] font-bold text-ink">{n}</b>
                  <small className="mt-0.5 block text-xs text-muted">{a} · <span className="text-green font-medium">{st}</span></small>
                </span>
                <span dir="ltr" className="num text-base font-bold text-green">{p} ر.س</span>
              </button>
            ))}
          </div>

          {/* Color Selector */}
          <div className="mb-5">
            <div className="mb-2 text-[13px] font-semibold text-ink">اختر اللون:</div>
            <div className="flex flex-wrap gap-2">
              {colorsList.map((c, i) => (
                <Chip key={c} label={c} active={color === i} onClick={() => setColor(i)} />
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-5">
            <div className="mb-2 text-[13px] font-semibold text-ink">الكمية (حد أقصى جهازين لكل عميل):</div>
            <div className="flex w-fit items-center overflow-hidden rounded-field border border-line bg-surface">
              <button
                type="button"
                onClick={() => setCap((c) => Math.max(1, c - 1))}
                className="h-10 w-10 text-lg font-bold hover:bg-line/50 transition-colors"
                aria-label="إنقاص الكمية"
              >
                −
              </button>
              <span dir="ltr" className="num w-12 border-x border-line bg-paper text-center font-bold leading-10">
                {cap}
              </span>
              <button
                type="button"
                onClick={() => setCap((c) => Math.min(2, c + 1))}
                className="h-10 w-10 text-lg font-bold hover:bg-line/50 transition-colors"
                aria-label="زيادة الكمية"
              >
                +
              </button>
            </div>
          </div>

          <div className={warn}>
            الحجز مجاني تماماً ويثبّت السعر والكمية لمدة ٢٤ ساعة. لا يتطلب الدفع الآن، ويتم السداد عند الاستلام في المعرض.
          </div>

          <button
            type="button"
            onClick={() => setPhase('step2')}
            className="w-full rounded-field bg-green py-3 text-sm font-bold text-white transition-colors hover:bg-green-deep shadow-sm"
          >
            المتابعة إلى مراجعة وتأكيد الحجز ←
          </button>
        </div>
      )}

      {phase === 'locking' && (
        <div className={`${card} text-center py-12`}>
          <div className="mb-3 font-heading text-xl font-bold text-ink">نثبّت لك الجهاز الآن بالسعر الأقل…</div>
          <p className="mb-6 text-sm text-muted">جارٍ التواصل مع نظام المتجر وتأكيد قفل الوحدة في المعرض</p>
          <div className="mx-auto h-2 max-w-[280px] overflow-hidden rounded-full bg-line">
            <div className="h-full w-[75%] animate-pulse rounded-full bg-green" />
          </div>
        </div>
      )}

      {phase === 'step2' && (
        <div className={card}>
          <h3 className="mb-4 text-lg font-extrabold text-ink">راجع بيانات الحجز قبل الاعتماد</h3>

          <div className="mb-5">
            <div className="mb-2 text-[13px] font-semibold text-ink">الموعد المتوقع للحضور والاستلام:</div>
            <div className="flex flex-wrap gap-2">
              {['اليوم ٥–٧ مساءً', 'غداً ١٢–٢ ظهراً', 'غداً ٤–٦ مساءً'].map((t, i) => (
                <Chip key={t} label={t} active={slot === i} onClick={() => setSlot(i)} />
              ))}
            </div>
          </div>

          <table className="mb-5 w-full border-collapse text-sm">
            <tbody>
              {[
                ['المنتج والمواصفات', `${product.name} · ${product.storage} · ${colorsList[color] || 'تيتانيوم'}`],
                ['المتجر والفرع', store === 0 ? 'متجر التقنية — حي العليا، الرياض' : 'مكتبة جرير — طريق الملك فهد'],
                ['السعر المثبّت', `${product.from} ر.س`],
                ['مدة صلاحية الحجز', '٢٤ ساعة كاملة'],
              ].map(([k, v], i) => (
                <tr key={k} className={i % 2 ? 'bg-surface/50' : ''}>
                  <td className="w-[40%] border-b border-line px-3.5 py-2.5 text-muted">{k}</td>
                  <td className={`border-b border-line px-3.5 py-2.5 font-bold ${i === 2 ? 'num text-green text-base' : 'text-ink'}`}>
                    {v}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className={warn}>
            بالضغط على «تأكيد الحجز» يتم حجز القطعة حصرياً لك بالمعرض لمدة ٢٤ ساعة.
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setPhase('step1')}
              className="flex-1 rounded-field border border-line py-3 text-sm font-semibold text-muted hover:text-ink transition-colors"
            >
              تعديل الاختيارات
            </button>
            <button
              type="button"
              onClick={confirm}
              className="flex-[2] rounded-field bg-green py-3 text-sm font-bold text-white transition-colors hover:bg-green-deep shadow-sm"
            >
              تأكيد الحجز وقفل السعر ✓
            </button>
          </div>
        </div>
      )}

      {phase === 'step3' && (
        <div className={`${card} text-center py-8`}>
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-green-tint text-green">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h3 className="text-xl font-extrabold text-ink">تمّ تثبيت حجزك بنجاح!</h3>
          <p className="mt-1 text-xs text-muted">تم إرسال كود التأكيد في رسالة نصية، والقطعة محجوزة في المعرض باسمك.</p>

          <div className="my-5 rounded-xl border border-line bg-surface p-4">
            <div className="text-xs text-muted">رمز الحجز لدى الكاشير:</div>
            <div dir="ltr" className="num mt-1 text-2xl font-black tracking-widest text-ink">
              BK-7F42Q
            </div>
          </div>

          <div className="mb-4">
            <div className="text-xs text-muted mb-1.5">الوقت المتبقي لانتهاء صلاحية تثبيت السعر:</div>
            <Countdown seconds={23 * 3600 + 12 * 60 + 33} />
          </div>

          <div className="mb-5 flex items-center justify-center gap-2 rounded-lg bg-surface px-4 py-3 text-xs text-muted">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green" aria-hidden="true">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>العنوان: حي العليا، طريق الأمير سلطان، الرياض (ساعات العمل: ٩ ص – ١١ م)</span>
          </div>

          <Link
            href="/"
            className="block w-full rounded-field bg-green py-3 text-center text-sm font-bold text-white transition-colors hover:bg-green-deep shadow-sm"
          >
            العودة للصفحة الرئيسية ←
          </Link>
        </div>
      )}
    </div>
  );
}
