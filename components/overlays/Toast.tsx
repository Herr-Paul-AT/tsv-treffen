import type { ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon';

export type ToastTone = 'forest' | 'danger' | 'sand';

export type ToastProps = {
  tone?: ToastTone;
  icon?: ReactNode;
  title: string;
  body?: string;
  onDismiss?: () => void;
};

const TONES: Record<ToastTone, { wrap: string; icon: string }> = {
  forest: { wrap: 'border-forest-200 bg-white', icon: 'bg-forest-100 text-forest-700' },
  danger: { wrap: 'border-[#F4D5D2] bg-white', icon: 'bg-[#FBEDEC] text-danger' },
  sand: { wrap: 'border-sand-200 bg-white', icon: 'bg-sand-100 text-sand-800' },
};

export function Toast({ tone = 'forest', icon, title, body, onDismiss }: ToastProps) {
  const t = TONES[tone];
  return (
    <div
      role="status"
      className={`flex items-start gap-3 p-4 rounded-lg border ${t.wrap} shadow-pop max-w-[420px]`}
    >
      <span
        className={`mt-0.5 flex-none w-8 h-8 inline-flex items-center justify-center rounded-full ${t.icon}`}
      >
        {icon}
      </span>
      <div className="flex-1">
        <div className="font-display text-[17px] text-stone-800 leading-tight">{title}</div>
        {body && <div className="text-[13.5px] text-stone-600 mt-0.5">{body}</div>}
      </div>
      {onDismiss && (
        <button
          type="button"
          aria-label="Schließen"
          onClick={onDismiss}
          className="text-stone-400 hover:text-stone-600"
        >
          <Icon.X size={16} />
        </button>
      )}
    </div>
  );
}
