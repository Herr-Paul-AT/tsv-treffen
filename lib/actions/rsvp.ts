'use server';

import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { attendances } from '@/lib/db/schema';
import { requireCurrentMember } from '@/lib/db/queries/session';

export type RsvpStatus = 'yes' | 'maybe' | 'no';

export async function setRsvp(trainingId: string, status: RsvpStatus | 'none') {
  const me = await requireCurrentMember();
  if (status === 'none') {
    await db
      .delete(attendances)
      .where(and(eq(attendances.trainingId, trainingId), eq(attendances.memberId, me.id)));
  } else {
    const existing = await db
      .select()
      .from(attendances)
      .where(and(eq(attendances.trainingId, trainingId), eq(attendances.memberId, me.id)))
      .limit(1);
    if (existing[0]) {
      await db
        .update(attendances)
        .set({ status, respondedAt: new Date() })
        .where(and(eq(attendances.trainingId, trainingId), eq(attendances.memberId, me.id)));
    } else {
      await db.insert(attendances).values({
        trainingId,
        memberId: me.id,
        status,
        respondedAt: new Date(),
      });
    }
  }
  revalidatePath('/app/dashboard');
  revalidatePath(`/app/trainings/${trainingId}`);
  revalidatePath('/app/kalender');
}
