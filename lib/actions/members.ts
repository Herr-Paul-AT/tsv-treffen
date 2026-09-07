'use server';

import { eq, inArray } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { members } from '@/lib/db/schema';
import { getExistingEmails } from '@/lib/db/queries/members';
import { initialsFor, parseMembersCsv, toneFor } from '@/lib/members-csv';
import { MEMBER_CATEGORY_VALUES, memberCategoryLabel } from '@/lib/member-categories';
import { sendMemberWelcome } from '@/lib/mailer';

const ROLES = ['member', 'trainer', 'jugendleiter', 'obmann', 'admin'] as const;
const STATUSES = ['active', 'probe', 'paused', 'inactive'] as const;
const PAYMENTS = ['paid', 'open', 'partial', 'waived'] as const;

type Role = (typeof ROLES)[number];
type Status = (typeof STATUSES)[number];
type Payment = (typeof PAYMENTS)[number];

function pick<T extends readonly string[]>(list: T, raw: string, fallback: T[number]): T[number] {
  return (list as readonly string[]).includes(raw) ? (raw as T[number]) : fallback;
}

function eurosToCents(raw: string): number {
  const n = parseFloat(raw.replace(',', '.'));
  if (Number.isNaN(n) || n < 0) return 0;
  return Math.round(n * 100);
}

