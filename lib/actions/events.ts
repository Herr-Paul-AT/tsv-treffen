'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { events } from '@/lib/db/schema';
import { uploadPublicFile } from '@/lib/supabase/storage';

function errMsg(e: unknown): string {
  return e instanceof Error ? e.message : 'Unbekannter Fehler beim Speichern.';
}

const KINDS = ['event', 'match', 'tournament', 'training'] as const;
type Kind = (typeof KINDS)[number];

type EventValues = {
  title: string;
  kind: Kind;
  startsAt: Date;
  endsAt: Date | null;
  allDay: boolean;
  location: string | null;
  description: string | null;
};

function parseEventForm(formData: FormData): EventValues {
  const title = String(formData.get('title') ?? '').trim();
  const kindRaw = String(formData.get('kind') ?? 'event');
  const kind: Kind = (KINDS as readonly string[]).includes(kindRaw) ? (kindRaw as Kind) : 'event';
  const startsAtRaw = String(formData.get('startsAt') ?? '').trim();
  const endsAtRaw = String(formData.get('endsAt') ?? '').trim();
  const allDay = formData.get('allDay') === 'on';
  const location = String(formData.get('location') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim();

  if (!title) throw new Error('Titel ist erforderlich.');
  if (!startsAtRaw) throw new Error('Ein Beginn-Datum ist erforderlich.');

  const startsAt = new Date(startsAtRaw);
  if (Number.isNaN(startsAt.getTime())) throw new Error('Ungültiges Beginn-Datum.');

  let endsAt: Date | null = null;
  if (endsAtRaw) {
    endsAt = new Date(endsAtRaw);
    if (Number.isNaN(endsAt.getTime())) throw new Error('Ungültiges Ende-Datum.');
    if (endsAt < startsAt) throw new Error('Das Ende darf nicht vor dem Beginn liegen.');
  }

  return {
    title,
    kind,
    startsAt,
    endsAt,
    allDay,
    location: location || null,
    description: description || null,
  };
}

/** Alle Ansichten, die Veranstaltungen anzeigen, neu laden. */
function revalidateEventViews() {
  revalidatePath('/admin/veranstaltungen');
  revalidatePath('/admin');
  revalidatePath('/admin/trainings');
  revalidatePath('/app/kalender');
  revalidatePath('/app/dashboard');
  revalidatePath('/');
}

export async function createEvent(formData: FormData) {
  try {
    const values = parseEventForm(formData);
    const file = formData.get('attachment');
    const up = await uploadPublicFile(file instanceof File ? file : null, 'events');
    await db.insert(events).values({
      ...values,
      attachmentUrl: up?.url ?? null,
      attachmentName: up?.name ?? null,
    });
  } catch (e) {
    redirect(`/admin/veranstaltungen/neu?error=${encodeURIComponent(errMsg(e))}`);
  }
  revalidateEventViews();
  redirect('/admin/veranstaltungen');
}

export async function updateEvent(formData: FormData) {
  const id = String(formData.get('id') ?? '').trim();
  if (!id) throw new Error('Datensatz-ID fehlt.');
  try {
    const values = parseEventForm(formData);
    const file = formData.get('attachment');
    const up = await uploadPublicFile(file instanceof File ? file : null, 'events');
    const currentUrl = String(formData.get('currentAttachmentUrl') ?? '').trim() || null;
    const currentName = String(formData.get('currentAttachmentName') ?? '').trim() || null;
    await db
      .update(events)
      .set({
        ...values,
        attachmentUrl: up?.url ?? currentUrl,
        attachmentName: up?.name ?? currentName,
      })
      .where(eq(events.id, id));
  } catch (e) {
    redirect(`/admin/veranstaltungen/${id}?error=${encodeURIComponent(errMsg(e))}`);
  }
  revalidateEventViews();
  redirect('/admin/veranstaltungen');
}

export async function deleteEvent(formData: FormData) {
  const id = String(formData.get('id') ?? '').trim();
  if (!id) throw new Error('Datensatz-ID fehlt.');
  await db.delete(events).where(eq(events.id, id));
  revalidateEventViews();
  redirect('/admin/veranstaltungen');
}
