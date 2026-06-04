'use client';

import { useState, useTransition } from 'react';
import { Icon } from '@/components/ui/Icon';
import { setRsvp, type RsvpStatus } from '@/lib/actions/rsvp';

export type RsvpSegmentedProps = {
  trainingId: string;
  initial: RsvpStatus | null;
};

export function RsvpSegmented({ trainingId, initial }: RsvpSegmentedProps) {
  const [status, setStatus] = useState<RsvpStatus | null>(initial);
  const [pending, startTransition] = useTransition();

  function set(next: RsvpStatus) {
    const previous = status;
    setStatus(next);
    startTransition(async () => {
      try {
        await setRsvp(trainingId, next);
      } catch (err) {
        console.error('RSVP failed', err);
        setStatus(previous);
      }
    });
  }

  return (
    <div className="mt-2 grid grid-cols-3 gap-2">
      <button
        type="button"
        onClick={() => set('yes')}
        aria-pressed={status === 'yes'}
        disabled={pending}
        className={[
          'h-14 rounded-lg font-medium text-[14px] flex flex-col items-center justify-center gap-0.5 disabled:opacity-60',
          status === 'yes' ? 'bg-forest-500 text-paper-50' : 'bg-white border border-stone-200 text-stone-700',
        ].join(' ')}
      >
        <Icon.Check size={18} /> Zusagen
      </button>
      <button
        type="button"
        onClick={() => set('maybe')}
        aria-pressed={status === 'maybe'}
        disabled={pending}
        className={[
          'h-14 rounded-lg font-medium text-[14px] flex flex-col items-center justify-center gap-0.5 disabled:opacity-60',
          status === 'maybe' ? 'bg-sand-500 text-stone-900' : 'bg-white border border-stone-200 text-stone-700',
        ].join(' ')}
      >
        <Icon.Clock size={18} /> Vielleicht
      </button>
      <button
        type="button"
        onClick={() => set('no')}
        aria-pressed={status === 'no'}
        disabled={pending}
        className={[
          'h-14 rounded-lg font-medium text-[14px] flex flex-col items-center justify-center gap-0.5 disabled:opacity-60',
          status === 'no' ? 'bg-stone-800 text-paper-50' : 'bg-white border border-stone-200 text-stone-700',
        ].join(' ')}
      >
        <Icon.X size={18} /> Absagen
      </button>
    </div>
  );
}
