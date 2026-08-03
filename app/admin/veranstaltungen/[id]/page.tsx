import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { EventForm } from '@/components/admin/EventForm';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { Button } from '@/components/ui/Button';
import { getEvent, listEventRegistrations, countEventParticipants } from '@/lib/db/queries/events';
import { deleteEvent, updateEvent } from '@/lib/actions/events';

export const dynamic = 'force-dynamic';

export default async function EditEventPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const event = await getEvent(id);
  if (!event) notFound();

  const registrations = event.registrationOpen ? await listEventRegistrations(id) : [];
  const taken = event.registrationOpen ? await countEventParticipants(id) : 0;

  return (
    <main className="px-8 py-6 max-w-[1280px] mx-auto">
      <Link
        href="/admin/veranstaltungen"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-stone-600 hover:text-stone-800"
      >
        <Icon.ArrowLeft size={14} /> Zurück zur Übersicht
      </Link>
      <div className="mt-3">
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500">
          Adminbereich · Planung
        </div>
        <h1 className="font-display text-[36px] leading-[1.05] text-stone-800 mt-1">
          Veranstaltung bearbeiten
        </h1>
      </div>

      {sp.error && (
        <div className="mt-5 max-w-2xl flex items-start gap-2.5 rounded-md bg-danger/5 border border-danger/20 px-4 py-3 text-[14px] text-danger">
          <Icon.Info size={16} className="flex-none mt-0.5" />
          <span>{sp.error}</span>
        </div>
      )}
      <EventForm action={updateEvent} event={event} submitLabel="Änderungen speichern" />

      {event.registrationOpen && (
        <section className="mt-12 max-w-2xl border-t border-stone-200 pt-6">
          <div className="flex items-baseline justify-between gap-3 flex-wrap">
            <h2 className="font-display text-[20px] text-stone-800">Anmeldungen</h2>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-stone-500">
                {taken} Teilnehmer{event.maxAttendees != null ? ` / ${event.maxAttendees} Plätze` : ''} ·{' '}
                {registrations.length} Anmeldung(en)
              </span>
              {registrations.length > 0 && (
                <a href={`/admin/veranstaltungen/${event.id}/export`} download>
                  <Button variant="secondary" size="sm" icon={<Icon.Download size={14} />}>
                    CSV
                  </Button>
                </a>
              )}
            </div>
          </div>
          <div className="mt-4 bg-white rounded-lg border border-stone-200 overflow-hidden">
            {registrations.length === 0 && (
              <div className="px-5 py-8 text-center text-[14px] text-stone-500">
                Noch keine Anmeldungen.
              </div>
            )}
            {registrations.map((r, i) => (
              <div
                key={r.id}
                className={[
                  'px-5 py-3 border-b border-stone-100 last:border-b-0 flex items-center justify-between gap-3',
                  i % 2 ? '' : 'bg-paper-50/40',
                ].join(' ')}
              >
                <div className="min-w-0">
                  <div className="text-[14.5px] font-medium text-stone-800 truncate">
                    {r.name}
                    {r.participants > 1 && (
                      <span className="ml-2 font-mono text-[11px] text-stone-500">×{r.participants}</span>
                    )}
                  </div>
                  <div className="font-mono text-[11.5px] text-stone-500 truncate">
                    {r.email}
                    {r.phone ? ` · ${r.phone}` : ''}
                  </div>
                  {r.message && <div className="text-[13px] text-stone-600 mt-1">{r.message}</div>}
                </div>
                <a href={`mailto:${r.email}`} className="text-lake-700 flex-none" aria-label="Antworten">
                  <Icon.Mail size={16} />
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="mt-12 max-w-2xl border-t border-stone-200 pt-6">
        <h2 className="font-display text-[18px] text-stone-800">Gefahrenzone</h2>
        <p className="text-[14px] text-stone-600 mt-1.5 mb-4">
          Dieser Termin wird dauerhaft entfernt — auch aus Kalender, Dashboard und Startseite.
        </p>
        <DeleteButton
          action={deleteEvent}
          id={event.id}
          label="Veranstaltung löschen"
          confirmText={`„${event.title}" wirklich löschen? Das kann nicht rückgängig gemacht werden.`}
        />
      </div>
    </main>
  );
}
