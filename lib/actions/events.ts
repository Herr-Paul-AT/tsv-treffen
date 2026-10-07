'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { after } from 'next/server';
import { db } from '@/lib/db';
import { events, eventRegistrations } from '@/lib/db/schema';
import {
  getEvent,
  countEventParticipants,
  listEventParticipantRecipients,
} from '@/lib/db/queries/events';
import { resolveRecipients } from '@/lib/db/queries/newsletters';
import { uploadPublicFile } from '@/lib/supabase/storage';
import { sendBulkMail, sendNotificationMail } from '@/lib/mailer';
import { formatGermanDate } from '@/lib/format';
import { EVENT_KIND_VALUES, type EventKind } from '@/lib/event-kinds';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function errMsg(e: unknown): string {
  return e instanceof Error ? e.message : 'Unbekannter Fehler beim Speichern.';
}

type Kind = EventKind;

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
  priceCents: number | null;
  forKids: boolean;
};

function timeText(startsAt: Date, endsAt: Date | null, allDay: boolean): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const date = formatGermanDate(startsAt);
  if (allDay) return `${date} (ganztägig)`;
  let t = `${pad(startsAt.getHours())}:${pad(startsAt.getMinutes())}`;
  if (endsAt) t += `–${pad(endsAt.getHours())}:${pad(endsAt.getMinutes())}`;
  return `${date}, ${t} Uhr`;
}

/**
 * Teilnehmer (Online-Anmeldungen + Zu-/Vielleicht-Zusagen) per Mail informieren.
 * Empfänger werden sofort ermittelt (vor einem evtl. Löschen), der Versand läuft
 * nach der Antwort im Hintergrund. Gibt die Anzahl der Empfänger zurück.
 */
async function notifyParticipants(eventId: string, subject: string, body: string): Promise<number> {
  const recipients = await listEventParticipantRecipients(eventId);
  if (recipients.length === 0) return 0;
  after(async () => {
    try {
      await sendBulkMail({ recipients, subject, body });
    } catch {
      // Mailversand fehlgeschlagen — Änderung ist trotzdem gespeichert.
    }
  });
  return recipients.length;
}

function parseEventForm(formData: FormData): EventValues {
  const title = String(formData.get('title') ?? '').trim();
  const kindRaw = String(formData.get('kind') ?? 'event');
  const kind: Kind = (EVENT_KIND_VALUES as string[]).includes(kindRaw) ? (kindRaw as Kind) : 'event';
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

  // Preis (optional), Eingabe in Euro mit Komma oder Punkt.
  const priceRaw = String(formData.get('priceEuros') ?? '').trim().replace(',', '.');
  const priceParsed = Number.parseFloat(priceRaw);
  const priceCents = priceRaw && !Number.isNaN(priceParsed) && priceParsed >= 0 ? Math.round(priceParsed * 100) : null;

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
    priceCents,
    forKids: formData.get('forKids') === 'on',
  };
}

/**
 * Verschickt eine Termin-Info per Rundmail an alle Mitglieder (best effort).
 * Gibt den Sende-Zeitpunkt und die Anzahl erreichter Empfänger zurück
 * (count = 0 / at = null, wenn nichts versendet wurde).
 */
