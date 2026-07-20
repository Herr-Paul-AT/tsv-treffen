'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { membershipRequests } from '@/lib/db/schema';
import { MEMBER_CATEGORY_VALUES } from '@/lib/member-categories';
import { memberCategoryLabel } from '@/lib/member-categories';
import { sendNotificationMail } from '@/lib/mailer';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function req(formData: FormData, key: string, label: string): string {
  const v = String(formData.get(key) ?? '').trim();
  if (!v) throw new Error(`${label} ist erforderlich.`);
  return v;
}

/** Öffentliche Selbst-Anmeldung von der Startseite. */
export async function submitMembershipRequest(formData: FormData) {
  const firstName = req(formData, 'firstName', 'Vorname');
  const lastName = req(formData, 'lastName', 'Nachname');
  const email = req(formData, 'email', 'E-Mail').toLowerCase();
  const phone = req(formData, 'phone', 'Telefonnummer');
  const street = req(formData, 'street', 'Adresse');
  const postalCode = req(formData, 'postalCode', 'PLZ');
  const city = req(formData, 'city', 'Ort');

  if (!EMAIL_RE.test(email)) throw new Error('Bitte eine gültige E-Mail-Adresse angeben.');

  const categoryRaw = String(formData.get('category') ?? '').trim();
  const category = (MEMBER_CATEGORY_VALUES as string[]).includes(categoryRaw)
    ? (categoryRaw as (typeof MEMBER_CATEGORY_VALUES)[number])
    : null;

  const isSponsor = formData.get('isSponsor') === 'on';
  const sponsorNote = String(formData.get('sponsorNote') ?? '').trim() || null;
  const planSlug = String(formData.get('planSlug') ?? '').trim() || null;
  const planName = String(formData.get('planName') ?? '').trim() || null;
  const message = String(formData.get('message') ?? '').trim() || null;

  await db.insert(membershipRequests).values({
    firstName,
    lastName,
    email,
    phone,
    street,
    postalCode,
    city,
    category,
    planSlug,
    planName,
    isSponsor,
    sponsorNote: isSponsor ? sponsorNote : null,
    message,
  });

  revalidatePath('/admin/anmeldungen');
  revalidatePath('/admin');

  // Benachrichtigung an den Verein (best effort — Anmeldung ist bereits gespeichert).
  try {
    const lines = [
      `Neue Beitritts-Anmeldung über die Website:`,
      ``,
      `Name: ${firstName} ${lastName}`,
      `E-Mail: ${email}`,
      `Telefon: ${phone}`,
      `Adresse: ${street}, ${postalCode} ${city}`,
      `Kategorie: ${memberCategoryLabel(category)}`,
      planName ? `Gewähltes Paket: ${planName}` : ``,
      isSponsor ? `Sponsor: ja${sponsorNote ? ` — ${sponsorNote}` : ''}` : `Sponsor: nein`,
      message ? `\nNachricht:\n${message}` : ``,
      ``,
      `Zum Bearbeiten im Adminbereich unter „Anmeldungen".`,
    ].filter((l) => l !== ``).join('\n');
    await sendNotificationMail({
      subject: `Neue Anmeldung: ${firstName} ${lastName}`,
      body: lines,
      replyTo: email,
    });
  } catch {
    // Mailversand fehlgeschlagen — Anmeldung bleibt gespeichert und im Admin sichtbar.
  }

  redirect('/mitglied-werden/danke');
}

/** Anmeldung als erledigt/abgelehnt markieren (Admin). */
export async function setMembershipRequestStatus(formData: FormData) {
  const id = String(formData.get('id') ?? '').trim();
  const status = String(formData.get('status') ?? '').trim();
  if (!id) throw new Error('Datensatz-ID fehlt.');
  if (status !== 'new' && status !== 'handled' && status !== 'rejected') {
    throw new Error('Ungültiger Status.');
  }
  await db
    .update(membershipRequests)
    .set({ status, handledAt: status === 'new' ? null : new Date() })
    .where(eq(membershipRequests.id, id));
  revalidatePath('/admin/anmeldungen');
  revalidatePath('/admin');
}
