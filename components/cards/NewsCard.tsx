import { Icon } from '@/components/ui/Icon';

export type NewsCardProps = {
  pinned?: boolean;
  eyebrow: string;
  title: string;
  excerpt: string;
  image?: 'lake' | 'sand';
  date: string;
  author: string;
  comments?: number;
};

export function NewsCard({
  pinned,
  eyebrow,
  title,
  excerpt,
  image = 'lake',
  date,
  author,
  comments,
}: NewsCardProps) {
  return (
    <article className="bg-white rounded-lg border border-stone-200 overflow-hidden shadow-card flex flex-col">
      <div className={`relative h-44 ${image === 'sand' ? 'ph-sand' : 'ph-lake'}`}>
        {pinned && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 h-7 rounded-full bg-stone-800 text-paper-50 text-[11px] font-medium">
            <Icon.Pin size={12} /> Angeheftet
          </span>
        )}
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-sand-700">
          {eyebrow}
        </span>
        <h3 className="font-display text-[22px] leading-[1.15] text-stone-800 mt-2.5">{title}</h3>
        <p className="text-[14px] text-stone-600 leading-[1.55] mt-3 flex-1">{excerpt}</p>
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-stone-100">
          <span className="font-mono text-[11px] text-stone-500 uppercase tracking-[0.14em]">
            {date} · {author}
          </span>
          {comments !== undefined && (
            <span className="text-[12px] text-stone-500">{comments} Kommentare</span>
          )}
        </div>
      </div>
    </article>
  );
}
