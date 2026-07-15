'use client';

import { useEffect, useState } from 'react';
import { countdown } from '@/lib/format';

/**
 * Booking-hold countdown. Mono digits on the star-tint background — the
 * countdown is one of the four sanctioned uses of red in the whole app.
 */
export default function Countdown({
  seconds: initialSeconds,
  label = 'يُلغى الحجز تلقائياً بعد انتهاء المهلة',
}: {
  seconds: number;
  label?: string;
}) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="mx-auto my-4 max-w-[340px] rounded-card bg-star-tint p-4 text-center">
      <div dir="ltr" className="num text-[34px] font-semibold tracking-wider text-star">
        {countdown(seconds)}
      </div>
      <small className="text-[12.5px] text-star">{label}</small>
    </div>
  );
}
