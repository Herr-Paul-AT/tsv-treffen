'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { events, eventRegistrations } from '@/lib/db/schema';
import { getEvent, countEventParticipants } from '@/lib/db/queries/events';
import { uploadPublicFile } from '@/lib/supabase/storage';
import { sendNotificationMail } from '@/lib/mailer';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function errMsg(e: unknown): string {
  return e instanceof Error ? e.message : 'Unbekannter Fehler beim Speichern.';
}

const KINDS = ['event', 'match', 'tournament', 'training', 'camp'] as const;
type Kind = (typeof KINDS)[number];

type EventValues = {
  title: string;
  kind: Kind;
  startsAt: Date;
  endsAt: Date | null;
  allDay: boolean;
  location: string | null;
  description: string | null;
  registrationOpen: boolean;
  maxAttendees: number | null;
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

  const registrationOpen = formData.get('registrationOpen') === 'on';
  const maxRaw = String(formData.get('maxAttendees') ?? '').trim();
  const maxParsed = Number.parseInt(maxRaw, 10);
  const maxAttendees = maxRaw && !Number.isNaN(maxParsed) && maxParsed > 0 ? maxParsed : null;

  return {
    title,
    kind,
    startsAt,
    endsAt,
    allDay,
    location: location || null,
    description: description || null,
    registrationOpen,
    maxAttendees,
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

/** Öffentliche Anmeldung zu einer Veranstaltung (Camp/Training) — Mail an Verein. */
export async function submitEventRegistration(formData: FormData) {
  const eventId = String(formData.get('eventId') ?? '').trim();
  if (!eventId) throw new Error('Veranstaltung fehlt.');

  const back = (msg: string): never =>
    redirect(`/veranstaltung/${eventId}?error=${encodeURIComponent(msg)}`);

  const event = await getEvent(eventId);
  if (!event || !event.registrationOpen) {
    back('Für diese Veranstaltung ist keine Anmeldung (mehr) möglich.');
  }

  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const phone = String(formData.get('phone') ?? '').trim() || null;
  const message = String(formData.get('message') ?? '').trim() || null;
  const partRaw = Number.parseInt(String(formData.get('participants') ?? '1'), 10);
  const participants = Number.isNaN(partRaw) || partRaw < 1 ? 1 : partRaw;

  if (!name) back('Bitte einen Namen angeben.');
  if (!EMAIL_RE.test(email)) back('Bitte eine gültige E-Mail-Adresse angeben.');
  if (formData.get('privacyConsent') !== 'on') back('Bitte der Datenschutzerklärung zustimmen.');

  const ev = event!;
  if (ev.maxAttendees != null) {
    const taken = await countEventParticipants(eventId);
    if (taken + participants > ev.maxAttendees) {
      back(`Nicht genug freie Plätze — es sind noch ${Math.max(0, ev.maxAttendees - taken)} frei.`);
    }
  }

  await db.insert(eventRegistrations).values({ eventId, name, email, phone, participants, message });
  revalidateEventViews();
  revalidatePath(`/veranstaltung/${eventId}`);

  try {
    const body = [
      `Neue Anmeldung zur Veranstaltung „${ev.title}":`,
      ``,
      `Name: ${name}`,
      `E-Mail: ${email}`,
      phone ? `Telefon: ${phone}` : ``,
      `Teilnehmer: ${participants}`,
      message ? `\nNachricht:\n${message}` : ``,
      ``,
      `Alle Anmeldungen im Adminbereich unter Veranstaltungen.`,
    ]
      .filter((l) => l !== ``)
      .join('\n');
    await sendNotificationMail({ subject: `Anmeldung: ${ev.title}`, body, replyTo: email });
  } catch {
    // Anmeldung ist gespeichert, Mailversand egal.
  }

  redirect(`/veranstaltung/${eventId}?angemeldet=1`);
}
