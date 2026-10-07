import Link from 'next/link';
import { MobileHeader } from '@/components/nav/MobileHeader';
import { Badge } from '@/components/ui/Badge';
import { eventKindLabel, eventKindTone } from '@/lib/event-kinds';
import { Icon } from '@/components/ui/Icon';
import { EventRsvpButtons } from '@/components/EventRsvpButtons';
import { listUpcomingEvents, getMemberEventRsvps } from '@/lib/db/queries/events';
import { getCurrentMember } from '@/lib/db/queries/session';
import { formatGermanDate } from '@/lib/format';
import type { Event } from '@/lib/db/schema';

export const dynamic = 'force-dynamic';


function timeLabel(e: Event): string {
  if (e.allDay) return 'ganztägig';
  const pad = (n: number) => String(n).padStart(2, '0');
  let t = `${pad(e.startsAt.getHours())}:${pad(e.startsAt.getMinutes())}`;
  if (e.endsAt) t += `–${pad(e.endsAt.getHours())}:${pad(e.endsAt.getMinutes())}`;
  return `${t} Uhr`;
}

export default async function AppEventsPage() {
  const me = await getCurrentMember();
  const [events, rsvps] = await Promise.all([
    listUpcomingEvents(30),
    me ? getMemberEventRsvps(me.id) : Promise.resolve(new Map<string, 'yes' | 'maybe' | 'no'>()),
  ]);

  return (
    <>
      <MobileHeader title="Veranstaltungen" lead="Zu- & Absagen" backHref="/app/dashboard" />
      <div className="px-5 pb-8">
        {events.length === 0 ? (
          <p className="text-[14px] text-stone-500">Aktuell sind keine Termine geplant.</p>
        ) : (
          <div className="space-y-3">
            {events.map((e) => (
              <article key={e.id} className="bg-white rounded-lg border border-stone-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      href={`/veranstaltung/${e.id}`}
                      className="font-display text-[18px] text-stone-800 leading-tight hover:text-lake-700"
                    >
                      {e.title}
                    </Link>
                    <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-stone-500">
                      {formatGermanDate(e.startsAt)} · {timeLabel(e)}
                    </div>
                  </div>
                  <Badge tone={eventKindTone(e.kind)}>{eventKindLabel(e.kind)}</Badge>
                </div>
                <div className="mt-3">
                  <EventRsvpButtons eventId={e.id} initial={rsvps.get(e.id) ?? 'none'} />
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
