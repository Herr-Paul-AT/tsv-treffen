import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';

export type TerminType = 'Training' | 'Match' | 'Event';
export type TerminStatus = 'regular' | 'cancelled' | 'full';

export type TerminCardProps = {
  type?: TerminType;
  title: string;
  time: { day: number | string; month: string; hour: string };
  court: string;
  trainer?: string;
  slots?: string;
  status?: TerminStatus;
};

const TYPE_TONE = { Training: 'forest', Match: 'lake', Event: 'sand' } as const;

export function TerminCard({
  type = 'Training',
  title,
  time,
  court,
  trainer,
  slots,
  status = 'regular',
}: TerminCardProps) {
  return (
    <article className="bg-white rounded-lg border border-stone-200 p-5 flex gap-5 items-start">
      <div className="flex-none w-16 text-center">
        <div className="font-display text-[28px] text-stone-800 leading-none">{time.day}</div>
        <div className="font-mono text-[11px] text-stone-500 uppercase tracking-[0.14em] mt-1">
          {time.month}
        </div>
        <div className="mt-2 text-[13px] text-stone-600 font-medium">{time.hour}</div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <Badge tone={TYPE_TONE[type]}>{type}</Badge>
          {status === 'cancelled' && <Badge tone="danger">Abgesagt</Badge>}
          {status === 'full' && <Badge tone="warn">Warteliste</Badge>}
        </div>
        <h4 className="font-display text-[20px] text-stone-800 leading-[1.2]">{title}</h4>
        <div className="mt-2 text-[13px] text-stone-500 flex items-center gap-4 flex-wrap">
          <span className="inline-flex items-center gap-1.5">
            <Icon.MapPin size={14} />
            {court}
          </span>
          {trainer && (
            <span className="inline-flex items-center gap-1.5">
              <Icon.User size={14} />
              {trainer}
            </span>
          )}
          {slots && (
            <span className="inline-flex items-center gap-1.5">
              <Icon.Users size={14} />
              {slots}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
