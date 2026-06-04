import { asc, desc, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { documents, type Document } from '@/lib/db/schema';

export type DocumentCategory = Document['category'];

export const DOC_CATEGORY_LABEL: Record<DocumentCategory, string> = {
  statuten: 'Statuten',
  beitraege: 'Beiträge',
  protokoll: 'Protokolle',
  spielregeln: 'Spielregeln',
  formular: 'Formulare',
  sonstiges: 'Sonstiges',
};

export async function listDocuments(): Promise<Document[]> {
  return db.select().from(documents).orderBy(desc(documents.pinned), asc(documents.title));
}

export async function listDocumentsByCategory(): Promise<Record<DocumentCategory, Document[]>> {
  const all = await listDocuments();
  const grouped: Record<DocumentCategory, Document[]> = {
    statuten: [], beitraege: [], protokoll: [], spielregeln: [], formular: [], sonstiges: [],
  };
  for (const d of all) grouped[d.category].push(d);
  return grouped;
}

export async function getDocumentById(id: string): Promise<Document | null> {
  const rows = await db.select().from(documents).where(eq(documents.id, id)).limit(1);
  return rows[0] ?? null;
}
