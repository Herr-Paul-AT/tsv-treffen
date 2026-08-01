'use server';

import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { eventRsvps } from '@/lib/db/schema';
import { requireCurrentMember } from '@/lib/db/queries/session';

export type EventRsvpStatus = 'yes' | 'maybe' | 'no';

export async function setEventRsvp(eventId: string, status: EventRsvpStatus | 'none') {
  const me = await requireCurrentMember();
  const where = and(eq(eventRsvps.eventId, eventId), eq(eventRsvps.memberId, me.id));

  if (status === 'none') {
    await db.delete(eventRsvps).where(where);
  } else {
    const existing = await db.select().from(eventRsvps).where(where).limit(1);
    if (existing[0]) {
      await db.update(eventRsvps).set({ status, respondedAt: new Date() }).where(where);
    } else {
      await db.insert(eventRsvps).values({ eventId, memberId: me.id, status, respondedAt: new Date() });
    }
  }
  revalidatePath('/app/veranstaltungen');
  revalidatePath('/app/dashboard');
}
