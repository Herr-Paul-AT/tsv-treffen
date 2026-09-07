'use server';

import { eq, ne, inArray } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { members } from '@/lib/db/schema';
import { isMailConfigured, sendDuesReminder } from '@/lib/mailer';

function revalidateDuesViews() {
  revalidatePath('/admin/beitraege');
  revalidatePath('/admin/mitglieder');
  revalidatePath('/admin');
  revalidatePath('/app/beitragskonto');
}

/**
 * Verschickt Zahlungserinnerungen an alle Mitglieder mit offenem/anteiligem
 * Beitrag und hinterlegter E-Mail. Best effort — merkt sich den Sende-Zeitpunkt.
 */
export async function sendDuesReminders() {
  if (!isMailConfigured()) {
    redirect('/admin/beitraege?mailoff=1');
  }

  const open = await db
    .select({
      id: members.id,
      firstName: members.firstName,
      email: members.email,
      paymentDueCents: members.paymentDueCents,
    })
    .from(members)
    .where(inArray(members.paymentStatus, ['open', 'partial']));

  const withMail = open.filter((m) => m.email);
  const withoutMail = open.length - withMail.length;

  let sent = 0;
  const remindedIds: string[] = [];
  for (const m of withMail) {
    try {
      await sendDuesReminder({
        to: m.email!,
        firstName: m.firstName,
        amountCents: m.paymentDueCents,
      });
      sent++;
      remindedIds.push(m.id);
    } catch {
      // Einzelner Versand fehlgeschlagen — Rest trotzdem versuchen.
    }
  }

  if (remindedIds.length > 0) {
    await db
      .update(members)
      .set({ paymentRemindedAt: new Date() })
      .where(inArray(members.id, remindedIds));
  }

  revalidateDuesViews();
  redirect(`/admin/beitraege?reminded=${sent}&nomail=${withoutMail}`);
}

/**
 * Jahres-Reset: setzt alle Beiträge (außer „erlassen"/Ehrenmitglieder) wieder auf
 * „offen" und löscht den Mahn-Zeitpunkt. Danach läuft der manuelle Abgleich neu.
 */
export async function resetDuesStatus() {
  const res = await db
    .update(members)
    .set({ paymentStatus: 'open', paymentRemindedAt: null, updatedAt: new Date() })
    .where(ne(members.paymentStatus, 'waived'))
    .returning();

  revalidateDuesViews();
  redirect(`/admin/beitraege?reset=${res.length}`);
}