async function notifyMembersOfEvent(values: EventValues): Promise<{ at: Date | null; count: number }> {
  try {
    const recipients = await resolveRecipients({
      audience: 'all',
      teamId: null,
      category: null,
      memberIds: [],
    });
    if (recipients.length === 0) return { at: null, count: 0 };
    const body = [
      `Neuer Termin beim TSV Schloss Treffen:`,
      ``,
      `${values.title}`,
      `${formatGermanDate(values.startsAt)}`,
      values.location ? `Ort: ${values.location}` : ``,
      values.description ? `\n${values.description}` : ``,
      ``,
      `Details & Kalendereintrag auf www.tsv-treffen.at.`,
    ]
      .filter((l) => l !== ``)
      .join('\n');
    const res = await sendBulkMail({ recipients, subject: `Neuer Termin: ${values.title}`, body });
    return { at: new Date(), count: res.sent };
  } catch {
    // Termin ist gespeichert, Mailversand egal.
    return { at: null, count: 0 };
  }
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
  let notified: { at: Date | null; count: number } = { at: null, count: 0 };
  const notify = formData.get('notifyMembers') === 'on';
  try {
    const values = parseEventForm(formData);
    const file = formData.get('attachment');
    const up = await uploadPublicFile(file instanceof File ? file : null, 'events');

    // Mitglieder über den neuen Termin informieren (best effort, nur wenn angehakt).
    if (notify) notified = await notifyMembersOfEvent(values);

    await db.insert(events).values({
      ...values,
      attachmentUrl: up?.url ?? null,
      attachmentName: up?.name ?? null,
      notifiedAt: notified.at,
      notifiedCount: notified.count,
    });
  } catch (e) {
    redirect(`/admin/veranstaltungen/neu?error=${encodeURIComponent(errMsg(e))}`);
  }
  revalidateEventViews();
  redirect(notify ? `/admin/veranstaltungen?notified=${notified.count}` : '/admin/veranstaltungen');
}

export async function updateEvent(formData: FormData) {
  const id = String(formData.get('id') ?? '').trim();
  if (!id) throw new Error('Datensatz-ID fehlt.');
  let notified: { at: Date | null; count: number } = { at: null, count: 0 };
  let informed = -1; // -1 = Teilnehmer-Info nicht angefordert
  const notify = formData.get('notifyMembers') === 'on';
  const informParticipants = formData.get('notifyParticipants') === 'on';
  try {
    const values = parseEventForm(formData);
    const before = await getEvent(id);
    const file = formData.get('attachment');
    const up = await uploadPublicFile(file instanceof File ? file : null, 'events');
    const currentUrl = String(formData.get('currentAttachmentUrl') ?? '').trim() || null;
    const currentName = String(formData.get('currentAttachmentName') ?? '').trim() || null;

    // Erneut benachrichtigen (best effort, nur wenn angehakt) — z. B. nach Änderungen.
    if (notify) notified = await notifyMembersOfEvent(values);

    await db
      .update(events)
      .set({
        ...values,
        attachmentUrl: up?.url ?? currentUrl,
        attachmentName: up?.name ?? currentName,
        // Versand-Info nur überschreiben, wenn tatsächlich (erneut) versendet wurde.
        ...(notified.at ? { notifiedAt: notified.at, notifiedCount: notified.count } : {}),
      })
      .where(eq(events.id, id));

    // Teilnehmer über Änderung/Verschiebung informieren.
    if (informParticipants) {
      const moved =
        before != null &&
        (before.startsAt.getTime() !== values.startsAt.getTime() ||
          (before.endsAt?.getTime() ?? null) !== (values.endsAt?.getTime() ?? null));
      const note = String(formData.get('changeNote') ?? '').trim();
      const body = [
        `Hallo,`,
        ``,
        moved
          ? `der Termin „${values.title}" beim TSV Schloss Treffen wurde verschoben.`
          : `es gibt eine Änderung beim Termin „${values.title}" des TSV Schloss Treffen.`,
        ``,
        moved && before ? `Bisher: ${timeText(before.startsAt, before.endsAt, before.allDay)}` : ``,
        `${moved ? 'Neu' : 'Termin'}: ${timeText(values.startsAt, values.endsAt, values.allDay)}`,
        values.location ? `Ort: ${values.location}` : ``,
        note ? `\n${note}` : ``,
        ``,
        `Alle Details: https://www.tsv-treffen.at/veranstaltung/${id}`,
        ``,
        `Sportliche Grüße`,
        `TSV Schloss Treffen`,
      ]
        .filter((l) => l !== ``)
        .join('\n');
      informed = await notifyParticipants(
        id,
        `${moved ? 'Verschoben' : 'Änderung'}: ${values.title}`,
        body,
      );
    }
  } catch (e) {
    redirect(`/admin/veranstaltungen/${id}?error=${encodeURIComponent(errMsg(e))}`);
  }
  revalidateEventViews();
  revalidatePath(`/veranstaltung/${id}`);
  const params = new URLSearchParams();
  if (notify) params.set('notified', String(notified.count));
  if (informed >= 0) params.set('informed', String(informed));
  const qs = params.toString();
  redirect(`/admin/veranstaltungen${qs ? `?${qs}` : ''}`);
}

