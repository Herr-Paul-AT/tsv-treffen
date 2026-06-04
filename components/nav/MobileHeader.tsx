import type { ReactNode } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';

export type MobileHeaderProps = {
  title: string;
  lead?: string;
  action?: ReactNode;
  backHref?: string;
};

export function MobileHeader({ title, lead, action, backHref }: MobileHeaderProps) {
  return (
    <div className="pt-4 px-5 pb-3 flex items-center gap-3">
      {backHref && (
        <Link
          href={backHref}
          aria-label="Zurück"
          className="w-11 h-11 -ml-2 inline-flex items-center justify-center rounded-full text-stone-700 hover:bg-stone-100"
        >
          <Icon.ArrowLeft />
        </Link>
      )}
      <div className="flex-1 min-w-0">
        {lead && (
          <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-stone-500">
            {lead}
          </div>
        )}
        <div className="font-display text-[24px] leading-[1.1] text-stone-800 truncate">
          {title}
        </div>
      </div>
      {action}
    </div>
  );
}
