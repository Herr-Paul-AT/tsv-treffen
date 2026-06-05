'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { newsletters } from '@/lib/db/schema';
import { getCurrentMember } from '@/lib/db/queries/session';
import { getNewsletter, getRecipientCount, resolveRecipients } from '@/lib/db/queries/newsletters';
import { isMailConfigured, sendBulkMail } from '@/lib/mailer';

const AUDIENCES = ['all', 'active', 'probe', 'team', 'custom'] as const;
type Audience = (typeof AUDIENCES)[number];

function parseForm(formData: FormData) {
  const subject = String(formData.get('subject') ?? '').trim();
  const body = String(formData.get('body') ?? '').trim();
  if (!subject) throw new Error('Betreff ist erforderlich.');
  if (!body) throw new Error('Inhalt ist erforderlich.');

  const audRaw = String(formData.get('audience') ?? 'active');
  const audience: Audience = (AUDIENCES as readonly string[]).includes(audRaw)
    ? (audRaw as Audience)
    : 'active';
  const audienceTeamId =
    audience === 'team' ? String(formData.get('audienceTeamId') ?? '').trim() || null : null;

  return { subject, body, audience, audienceTeamId };
}

function revalidateViews(id?: string) {
  revalidatePath('/admin/rundmail');
  revalidatePath('/admin');
  if (id) revalidatePath(`/admin/rundmail/${id}`);
}

export async function createDraft(formData: FormData) {
  const v = parseForm(formData);
  const me = await getCurrentMember();
  const recipientCount = await getRecipientCount(v.audience, v.audienceTeamId);

  await db.insert(newsletters).values({
    subject: v.subject,
    body: v.body,
    audience: v.audience,
    audienceTeamId: v.audienceTeamId,
    status: 'draft',
    authorId: me?.id ?? null,
    recipientCount,
    updatedAt: new Date(),
  });
  revalidateViews();
  redirect('/admin/rundmail');
}

export async function updateDraft(formData: FormData) {
  const id = String(formData.get('id') ?? '').trim();
  if (!id) throw new Error('Rundmail-ID fehlt.');
  const v = parseForm(formData);
  const recipientCount = await getRecipientCount(v.audience, v.audienceTeamId);

  await db
    .update(newsletters)
    .set({
      subject: v.subject,
      body: v.body,
      audience: v.audience,
      audienceTeamId: v.audienceTeamId,
      recipientCount,
      updatedAt: new Date(),
    })
    .where(eq(newsletters.id, id));
  revalidateViews(id);
  redirect('/admin/rundmail');
}

export async function sendNewsletter(formData: FormData) {
  const id = String(formData.get('id') ?? '').trim();
  if (!id) throw new Error('Rundmail-ID fehlt.');
  if (!isMailConfigured()) throw new Error('SMTP ist nicht konfiguriert — bitte zuerst Zugangsdaten hinterlegen.');

  const nl = await getNewsletter(id);
  if (!nl) throw new Error('Rundmail nicht gefunden.');

  const recipients = await resolveRecipients(nl.audience, nl.audienceTeamId);
  const result = await sendBulkMail({ recipients, subject: nl.subject, body: nl.body });

  await db
    .update(newsletters)
    .set({
      status: result.failed > 0 && result.sent === 0 ? 'failed' : 'sent',
      sentAt: new Date(),
      recipientCount: result.sent,
      updatedAt: new Date(),
    })
    .where(eq(newsletters.id, id));
  revalidateViews(id);
  redirect(`/admin/rundmail?sent=${result.sent}&failed=${result.failed}`);
}

export async function deleteNewsletter(formData: FormData) {
  const id = String(formData.get('id') ?? '').trim();
  if (!id) throw new Error('Rundmail-ID fehlt.');
  await db.delete(newsletters).where(eq(newsletters.id, id));
  revalidateViews();
  redirect('/admin/rundmail');
}