function parseMemberForm(formData: FormData) {
  const firstName = String(formData.get('firstName') ?? '').trim();
  const lastName = String(formData.get('lastName') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const phone = String(formData.get('phone') ?? '').trim();
  const birthRaw = String(formData.get('birthdate') ?? '').trim();
  if (!firstName) throw new Error('Vorname ist erforderlich.');
  if (!lastName) throw new Error('Nachname ist erforderlich.');
  if (!phone) throw new Error('Telefonnummer ist erforderlich.');
  if (!birthRaw) throw new Error('Geburtsdatum ist erforderlich.');

  const role = pick(ROLES, String(formData.get('role') ?? ''), 'member') as Role;
  const status = pick(STATUSES, String(formData.get('status') ?? ''), 'active') as Status;
  const paymentStatus = pick(PAYMENTS, String(formData.get('paymentStatus') ?? ''), 'paid') as Payment;

  const categoryRaw = String(formData.get('category') ?? '').trim();
  const category = (MEMBER_CATEGORY_VALUES as string[]).includes(categoryRaw)
    ? (categoryRaw as (typeof MEMBER_CATEGORY_VALUES)[number])
    : null;
  const isSponsor = formData.get('isSponsor') === 'on';
  const sponsorNote = String(formData.get('sponsorNote') ?? '').trim();

  const lkRaw = String(formData.get('lkRating') ?? '').trim();
  const lkRating = lkRaw && /^\d+(\.\d+)?$/.test(lkRaw) ? lkRaw : null;

  const memberSinceRaw = String(formData.get('memberSince') ?? '').trim();

  const photoConsent = formData.get('photoConsent') === 'on';
  const photoConsentHomepage = photoConsent && formData.get('photoConsentHomepage') === 'on';

  return {
    firstName,
    lastName,
    email: email || null,
    initials: initialsFor(firstName, lastName),
    avatarTone: toneFor(email || `${firstName} ${lastName}`),
    role,
    status,
    category,
    isSponsor,
    sponsorNote: isSponsor ? sponsorNote || null : null,
    paymentStatus,
    paymentDueCents: eurosToCents(String(formData.get('paymentDueEuros') ?? '0')),
    lkRating,
    birthdate: birthRaw || null,
    memberSince: memberSinceRaw || undefined,
    phone: phone || null,
    street: String(formData.get('street') ?? '').trim() || null,
    postalCode: String(formData.get('postalCode') ?? '').trim() || null,
    city: String(formData.get('city') ?? '').trim() || null,
    clothingSize: String(formData.get('clothingSize') ?? '').trim() || null,
    photoConsent,
    photoConsentHomepage,
    // Datenschutz-Zustimmung als Roh-Flag; der Zeitstempel wird in create/update gesetzt.
    privacyConsent: formData.get('privacyConsent') === 'on',
    notes: String(formData.get('notes') ?? '').trim() || null,
  };
}

function revalidateMemberViews() {
  revalidatePath('/admin/mitglieder');
  revalidatePath('/admin');
  revalidatePath('/app/profil');
}

export async function createMember(formData: FormData) {
  const { privacyConsent, ...values } = parseMemberForm(formData);
  // Dublette bewusst KEINE Sperre mehr: Familienmitglieder dürfen dieselbe
  // E-Mail teilen. (Dubletten werden anderswo nur als Hinweis angezeigt.)
  await db.insert(members).values({
    ...values,
    privacyConsentAt: privacyConsent ? new Date() : null,
    updatedAt: new Date(),
  });

  // Willkommens-Mail ans neue Mitglied (best effort; nur wenn angehakt + E-Mail vorhanden).
  if (values.email && formData.get('sendWelcome') === 'on') {
    try {
      await sendMemberWelcome({
        to: values.email,
        firstName: values.firstName,
        packageLabel: values.category ? memberCategoryLabel(values.category) : null,
      });
    } catch {
      // Mailversand fehlgeschlagen — Mitglied ist trotzdem angelegt.
    }
  }

  revalidateMemberViews();
  redirect('/admin/mitglieder');
}

/**
 * Legt mehrere Familienmitglieder in einem Zug an (gemeinsame Adresse/Kontakt).
 * Personen kommen als parallele Arrays (firstName[]/lastName[]/category[]/birthdate[]).
 */
export async function createFamily(formData: FormData) {
  const firstNames = formData.getAll('firstName').map((v) => String(v).trim());
  const lastNames = formData.getAll('lastName').map((v) => String(v).trim());
  const categories = formData.getAll('category').map((v) => String(v).trim());
  const birthdates = formData.getAll('birthdate').map((v) => String(v).trim());

  const email = String(formData.get('email') ?? '').trim().toLowerCase() || null;
  const phone = String(formData.get('phone') ?? '').trim() || null;
  const street = String(formData.get('street') ?? '').trim() || null;
  const postalCode = String(formData.get('postalCode') ?? '').trim() || null;
  const city = String(formData.get('city') ?? '').trim() || null;

  const privacyConsentAt = formData.get('privacyConsent') === 'on' ? new Date() : null;
  const photoConsent = formData.get('photoConsent') === 'on';
  const photoConsentHomepage = photoConsent && formData.get('photoConsentHomepage') === 'on';

  const back = (msg: string): never =>
    redirect(`/admin/mitglieder/familie?error=${encodeURIComponent(msg)}`);

  const rows: (typeof members.$inferInsert)[] = [];
  for (let i = 0; i < firstNames.length; i++) {
    const firstName = firstNames[i];
    const lastName = lastNames[i] ?? '';
    if (!firstName && !lastName) continue; // leere Zeile überspringen
    if (!firstName || !lastName) back(`Bitte Vor- und Nachname für alle Personen angeben.`);
    const categoryRaw = categories[i] ?? '';
    const category = (MEMBER_CATEGORY_VALUES as string[]).includes(categoryRaw)
      ? (categoryRaw as (typeof MEMBER_CATEGORY_VALUES)[number])
      : null;
    rows.push({
      firstName,
      lastName,
      email,
      initials: initialsFor(firstName, lastName),
      avatarTone: toneFor(`${firstName} ${lastName}`),
      category,
      birthdate: birthdates[i] || null,
      phone,
      street,
      postalCode,
      city,
      privacyConsentAt,
      photoConsent,
      photoConsentHomepage,
      updatedAt: new Date(),
    });
  }

  if (rows.length === 0) back('Bitte mindestens eine Person angeben.');
  await db.insert(members).values(rows);

  // Eine Willkommens-Mail an die gemeinsame Kontaktadresse (best effort).
  if (email && formData.get('sendWelcome') === 'on') {
    try {
      await sendMemberWelcome({ to: email, firstName: rows[0].firstName });
    } catch {
      // Familie ist angelegt, Mailversand egal.
    }
  }

  revalidateMemberViews();
  redirect(`/admin/mitglieder?family=${rows.length}`);
}

export async function updateMember(formData: FormData) {
  const id = String(formData.get('id') ?? '').trim();
  if (!id) throw new Error('Mitglieds-ID fehlt.');
  const { privacyConsent, ...values } = parseMemberForm(formData);
  // Bestehenden Zustimmungs-Zeitstempel bewahren, wenn weiterhin zugestimmt.
  const existing = await db
    .select({ at: members.privacyConsentAt })
    .from(members)
    .where(eq(members.id, id))
    .limit(1);
  const privacyConsentAt = privacyConsent ? existing[0]?.at ?? new Date() : null;
  await db
    .update(members)
    .set({ ...values, privacyConsentAt, updatedAt: new Date() })
    .where(eq(members.id, id));
  revalidateMemberViews();
  redirect('/admin/mitglieder');
}

export async function deleteMember(formData: FormData) {
  const id = String(formData.get('id') ?? '').trim();
  if (!id) throw new Error('Mitglieds-ID fehlt.');
  await db.delete(members).where(eq(members.id, id));
  revalidateMemberViews();
  redirect('/admin/mitglieder');
}

/** Mehrere markierte Mitglieder auf einmal löschen. */
export async function bulkDeleteMembers(formData: FormData) {
  const ids = formData.getAll('memberIds').map((v) => String(v).trim()).filter(Boolean);
  if (ids.length > 0) {
    await db.delete(members).where(inArray(members.id, ids));
  }
  revalidateMemberViews();
  redirect(`/admin/mitglieder?deleted=${ids.length}`);
}

/** Importiert alle gültigen, noch nicht vorhandenen Zeilen aus einem CSV-Text. */
export async function importMembers(formData: FormData) {
  const csv = String(formData.get('csv') ?? '');
  const { rows } = parseMembersCsv(csv);
  const existing = await getExistingEmails();

  const seen = new Set<string>();
  const toInsert: (typeof members.$inferInsert)[] = [];
  let skippedExisting = 0;
  let skippedInvalid = 0;

  for (const r of rows) {
    if (!r.valid) {
      skippedInvalid++;
      continue;
    }
    // Dublettenprüfung nur, wenn eine E-Mail vorhanden ist (E-Mail ist optional).
    if (r.email && (existing.has(r.email) || seen.has(r.email))) {
      skippedExisting++;
      continue;
    }
    if (r.email) seen.add(r.email);
    toInsert.push({
      firstName: r.firstName,
      lastName: r.lastName,
      email: r.email,
      initials: initialsFor(r.firstName, r.lastName),
      avatarTone: toneFor(r.email || `${r.firstName} ${r.lastName}`),
      role: r.role,
      status: r.status,
      phone: r.phone,
      street: r.street,
      postalCode: r.postalCode,
      city: r.city,
      birthdate: r.birthdate,
      lkRating: r.lkRating,
      updatedAt: new Date(),
    });
  }

  if (toInsert.length > 0) {
    await db.insert(members).values(toInsert);
  }
  revalidateMemberViews();
  redirect(
    `/admin/mitglieder?imported=${toInsert.length}&dupes=${skippedExisting}&invalid=${skippedInvalid}`,
  );
}
