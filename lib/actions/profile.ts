'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { members } from '@/lib/db/schema';
import { getCurrentMember } from '@/lib/db/queries/session';
import { initialsFor } from '@/lib/members-csv';

/**
 * Mitglied bearbeitet das EIGENE Profil. Bewusst nur sichere Felder —
 * Rolle, Status und Beitragsdaten bleiben dem Adminbereich vorbehalten.
 * Die Mitglieds-ID kommt aus der Session, nicht aus dem Formular.
 */
export async function updateOwnProfile(formData: FormData) {
  const me = await getCurrentMember();
  if (!me) throw new Error('Kein angemeldetes Mitglied.');

  const firstName = String(formData.get('firstName') ?? '').trim();
  const lastName = String(formData.get('lastName') ?? '').trim();
  if (!firstName) throw new Error('Vorname ist erforderlich.');
  if (!lastName) throw new Error('Nachname ist erforderlich.');

  const email = String(formData.get('email') ?? '').trim().toLowerCase() || null;
  const phone = String(formData.get('phone') ?? '').trim() || null;
  const street = String(formData.get('street') ?? '').trim() || null;
  const postalCode = String(formData.get('postalCode') ?? '').trim() || null;
  const city = String(formData.get('city') ?? '').trim() || null;
  const birthdate = String(formData.get('birthdate') ?? '').trim() || null;

  await db
    .update(members)
    .set({
      firstName,
      lastName,
      initials: initialsFor(firstName, lastName),
      email,
      phone,
      street,
      postalCode,
      city,
      birthdate,
      updatedAt: new Date(),
    })
    .where(eq(members.id, me.id));

  revalidatePath('/app/profil');
  revalidatePath('/app/dashboard');
  redirect('/app/profil');
}
