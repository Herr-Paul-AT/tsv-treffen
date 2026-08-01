'use client';

import { useState, useTransition } from 'react';
import { Icon } from '@/components/ui/Icon';
import { setEventRsvp, type EventRsvpStatus } from '@/lib/actions/event-rsvp';

type Status = EventRsvpStatus | 'none';

const OPTIONS: { value: EventRsvpStatus; label: string; active: string }[] = [
  { value: 'yes', label: 'Zusagen', active: 'bg-forest-600 text-paper-50 border-forest-600' },
  { value: 'maybe', label: 'Vielleicht', active: 'bg-sand-500 text-stone-900 border-sand-500' },
  { value: 'no', label: 'Absagen', active: 'bg-danger text-paper-50 border-danger' },
];

export function EventRsvpButtons({ eventId, initial = 'none' }: { eventId: string; initial?: Status }) {
  const [status, setStatus] = useState<Status>(initial);
  const [pending, startTransition] = useTransition();

  function choose(next: EventRsvpStatus) {
    const value: Status = status === next ? 'none' : next;
    const previous = status;
    setStatus(value);
    startTransition(async () => {
      try {
        await setEventRsvp(eventId, value);
      } catch {
        setStatus(previous);
      }
    });
  }

  return (
    <div className="inline-flex rounded-md border border-stone-200 overflow-hidden divide-x divide-stone-200">
      {OPTIONS.map((o) => {
        const isActive = status === o.value;
        return (
          <button
            key={o.value}
            type="button"
            disabled={pending}
            onClick={() => choose(o.value)}
            className={[
              'h-10 px-3.5 text-[13.5px] font-medium inline-flex items-center gap-1.5 transition-colors disabled:opacity-60',
              isActive ? o.active : 'bg-white text-stone-600 hover:bg-paper-100',
            ].join(' ')}
          >
            {isActive && <Icon.Check size={14} />}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
