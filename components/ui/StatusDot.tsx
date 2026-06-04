export type StatusDotTone = 'forest' | 'sand' | 'danger' | 'lake' | 'stone';

export type StatusDotProps = {
  tone?: StatusDotTone;
  label: string;
};

const TONES: Record<StatusDotTone, string> = {
  forest: 'bg-forest-500',
  sand: 'bg-sand-500',
  danger: 'bg-danger',
  lake: 'bg-lake-500',
  stone: 'bg-stone-400',
};

export function StatusDot({ tone = 'forest', label }: StatusDotProps) {
  const dot = TONES[tone];
  return (
    <span className="inline-flex items-center gap-2 text-[13px] font-medium text-stone-700">
      <span className={`relative w-2 h-2 rounded-full ${dot}`}>
        <span
          className={`absolute inset-0 rounded-full ${dot} opacity-40 animate-ping`}
          aria-hidden="true"
        />
      </span>
      {label}
    </span>
  );
}
