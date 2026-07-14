import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PRODUCTS } from '../data/products.js'
import Star from '../components/Star.jsx'

const fmt = (s) => [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60].map((n) => String(n).padStart(2, '0')).join(':')

function Steps({ step }) {
  const items = [['اختيار', 1], ['تأكيد', 2], ['استلام', 3]]
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
  )
}

const Chip = ({ label, active, onClick }) => (
  <button onClick={onClick} className={['rounded-full border px-3 py-1.5 text-[12.5px]', active ? 'border-green bg-green-tint font-semibold text-green-deep' : 'border-line'].join(' ')}>{label}</button>
)

export default function Booking() {
  const { id } = useParams()
  const navigate = useNavigate()
  const product = PRODUCTS.find((p) => p.id === id) || PRODUCTS[0]
  const [phase, setPhase] = useState('step1') // step1 | locking | step2 | step3
  const [store, setStore] = useState(0)
  const [color, setColor] = useState(0)
  const [cap, setCap] = useState(1)
  const [slot, setSlot] = useState(1)
  const [secs, setSecs] = useState(47 * 3600 + 12 * 60 + 33)

  useEffect(() => {
    if (phase !== 'step3') return
    const t = setInterval(() => setSecs((s) => (s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(t)
  }, [phase])

  const confirm = () => { setPhase('locking'); setTimeout(() => setPhase('step3'), 1600) }
  const card = 'rounded-[14px] border border-line bg-paper p-6'
  const warn = 'my-5 rounded-[10px] bg-surface px-4 py-3.5 text-[13.5px] leading-7'

  return (
    <div className="mx-auto max-w-2xl px-4 py-7 pb-28 sm:px-6">
      <h1 className="mb-1 text-center text-2xl font-extrabold">حجز {product.name}</h1>
      <Steps step={phase === 'step3' ? 3 : phase === 'step2' ? 2 : 1} />

      {phase === 'step1' && (
        <div className={card}>
          <h3 className="mb-4 text-lg font-extrabold">اختر المتجر والمواصفات</h3>
          <div className="mb-4">
            <div className="mb-2 text-[13px] font-semibold">المتجر</div>
            {[['متجر التقنية', 'حي العليا، الرياض · 2.4 كم', product.from], ['مكتبة جرير', 'طريق الملك فهد · 5.1 كم', product.p2]].map(([n, a, p], i) => (
              <button key={n} onClick={() => setStore(i)} className={['mb-2.5 flex w-full items-center gap-3.5 rounded-xl border-[1.5px] p-3.5 text-right', store === i ? 'border-green bg-green-tint' : 'border-line'].join(' ')}>
                <span className={['h-5 w-5 flex-none rounded-full border-2', store === i ? 'border-green bg-green ring-2 ring-inset ring-white' : 'border-line'].join(' ')} />
                <span className="flex-1"><b className="text-[15px] font-semibold">{n}</b><small className="mt-0.5 block text-[12.5px] text-muted">{a}</small></span>
                <span className="num text-[17px] font-semibold text-green">{p} ر.س</span>
              </button>
            ))}
          </div>
          <div className="mb-4"><div className="mb-2 text-[13px] font-semibold">اللون</div><div className="flex flex-wrap gap-2">{['تيتانيوم طبيعي', 'أسود', 'أبيض'].map((c, i) => <Chip key={c} label={c} active={color === i} onClick={() => setColor(i)} />)}</div></div>
          <div className="mb-4">
            <div className="mb-2 text-[13px] font-semibold">الكمية (حد أقصى ٢)</div>
            <div className="flex w-fit items-center overflow-hidden rounded-field border border-line">
              <button onClick={() => setCap((c) => Math.max(1, c - 1))} className="h-10 w-10 text-lg">−</button>
              <span className="num w-12 border-x border-line text-center font-semibold leading-10">{cap}</span>
              <button onClick={() => setCap((c) => Math.min(2, c + 1))} className="h-10 w-10 text-lg">+</button>
            </div>
          </div>
          <div className={warn}>الحجز يثبّت السعر والكمية لمدة ٢٤ ساعة. الإلغاء المتكرر يقيّد قدرتك على الحجز.</div>
          <button onClick={() => setPhase('step2')} className="w-full rounded-field bg-green py-3 text-sm font-semibold text-white hover:bg-green-deep">متابعة إلى التأكيد</button>
        </div>
      )}

      {phase === 'locking' && (
        <div className={`${card} text-center`}>
          <div className="mb-2.5 font-heading text-[22px] font-bold">نثبّت لك القطعة…</div>
          <p className="mb-[18px] text-[13px] text-muted">جارٍ قفل الوحدة لمنع تعارض الحجز</p>
          <div className="mx-auto h-1.5 max-w-[260px] overflow-hidden rounded bg-line"><div className="h-full w-[70%] rounded bg-green" /></div>
        </div>
      )}

      {phase === 'step2' && (
        <div className={card}>
          <h3 className="mb-4 text-lg font-extrabold">راجع وأكّد الحجز</h3>
          <div className="mb-4"><div className="mb-2 text-[13px] font-semibold">وقت الحضور المتوقع لاستلام الجهاز</div><div className="flex flex-wrap gap-2">{['اليوم ٥–٧ م', 'غداً ١٢–٢ م', 'غداً ٤–٦ م'].map((t, i) => <Chip key={t} label={t} active={slot === i} onClick={() => setSlot(i)} />)}</div></div>
          <table className="mb-[18px] w-full border-collapse text-sm">
            <tbody>
              {[['المنتج', `${product.name} · 256GB · تيتانيوم`], ['المتجر', 'متجر التقنية — حي العليا'], ['السعر المثبّت', `${product.from} ر.س`]].map(([k, v], i) => (
                <tr key={k} className={i % 2 ? 'bg-surface' : ''}><td className="w-[45%] border-b border-line px-3 py-2.5 text-muted">{k}</td><td className={['border-b border-line px-3 py-2.5', i === 2 ? 'num font-semibold text-green' : ''].join(' ')}>{v}</td></tr>
              ))}
            </tbody>
          </table>
          <div className={warn}>بالضغط على «أكّد» نقفل الوحدة باسمك لمدة ٢٤ ساعة. الدفع عند الحضور للمعرض.</div>
          <button onClick={confirm} className="w-full rounded-field bg-green py-3 text-sm font-semibold text-white hover:bg-green-deep">أكّد الحجز</button>
        </div>
      )}

      {phase === 'step3' && (
        <div className={`${card} text-center`}>
          <div className="text-[38px]">✅</div>
          <h3 className="mt-1.5 text-lg font-extrabold">تمّ تثبيت حجزك</h3>
          <div className="mb-1 mt-2 text-[13px] text-muted">رقم الحجز</div>
          <div className="num text-[26px] font-semibold tracking-wide">BK-7F42Q</div>
          <div className="mx-auto my-4 max-w-[340px] rounded-card bg-star-tint p-4">
            <div className="num text-[34px] font-semibold tracking-wider text-star">{fmt(secs)}</div>
            <small className="text-[12.5px] text-star">يُلغى الحجز تلقائياً بعد انتهاء المهلة</small>
          </div>
          <div className="my-4 flex h-28 items-center justify-center rounded-card border border-line bg-gradient-to-br from-[#e7ede9] to-[#dce6e0] text-[13px] text-muted">📍 متجر التقنية — حي العليا، الرياض</div>
          <button onClick={() => navigate('/account/bookings')} className="mb-2 w-full rounded-field bg-green py-3 text-sm font-semibold text-white hover:bg-green-deep">عرض حجوزاتي</button>
          <button className="py-2 text-[13px] font-semibold text-star">إلغاء الحجز</button>
        </div>
      )}
    </div>
  )
}
