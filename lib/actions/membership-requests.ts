'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { members, membershipRequests } from '@/lib/db/schema';
import { getExistingEmails } from '@/lib/db/queries/members';
import { getMembershipRequest } from '@/lib/db/queries/membership-requests';
import { MEMBER_CATEGORY_VALUES } from '@/lib/member-categories';
import { memberCategoryLabel } from '@/lib/member-categories';
import { initialsFor, toneFor } from '@/lib/members-csv';
import { sendMemberWelcome, sendNotificationMail } from '@/lib/mailer';

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

/**
 * Übernimmt eine Anmeldung als echtes Mitglied (Admin).
 * Bricht ab, wenn die E-Mail bereits einem Mitglied gehört (Dublette).
 */
export async function createMemberFromRequest(formData: FormData) {
  const id = String(formData.get('id') ?? '').trim();
  if (!id) throw new Error('Datensatz-ID fehlt.');
  const sendWelcome = formData.get('sendWelcome') === 'on';

  try {
    const request = await getMembershipRequest(id);
    if (!request) throw new Error('Anmeldung nicht gefunden.');
    if (request.createdMemberId) throw new Error('Diese Anmeldung wurde bereits übernommen.');

    const email = request.email.toLowerCase();
    const existing = await getExistingEmails();
    if (existing.has(email)) {
      throw new Error(
        `Es existiert bereits ein Mitglied mit der E-Mail ${email} — mögliche Dublette. Bitte manuell abgleichen.`,
      );
    }

    const inserted = await db
      .insert(members)
      .values({
        firstName: request.firstName,
        lastName: request.lastName,
        email,
        initials: initialsFor(request.firstName, request.lastName),
        avatarTone: toneFor(email),
        status: 'active',
        category: request.category,
        isSponsor: request.isSponsor,
        sponsorNote: request.sponsorNote,
        phone: request.phone,
        street: request.street,
        postalCode: request.postalCode,
        city: request.city,
        updatedAt: new Date(),
      })
      .returning();

    const newMemberId = inserted[0]?.id;

    await db
      .update(membershipRequests)
      .set({ status: 'handled', handledAt: new Date(), createdMemberId: newMemberId ?? null })
      .where(eq(membershipRequests.id, id));

    // Willkommens-Mail (best effort) — blockiert die Übernahme NICHT.
    if (sendWelcome) {
      try {
        await sendMemberWelcome({ to: email, firstName: request.firstName });
      } catch {
        // Mitglied ist angelegt, Mailversand egal.
      }
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Übernahme fehlgeschlagen.';
    redirect(`/admin/anmeldungen?error=${encodeURIComponent(msg)}`);
  }

  revalidatePath('/admin/anmeldungen');
  revalidatePath('/admin/mitglieder');
  revalidatePath('/admin');
  redirect('/admin/anmeldungen?converted=1');
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
