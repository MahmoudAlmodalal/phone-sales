import Badge from '@/components/Badge';
import Countdown from '@/components/Countdown';

export default function Bookings() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="rounded-card border border-line bg-paper p-3.5">
        <div className="flex items-center justify-between">
          <b>iPhone 15 Pro Max</b>
          <Badge variant="drop">نشط</Badge>
        </div>
        <div className="mt-1 text-xs text-muted">متجر التقنية · BK-7F42Q</div>
        <Countdown seconds={23 * 3600 + 12 * 60 + 33} label="ينتهي بعد" />
      </div>
      <div className="rounded-card border border-line bg-paper p-3.5">
        <div className="flex items-center justify-between">
          <b>Galaxy S24</b>
          <Badge variant="neutral">مكتمل</Badge>
        </div>
        <div className="mt-1 text-xs text-muted">مكتبة جرير · BK-6620P</div>
        <div className="mt-3 text-[13px] text-muted">تمّ الاستلام في ٢ يونيو</div>
      </div>
      <div className="rounded-card border border-line bg-paper p-3.5">
        <div className="flex items-center justify-between">
          <b className="text-muted line-through">Pixel 8</b>
          <Badge variant="rise">ملغي</Badge>
        </div>
        <div className="mt-1 text-xs text-muted">إكسترا · BK-5410M</div>
        <div className="mt-3 text-[13px] text-muted">أُلغي — لم يتم الحضور</div>
      </div>
    </div>
  );
}
