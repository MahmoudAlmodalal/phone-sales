const ROWS: [string, string, string, string, 'star' | 'green'][] = [
  ['متجر التقنية', 'بائع', 'موثّق', 'تعليق', 'star'],
  ['عبدالله الشمري', 'مستخدم', 'نشط', 'تقييد', 'star'],
  ['متجر النخبة', 'بائع', 'قيد المراجعة', 'توثيق', 'green'],
];

export default function Users() {
  return (
    <table className="w-full overflow-hidden rounded-card border border-line bg-paper text-sm">
      <thead>
        <tr className="bg-surface text-[12.5px] text-muted">
          {['الاسم', 'النوع', 'الحالة', 'إجراءات'].map((h) => (
            <th key={h} className="px-3.5 py-2.5 text-right font-semibold">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {ROWS.map(([n, t, st, action, ac]) => (
          <tr key={n}>
            <td className="border-t border-line px-3.5 py-3">{n}</td>
            <td className="border-t border-line px-3.5 py-3">{t}</td>
            <td className="border-t border-line px-3.5 py-3">
              <span className={`rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${st === 'قيد المراجعة' ? 'bg-surface text-muted' : 'bg-green-tint text-green-deep'}`}>{st}</span>
            </td>
            <td className="border-t border-line px-3.5 py-3">
              <button className={['font-semibold', ac === 'star' ? 'text-star' : 'text-green'].join(' ')}>{action}</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
