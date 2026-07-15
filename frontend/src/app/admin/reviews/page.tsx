const ROWS: [string, string, string][] = [
  ['«جهاز أصلي والسعر ممتاز» — 5.0', 'iPhone 15 Pro Max', 'BK-7F42Q ✓'],
  ['«الاستلام كان سريعاً» — 4.0', 'Galaxy S24', 'BK-6620P ✓'],
];

export default function Reviews() {
  return (
    <table className="w-full overflow-hidden rounded-card border border-line bg-paper text-sm">
      <thead>
        <tr className="bg-surface text-[12.5px] text-muted">
          {['التقييم', 'المنتج', 'الحجز المرتبط', 'إجراء'].map((h) => (
            <th key={h} className="px-3.5 py-2.5 text-right font-semibold">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {ROWS.map(([r, p, b]) => (
          <tr key={b}>
            <td className="border-t border-line px-3.5 py-3">{r}</td>
            <td className="border-t border-line px-3.5 py-3">{p}</td>
            <td dir="ltr" className="num border-t border-line px-3.5 py-3">{b}</td>
            <td className="whitespace-nowrap border-t border-line px-3.5 py-3">
              <button className="font-semibold text-green">قبول</button> · <button className="font-semibold text-star">رفض</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
