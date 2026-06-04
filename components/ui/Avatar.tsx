export type AvatarTone = 'stone' | 'lake' | 'sand' | 'forest';

export type AvatarProps = {
  initials: string;
  src?: string;
  size?: number;
  tone?: AvatarTone;
  alt?: string;
};

const TONES: Record<AvatarTone, string> = {
  stone: 'bg-stone-200 text-stone-700',
  lake: 'bg-lake-100 text-lake-800',
  sand: 'bg-sand-100 text-sand-800',
  forest: 'bg-forest-100 text-forest-800',
};

export function Avatar({ initials, src, size = 36, tone = 'stone', alt }: AvatarProps) {
  if (src) {
    return (
      <span
        className="inline-block rounded-full overflow-hidden border border-white/60 bg-stone-100"
        style={{ width: size, height: size }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt ?? initials}
          width={size}
          height={size}
          className="w-full h-full object-cover"
        />
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-medium ${TONES[tone]}`}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      aria-label={alt ?? initials}
    >
      {initials}
    </span>
  );
}

export type AvatarGroupItem = {
  initials: string;
  src?: string;
  tone?: AvatarTone;
};

export type AvatarGroupProps = {
  items: AvatarGroupItem[];
  size?: number;
  max?: number;
};

export function AvatarGroup({ items, size = 32, max = 4 }: AvatarGroupProps) {
  const shown = items.slice(0, max);
  const overflow = items.length - shown.length;
  return (
    <div className="inline-flex items-center">
      {shown.map((a, i) => (
        <span
          key={`${a.initials}-${i}`}
          className="-ml-2 first:ml-0 ring-2 ring-paper-100 rounded-full"
        >
          <Avatar {...a} size={size} />
        </span>
      ))}
      {overflow > 0 && (
        <span
          className="-ml-2 ring-2 ring-paper-100 rounded-full inline-flex items-center justify-center bg-stone-200 text-stone-700 font-mono text-[11px]"
          style={{ width: size, height: size }}
        >
          +{overflow}
        </span>
      )}
    </div>
  );
}
