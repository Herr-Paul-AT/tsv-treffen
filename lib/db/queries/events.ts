import { and, asc, desc, eq, gte, lte } from 'drizzle-orm';
import { db } from '@/lib/db';
import {
  events,
  eventRegistrations,
  eventRsvps,
  type Event,
  type EventRegistration,
} from '@/lib/db/schema';

export type RsvpStatus = 'yes' | 'maybe' | 'no';

/** RSVP-Status eines Mitglieds je Veranstaltung als Map (eventId → status). */
export async function getMemberEventRsvps(memberId: string): Promise<Map<string, RsvpStatus>> {
  const rows = await db
    .select({ eventId: eventRsvps.eventId, status: eventRsvps.status })
    .from(eventRsvps)
    .where(eq(eventRsvps.memberId, memberId));
  const map = new Map<string, RsvpStatus>();
  for (const r of rows) map.set(r.eventId, r.status as RsvpStatus);
  return map;
}

/** Anzahl Zusagen (yes) je Veranstaltung. */
export async function countEventYes(eventId: string): Promise<number> {
  const rows = await db
    .select({ id: eventRsvps.memberId })
    .from(eventRsvps)
    .where(and(eq(eventRsvps.eventId, eventId), eq(eventRsvps.status, 'yes')));
  return rows.length;
}

export async function listEventRegistrations(eventId: string): Promise<EventRegistration[]> {
  return db
    .select()
    .from(eventRegistrations)
    .where(eq(eventRegistrations.eventId, eventId))
    .orderBy(desc(eventRegistrations.createdAt));
}

/** Summe der angemeldeten Teilnehmer (participants) für eine Veranstaltung. */
export async function countEventParticipants(eventId: string): Promise<number> {
  const rows = await db
    .select({ participants: eventRegistrations.participants })
    .from(eventRegistrations)
    .where(eq(eventRegistrations.eventId, eventId));
  return rows.reduce((sum, r) => sum + (r.participants ?? 1), 0);
}

export async function listEvents(limit = 20): Promise<Event[]> {
  return db.select().from(events).orderBy(asc(events.startsAt)).limit(limit);
}

/** Alle Veranstaltungen für die Admin-Verwaltung — kommende zuerst, dann vergangene. */
export async function listAllEvents(): Promise<Event[]> {
  return db.select().from(events).orderBy(desc(events.startsAt));
}

export async function getEvent(id: string): Promise<Event | null> {
  const rows = await db.select().from(events).where(eq(events.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function listUpcomingEvents(limit = 12): Promise<Event[]> {
  return db
    .select()
    .from(events)
    .where(gte(events.startsAt, new Date()))
    .orderBy(asc(events.startsAt))
    .limit(limit);
}

export async function listEventsInRange(from: Date, to: Date): Promise<Event[]> {
  return db
    .select()
    .from(events)
    .where(and(gte(events.startsAt, from), lte(events.startsAt, to)))
    .orderBy(asc(events.startsAt));
}
