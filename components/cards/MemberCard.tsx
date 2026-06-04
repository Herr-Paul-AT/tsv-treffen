import { Avatar, type AvatarTone } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';

export type MemberCardProps = {
  initials: string;
  name: string;
  role: string;
  since: string | number;
  ranking?: string;
  tone?: AvatarTone;
};

export function MemberCard({
  initials,
  name,
  role,
  since,
  ranking,
  tone = 'lake',
}: MemberCardProps) {
  return (
    <article className="bg-white rounded-lg border border-stone-200 p-5 flex items-center gap-4">
      <Avatar initials={initials} size={56} tone={tone} />
      <div className="flex-1 min-w-0">
        <div className="font-display text-[20px] text-stone-800 leading-[1.1]">{name}</div>
        <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500 mt-1">
          {role}
        </div>
      </div>
      <div className="text-right">
        <div className="text-[13px] text-stone-500">Mitglied seit</div>
        <div className="font-display text-[18px] text-stone-800">{since}</div>
        {ranking && (
          <div className="mt-1 inline-flex items-center gap-1 text-[12px] text-sand-700 font-medium">
            <Icon.Trophy size={12} /> LK {ranking}
          </div>
        )}
      </div>
    </article>
  );
}
