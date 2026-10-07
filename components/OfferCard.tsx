import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import type { TrainingOffer } from '@/lib/db/queries/events';
import { eventKindLabel, eventKindTone } from '@/lib/event-kinds';
import { formatDayMonthCaps, MONTHS_DE } from '@/lib/format';

function formatPrice(cents: number): string {
  return new Intl.NumberFormat('de-AT', {
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

function formatRange(start: Date, end: Date | null): string {
  if (end && (end.getDate() !== start.getDate() || end.getMonth() !== start.getMonth())) {
    const m = MONTHS_DE[end.getMonth()].toUpperCase();
    if (end.getMonth() === start.getMonth()) {
      return `${String(start.getDate()).padStart(2, '0')}.–${String(end.getDate()).padStart(2, '0')}. ${m}`;
    }
    return `${formatDayMonthCaps(start)} – ${formatDayMonthCaps(end)}`;
  }
  return formatDayMonthCaps(start);
}

/** Buchbares Angebot (Training/Camp/Trainingslager) als Karte im Tarif-Stil. */
export function OfferCard({ offer: o }: { offer: TrainingOffer }) {
  const spotsLeft = o.maxAttendees != null ? Math.max(0, o.maxAttendees - o.taken) : null;
  const full = o.maxAttendees != null && spotsLeft === 0;
  return (
    <article className="bg-white rounded-xl border border-stone-200 p-6 flex flex-col transition-all hover:border-stone-300 hover:shadow-card">
      <div className="flex items-center justify-between gap-2">
        <Badge tone={eventKindTone(o.kind)}>{eventKindLabel(o.kind)}</Badge>
        <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-stone-500">
          {formatRange(o.startsAt, o.endsAt)}
        </span>
      </div>
      <h3 className="font-display text-[22px] leading-[1.15] text-stone-800 mt-4">{o.title}</h3>
      {o.description && (
        <p className="text-[14px] text-stone-600 mt-2 leading-[1.55] line-clamp-3">{o.description}</p>
      )}
      <div className="mt-5 flex items-baseline gap-1.5">
        {o.priceCents != null ? (
          <>
            <span className="font-display text-[30px] leading-none text-stone-800">€ {formatPrice(o.priceCents)}</span>
            <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-stone-500">pro Teilnehmer</span>
          </>
        ) : (
          <span className="text-[14px] text-stone-600">Preis auf Anfrage</span>
        )}
      </div>
      <div className="mt-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em]">
        {full ? (
          <span className="text-sand-700">Ausgebucht</span>
        ) : spotsLeft != null ? (
          <span className="text-forest-700">
            Noch {spotsLeft} {spotsLeft === 1 ? 'Platz' : 'Plätze'} frei
          </span>
        ) : (
          <span className="text-forest-700">Anmeldung offen</span>
        )}
      </div>
      <div className="mt-auto pt-6">
        <Link href={`/veranstaltung/${o.id}`} className="block">
          <Button variant={full ? 'secondary' : 'primary'} className="w-full" iconAfter={<Icon.ArrowRight size={14} />}>
            {full ? 'Details & Warteliste' : 'Jetzt anmelden'}
          </Button>
        </Link>
      </div>
    </article>
  );
}
