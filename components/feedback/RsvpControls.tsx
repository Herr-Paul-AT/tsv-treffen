'use client';
import { useEffect, useState, useTransition } from 'react';
import { Sheet } from '@/components/overlays/Sheet';
import { Toast } from '@/components/overlays/Toast';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { setRsvp } from '@/lib/actions/rsvp';

type Status = 'none' | 'yes' | 'no' | 'maybe';

const STATUS_LABEL: Record<Exclude<Status, 'none'>, string> = {
  yes: 'Du hast zugesagt',
  no: 'Du hast abgesagt',
  maybe: 'Vielleicht — Erinnerung morgen',
};

const STATUS_TONE: Record<Exclude<Status, 'none'>, 'forest' | 'danger' | 'sand'> = {
  yes: 'forest',
  no: 'danger',
  maybe: 'sand',
};

export type RsvpControlsProps = {
  title?: string;
  initial?: Status;
  trainingId?: string;
};

export function RsvpControls({
  title = 'Mannschaftstraining Herren II',
  initial = 'none',
  trainingId,
}: RsvpControlsProps) {
  const [status, setStatus] = useState<Status>(initial);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<Status>('none');
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (toast === 'none') return;
    const id = setTimeout(() => setToast('none'), 3500);
    return () => clearTimeout(id);
  }, [toast]);

  function set(next: Status) {
    const previous = status;
    setStatus(next);
    setToast(next);
    setOpen(false);
    if (!trainingId) return;
    startTransition(async () => {
      try {
        await setRsvp(trainingId, next);
      } catch (err) {
        console.error('RSVP failed', err);
        setStatus(previous);
        setToast('none');
      }
    });
  }

  const isYes = status === 'yes';

  return (
    <>
      <div className="mt-5 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => set(isYes ? 'none' : 'yes')}
          aria-pressed={isYes}
          disabled={pending}
          className={[
            'h-11 rounded-md font-medium text-[15px] inline-flex items-center justify-center gap-2 transition-colors disabled:opacity-60',
            isYes ? 'bg-sand-500 text-stone-900' : 'bg-sand-500 text-stone-900 hover:bg-sand-600',
          ].join(' ')}
        >
          <Icon.Check size={16} /> {isYes ? 'Zugesagt' : 'Zusagen'}
        </button>
        <button
          type="button"
          onClick={() => setOpen(true)}
          disabled={pending}
          className="h-11 rounded-md bg-white/10 text-paper-50 border border-white/15 font-medium text-[15px] hover:bg-white/15 disabled:opacity-60"
        >
          {status === 'no' ? 'Abgesagt' : status === 'maybe' ? 'Vielleicht' : 'Absagen / Vielleicht'}
        </button>
      </div>

      <Sheet open={open} onClose={() => setOpen(false)} title="Rückmeldung ändern">
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500">
          Rückmeldung
        </div>
        <h3 className="font-display text-[22px] text-stone-800 mt-1.5 leading-tight">{title}</h3>
        <p className="text-[14px] text-stone-600 mt-2 leading-[1.5]">
          Sag dem Trainer Bescheid — er informiert die Mannschaft automatisch.
        </p>
        <div className="mt-5 grid grid-cols-1 gap-2">
          <Button variant="primary" size="lg" onClick={() => set('yes')} icon={<Icon.Check size={16} />}>
            Doch zusagen
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => set('maybe')}
            icon={<Icon.Clock size={16} />}
          >
            Vielleicht · entscheide ich später
          </Button>
          <Button variant="destructive" size="lg" onClick={() => set('no')} icon={<Icon.X size={16} />}>
            Endgültig absagen
          </Button>
          <Button variant="ghost" size="md" onClick={() => setOpen(false)} className="!text-stone-700">
            Schließen
          </Button>
        </div>
      </Sheet>

      {toast !== 'none' && (
        <div className="fixed bottom-[80px] left-1/2 -translate-x-1/2 z-40 px-4 w-full max-w-md">
          <Toast
            tone={STATUS_TONE[toast]}
            icon={
              toast === 'yes' ? (
                <Icon.Check size={16} />
              ) : toast === 'no' ? (
                <Icon.X size={16} />
              ) : (
                <Icon.Clock size={16} />
              )
            }
            title={STATUS_LABEL[toast]}
            body="Trainer und Mannschaft werden informiert."
            onDismiss={() => setToast('none')}
          />
        </div>
      )}
    </>
  );
}
