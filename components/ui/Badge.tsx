import type { ReactNode } from 'react';

export type BadgeTone =
  | 'neutral'
  | 'lake'
  | 'sand'
  | 'forest'
  | 'danger'
  | 'warn'
  | 'dark';

export type BadgeProps = {
  tone?: BadgeTone;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
};

const TONES: Record<BadgeTone, string> = {
  neutral: 'bg-stone-100 text-stone-700 border-stone-200',
  lake: 'bg-lake-50 text-lake-800 border-lake-100',
  sand: 'bg-sand-50 text-sand-800 border-sand-100',
  forest: 'bg-forest-50 text-forest-800 border-forest-100',
  danger: 'bg-[#FBEDEC] text-danger border-[#F4D5D2]',
  warn: 'bg-[#F8EFE2] text-[#7E5424] border-[#E9D7B7]',
  dark: 'bg-stone-800 text-paper-100 border-stone-800',
};

export function Badge({ tone = 'neutral', icon, children, className = '' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 px-2.5 h-6 rounded-full text-[12px] font-medium border',
        TONES[tone],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {icon}
      {children}
    </span>
  );
}