export async function deleteEvent(formData: FormData) {
  const id = String(formData.get('id') ?? '').trim();
  if (!id) throw new Error('Datensatz-ID fehlt.');
  let informed = -1;
  // Teilnehmer VOR dem Löschen ermitteln (Anmeldungen werden mitgelöscht).
  if (formData.get('notifyParticipants') === 'on') {
    const ev = await getEvent(id);
    if (ev) {
      const note = String(formData.get('cancelNote') ?? '').trim();
      const body = [
        `Hallo,`,
        ``,
        `leider müssen wir den Termin „${ev.title}" am ${timeText(ev.startsAt, ev.endsAt, ev.allDay)} absagen.`,
        note ? `\n${note}` : ``,
        ``,
        `Bei Fragen erreichst du uns unter office@tsv-treffen.at.`,
        ``,
        `Sportliche Grüße`,
        `TSV Schloss Treffen`,
      ]
        .filter((l) => l !== ``)
        .join('\n');
      informed = await notifyParticipants(id, `Abgesagt: ${ev.title}`, body);
    }
  }
  await db.delete(events).where(eq(events.id, id));
  revalidateEventViews();
  redirect(informed >= 0 ? `/admin/veranstaltungen?cancelled=${informed}` : '/admin/veranstaltungen');
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
  const street = String(formData.get('street') ?? '').trim();
  const postalCode = String(formData.get('postalCode') ?? '').trim();
  const city = String(formData.get('city') ?? '').trim();
  const birthdate = String(formData.get('birthdate') ?? '').trim() || null;
  const message = String(formData.get('message') ?? '').trim() || null;
  const partRaw = Number.parseInt(String(formData.get('participants') ?? '1'), 10);
  const participants = Number.isNaN(partRaw) || partRaw < 1 ? 1 : partRaw;

  if (!name) back('Bitte einen Namen angeben.');
  if (!EMAIL_RE.test(email)) back('Bitte eine gültige E-Mail-Adresse angeben.');
  if (!phone) back('Bitte eine Telefonnummer angeben.');
  if (!street || !postalCode || !city) back('Bitte die vollständige Adresse angeben.');
  if (formData.get('privacyConsent') !== 'on') back('Bitte der Datenschutzerklärung zustimmen.');

  const ev = event!;
  if (ev.maxAttendees != null) {
    const taken = await countEventParticipants(eventId);
    if (taken + participants > ev.maxAttendees) {
      back(`Nicht genug freie Plätze — es sind noch ${Math.max(0, ev.maxAttendees - taken)} frei.`);
    }
  }

  await db
    .insert(eventRegistrations)
    .values({ eventId, name, email, phone, street, postalCode, city, birthdate, participants, message });
  revalidateEventViews();
  revalidatePath(`/veranstaltung/${eventId}`);

  // Mail an den Verein erst NACH der Antwort verschicken — die Bestätigung
  // erscheint sofort, statt auf den SMTP-Server zu warten.
  const body = [
    `Neue Anmeldung zur Veranstaltung „${ev.title}":`,
    ``,
    `Name: ${name}`,
    `E-Mail: ${email}`,
    phone ? `Telefon: ${phone}` : ``,
    `Adresse: ${street}, ${postalCode} ${city}`,
    birthdate ? `Geburtsdatum: ${birthdate}` : ``,
    `Teilnehmer: ${participants}`,
    message ? `\nNachricht:\n${message}` : ``,
    ``,
    `Alle Anmeldungen im Adminbereich unter Veranstaltungen.`,
  ]
    .filter((l) => l !== ``)
    .join('\n');
  after(async () => {
    try {
      await sendNotificationMail({ subject: `Anmeldung: ${ev.title}`, body, replyTo: email });
    } catch {
      // Anmeldung ist gespeichert, Mailversand egal.
    }
  });

  redirect(`/veranstaltung/${eventId}?angemeldet=1`);
}
