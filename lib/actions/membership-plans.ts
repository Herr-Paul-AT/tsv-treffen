'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { membershipPlans } from '@/lib/db/schema';
import { MEMBER_CATEGORY_VALUES } from '@/lib/member-categories';

type PlanValues = {
  slug: string;
  name: string;
  eyebrow: string | null;
  category: (typeof MEMBER_CATEGORY_VALUES)[number] | null;
  priceCents: number;
  period: string;
  perks: string;
  featured: boolean;
  active: boolean;
  sortOrder: number;
};

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Preis-Eingabe (Euro, z. B. "280" oder "280,50") → Cent. */
function parsePriceToCents(raw: string): number {
  const cleaned = raw.replace(/[^0-9.,]/g, '').replace(',', '.');
  const euros = Number.parseFloat(cleaned);
  if (Number.isNaN(euros) || euros < 0) return 0;
  return Math.round(euros * 100);
}

function parsePlanForm(formData: FormData): PlanValues {
  const name = String(formData.get('name') ?? '').trim();
  const slugRaw = String(formData.get('slug') ?? '').trim();
  const eyebrow = String(formData.get('eyebrow') ?? '').trim();
  const priceRaw = String(formData.get('price') ?? '').trim();
  const period = String(formData.get('period') ?? '').trim() || 'Saison';
  // Textarea: eine Leistung pro Zeile — Leerzeilen entfernen, wieder zusammenfügen.
  const perks = String(formData.get('perks') ?? '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .join('\n');
  const featured = formData.get('featured') === 'on';
  const active = formData.get('active') === 'on';
  const sortOrderRaw = String(formData.get('sortOrder') ?? '').trim();

  if (!name) throw new Error('Name ist erforderlich.');

  const slug = slugRaw ? slugify(slugRaw) : slugify(name);
  if (!slug) throw new Error('Aus dem Namen ließ sich kein gültiger Slug bilden — bitte Slug manuell angeben.');

  const sortOrder = Number.parseInt(sortOrderRaw, 10);

  const categoryRaw = String(formData.get('category') ?? '').trim();
  const category = (MEMBER_CATEGORY_VALUES as string[]).includes(categoryRaw)
    ? (categoryRaw as (typeof MEMBER_CATEGORY_VALUES)[number])
    : null;

  return {
    slug,
    name,
    eyebrow: eyebrow || null,
    category,
    priceCents: parsePriceToCents(priceRaw),
    period,
    perks,
    featured,
    active,
    sortOrder: Number.isNaN(sortOrder) ? 0 : sortOrder,
  };
}

function revalidatePlanViews() {
  revalidatePath('/admin/tarife');
  revalidatePath('/admin');
  revalidatePath('/');
}

export async function createMembershipPlan(formData: FormData) {
  const values = parsePlanForm(formData);
  await db.insert(membershipPlans).values(values);
  revalidatePlanViews();
  redirect('/admin/tarife');
}

export async function updateMembershipPlan(formData: FormData) {
  const id = String(formData.get('id') ?? '').trim();
  if (!id) throw new Error('Datensatz-ID fehlt.');
  const values = parsePlanForm(formData);
  await db
    .update(membershipPlans)
    .set({ ...values, updatedAt: new Date() })
    .where(eq(membershipPlans.id, id));
  revalidatePlanViews();
  redirect('/admin/tarife');
}

export async function deleteMembershipPlan(formData: FormData) {
  const id = String(formData.get('id') ?? '').trim();
  if (!id) throw new Error('Datensatz-ID fehlt.');
  await db.delete(membershipPlans).where(eq(membershipPlans.id, id));
  revalidatePlanViews();
  redirect('/admin/tarife');
}
