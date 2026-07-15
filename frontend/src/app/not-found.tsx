import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-[1200px] flex-col items-center px-6 py-24 text-center">
      <div dir="ltr" className="num text-6xl font-semibold text-green">404</div>
      <h1 className="mt-4 text-xl font-bold">هذه الصفحة غير موجودة</h1>
      <p className="mt-2 text-sm text-muted">جرّب البحث عن المنتج الذي تريده.</p>
      <Link
        href="/search"
        className="mt-6 rounded-field bg-green px-5 py-3 text-sm font-semibold text-white hover:bg-green-deep"
      >
        الذهاب إلى البحث
      </Link>
    </div>
  );
}
