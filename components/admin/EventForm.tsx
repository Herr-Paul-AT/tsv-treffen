import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { Icon } from '@/components/ui/Icon';
import type { Event } from '@/lib/db/schema';

const KIND_OPTIONS = [
  { value: 'tournament', label: 'Turnier' },
  { value: 'event', label: 'Veranstaltung / Treffen' },
  { value: 'match', label: 'Match / Wettkampf' },
  { value: 'training', label: 'Training' },
];

function toLocalInput(d: Date | null | undefined): string {
  if (!d) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(
    d.getMinutes(),
  )}`;
}

const fieldLabel = 'font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500';

export function EventForm({
  action,
  event,
  submitLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  event?: Event;
  submitLabel: string;
}) {
  return (
    <form action={action} className="mt-8 max-w-2xl space-y-5" encType="multipart/form-data">
      {event && <input type="hidden" name="id" value={event.id} />}
      {event?.attachmentUrl && (
        <input type="hidden" name="currentAttachmentUrl" value={event.attachmentUrl} />
      )}
      {event?.attachmentName && (
        <input type="hidden" name="currentAttachmentName" value={event.attachmentName} />
      )}

      <TextField
        label="Titel"
        name="title"
        required
        defaultValue={event?.title ?? ''}
        placeholder="z. B. Clubmeisterschaft 2026"
      />

      <div>
        <label htmlFor="event-kind" className="block">
          <span className={fieldLabel}>Art</span>
          <select
            id="event-kind"
            name="kind"
            defaultValue={event?.kind ?? 'event'}
            className="mt-2 w-full h-12 px-4 bg-white rounded-md border border-stone-200 text-[16px] text-stone-800 outline-none focus:border-lake-500 focus:ring-2 focus:ring-lake-500/15"
          >
            {KIND_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <TextField
          label="Beginn"
          name="startsAt"
          type="datetime-local"
          required
          defaultValue={toLocalInput(event?.startsAt)}
        />
        <TextField
          label="Ende (optional)"
          name="endsAt"
          type="datetime-local"
          defaultValue={toLocalInput(event?.endsAt)}
        />
      </div>

      <label className="flex items-center gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          name="allDay"
          defaultChecked={event?.allDay ?? false}
          className="w-5 h-5 rounded border-stone-300 text-lake-700 focus:ring-lake-500/30"
        />
        <span className="text-[15px] text-stone-700">Ganztägig</span>
      </label>

      <TextField
        label="Ort (optional)"
        name="location"
        defaultValue={event?.location ?? ''}
        placeholder="z. B. Anlage Schlossweg"
      />

      <div>
        <label htmlFor="event-description" className="block">
          <span className={fieldLabel}>Beschreibung (optional)</span>
          <textarea
            id="event-description"
            name="description"
            rows={4}
            defaultValue={event?.description ?? ''}
            placeholder="Worum geht es bei diesem Termin?"
            className="mt-2 w-full px-4 py-3 bg-white rounded-md border border-stone-200 text-[16px] text-stone-800 placeholder-stone-400 outline-none focus:border-lake-500 focus:ring-2 focus:ring-lake-500/15 resize-y"
          />
        </label>
      </div>

      <div>
        <span className={fieldLabel}>Flyer / Anhang (optional)</span>
        {event?.attachmentUrl && (
          <a
            href={event.attachmentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-lake-700"
          >
            <Icon.Document size={14} /> {event.attachmentName ?? 'Aktueller Anhang'}
          </a>
        )}
        <input
          type="file"
          name="attachment"
          accept="image/png,image/jpeg,image/webp,application/pdf"
          className="mt-2 block w-full text-[14px] text-stone-700 file:mr-4 file:h-11 file:px-4 file:rounded-md file:border-0 file:bg-stone-800 file:text-paper-50 file:text-[14px] file:font-medium hover:file:bg-stone-700 file:cursor-pointer"
        />
        <p className="mt-1.5 text-[12.5px] text-stone-500">
          Bild oder PDF, max. 5 MB.{event ? ' Leer lassen, um den aktuellen Anhang zu behalten.' : ''}
        </p>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" variant="primary" icon={<Icon.Check size={16} />}>
          {submitLabel}
        </Button>
        <Link
          href="/admin/veranstaltungen"
          className="inline-flex items-center justify-center h-11 px-5 text-[15px] font-medium rounded-md text-stone-700 hover:bg-stone-100"
        >
          Abbrechen
        </Link>
      </div>
    </form>
  );
}
