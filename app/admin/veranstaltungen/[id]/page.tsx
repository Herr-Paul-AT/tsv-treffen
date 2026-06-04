import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { EventForm } from '@/components/admin/EventForm';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { getEvent } from '@/lib/db/queries/events';
import { deleteEvent, updateEvent } from '@/lib/actions/events';

export const dynamic = 'force-dynamic';

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEvent(id);
  if (!event) notFound();

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

      <EventForm action={updateEvent} event={event} submitLabel="Änderungen speichern" />

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
