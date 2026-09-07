import { asc, desc, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { galleryImages, type GalleryImage } from '@/lib/db/schema';

/** Bilder für die öffentliche Galerie (nur aktive, nach Reihenfolge). */
export async function listActiveGalleryImages(): Promise<GalleryImage[]> {
  return db
    .select()
    .from(galleryImages)
    .where(eq(galleryImages.active, true))
    .orderBy(asc(galleryImages.sortOrder), desc(galleryImages.createdAt));
}

/** Alle Bilder für die Admin-Verwaltung. */
export async function listAllGalleryImages(): Promise<GalleryImage[]> {
  return db
    .select()
    .from(galleryImages)
    .orderBy(asc(galleryImages.sortOrder), desc(galleryImages.createdAt));
}
