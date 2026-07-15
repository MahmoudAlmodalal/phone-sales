import Badge from '@/components/Badge';

const ROWS: [string, string, string, string, boolean][] = [
  ['iPhone 15 Pro Max', '4,700', '4,650', '−50', true],
  ['Galaxy S24 Ultra', '4,000', '4,299', '+299', false],
  ['Xiaomi 14', '2,300', '2,499', '+199', false],
];

export default function Alerts() {
  return (
    <table className="w-full overflow-hidden rounded-card border border-line bg-paper text-sm">
      <thead>
        <tr className="bg-surface text-[12.5px] text-muted">
          {['المنتج', 'الحد المطلوب', 'السعر الحالي', 'الفارق', 'الحالة'].map((h) => (
            <th key={h} className="px-3.5 py-2.5 text-right font-semibold">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {ROWS.map(([n, t, c, d, hit]) => (
          <tr key={n} className={hit ? 'bg-green-tint' : ''}>
            <td className="border-t border-line px-3.5 py-3">{n}</td>
            <td dir="ltr" className="num border-t border-line px-3.5 py-3 font-semibold">{t}</td>
            <td dir="ltr" className="num border-t border-line px-3.5 py-3 font-semibold">{c}</td>
            <td dir="ltr" className={['num border-t border-line px-3.5 py-3 font-semibold', d.startsWith('−') ? 'text-green' : 'text-muted'].join(' ')}>{d}</td>
            <td className="border-t border-line px-3.5 py-3">
              <Badge variant={hit ? 'drop' : 'neutral'}>{hit ? 'تحقّق ✓' : 'يراقب'}</Badge>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
