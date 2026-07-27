import { asc, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { contacts, type Contact } from '@/lib/db/schema';

export async function listActiveContacts(): Promise<Contact[]> {
  return db.select().from(contacts).where(eq(contacts.active, true)).orderBy(asc(contacts.sortOrder));
}

export async function listAllContacts(): Promise<Contact[]> {
  return db.select().from(contacts).orderBy(asc(contacts.sortOrder));
}

export async function getContact(id: string): Promise<Contact | undefined> {
  const rows = await db.select().from(contacts).where(eq(contacts.id, id)).limit(1);
  return rows[0];
}
