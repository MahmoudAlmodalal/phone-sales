'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  useEffect(() => {
    const t = setTimeout(() => reset(), 4000);
    return () => clearTimeout(t);
  }, [reset]);

  return (
    <div className="mx-auto flex max-w-[1200px] flex-col items-center px-6 py-24 text-center">
      <h1 className="text-xl font-bold">تعذّر تحميل الأسعار</h1>
      <p className="mt-2 text-sm text-muted">نحاول مجددًا خلال ثوانٍ.</p>
      <button
        onClick={reset}
        className="mt-6 rounded-field bg-green px-5 py-3 text-sm font-semibold text-white hover:bg-green-deep"
      >
        إعادة المحاولة الآن
      </button>
    </div>
  );
}
