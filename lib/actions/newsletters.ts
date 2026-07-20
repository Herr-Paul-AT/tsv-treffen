'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { newsletters } from '@/lib/db/schema';
import { getCurrentMember } from '@/lib/db/queries/session';
import {
  audienceSpecFromNewsletter,
  getNewsletter,
  getRecipientCount,
  resolveRecipients,
  type AudienceSpec,
} from '@/lib/db/queries/newsletters';
import { MEMBER_CATEGORY_VALUES } from '@/lib/member-categories';
import { isMailConfigured, sendBulkMail } from '@/lib/mailer';

const AUDIENCES = ['all', 'active', 'probe', 'team', 'custom', 'category', 'sponsors'] as const;
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

  const catRaw = String(formData.get('audienceCategory') ?? '').trim();
  const audienceCategory =
    audience === 'category' && (MEMBER_CATEGORY_VALUES as string[]).includes(catRaw)
      ? (catRaw as (typeof MEMBER_CATEGORY_VALUES)[number])
      : null;

  const memberIds =
    audience === 'custom'
      ? formData.getAll('memberIds').map((v) => String(v).trim()).filter(Boolean)
      : [];
  const audienceMemberIds = memberIds.length > 0 ? memberIds.join(',') : null;

  if (audience === 'team' && !audienceTeamId) throw new Error('Bitte eine Mannschaft wählen.');
  if (audience === 'category' && !audienceCategory) throw new Error('Bitte eine Kategorie wählen.');
  if (audience === 'custom' && memberIds.length === 0)
    throw new Error('Bitte mindestens ein Mitglied auswählen.');

  const spec: AudienceSpec = { audience, teamId: audienceTeamId, category: audienceCategory, memberIds };
  return { subject, body, audience, audienceTeamId, audienceCategory, audienceMemberIds, spec };
}

function revalidateViews(id?: string) {
  revalidatePath('/admin/rundmail');
  revalidatePath('/admin');
  if (id) revalidatePath(`/admin/rundmail/${id}`);
}

export async function createDraft(formData: FormData) {
  const v = parseForm(formData);
  const me = await getCurrentMember();
  const recipientCount = await getRecipientCount(v.spec);

  await db.insert(newsletters).values({
    subject: v.subject,
    body: v.body,
    audience: v.audience,
    audienceTeamId: v.audienceTeamId,
    audienceCategory: v.audienceCategory,
    audienceMemberIds: v.audienceMemberIds,
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
  const recipientCount = await getRecipientCount(v.spec);

  await db
    .update(newsletters)
    .set({
      subject: v.subject,
      body: v.body,
      audience: v.audience,
      audienceTeamId: v.audienceTeamId,
      audienceCategory: v.audienceCategory,
      audienceMemberIds: v.audienceMemberIds,
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

  const recipients = await resolveRecipients(audienceSpecFromNewsletter(nl));
  if (recipients.length === 0) throw new Error('Keine Empfänger mit E-Mail-Adresse in dieser Zielgruppe.');
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
