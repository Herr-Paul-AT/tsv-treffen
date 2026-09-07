import 'server-only';
import nodemailer from 'nodemailer';

/**
 * SMTP-Versand, z. B. über World4You (smtp.world4you.com:587, STARTTLS).
 * Konfiguration über Env:
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM, MAIL_BCC (optional)
 * Ohne Konfiguration ist isMailConfigured() = false → die UI bietet den
 * mailto-Fallback an, es wird nichts automatisch versendet.
 */

// Env-Werte defensiv trimmen — beim Einfügen in Vercel schleichen sich leicht
// Leerzeichen/Tabs ein (z. B. beim Copy-Paste), die sonst den Login brechen.
function env(key: string): string | undefined {
  const v = process.env[key];
  return v == null ? undefined : v.trim();
}

export function isMailConfigured(): boolean {
  return Boolean(env('SMTP_HOST') && env('SMTP_USER') && env('SMTP_PASS') && env('MAIL_FROM'));
}

export const MAIL_FROM = env('MAIL_FROM') ?? '';
export const MAIL_BCC = env('MAIL_BCC') ?? env('MAIL_FROM') ?? '';

function getTransport() {
  const port = Number(env('SMTP_PORT') ?? 587);
  return nodemailer.createTransport({
    host: env('SMTP_HOST'),
    port,
    secure: port === 465, // 465 = SSL, 587 = STARTTLS
    auth: { user: env('SMTP_USER'), pass: env('SMTP_PASS') },
  });
}

export type Recipient = { email: string; name?: string | null };

export type SendResult = { sent: number; failed: number };

/**
 * Versendet eine Rundmail einzeln je Empfänger (kein Sammel-To → keine
 * offengelegten Adressen) und legt über BCC eine Kopie im Vereinspostfach ab.
 */
export async function sendBulkMail(opts: {
  recipients: Recipient[];
  subject: string;
  body: string;
}): Promise<SendResult> {
  if (!isMailConfigured()) throw new Error('SMTP ist nicht konfiguriert.');
  const transport = getTransport();
  const html = bodyToHtml(opts.body);

  let sent = 0;
  let failed = 0;
  for (const r of opts.recipients) {
    try {
      await transport.sendMail({
        from: MAIL_FROM,
        to: r.name ? `"${r.name}" <${r.email}>` : r.email,
        bcc: MAIL_BCC || undefined,
        subject: opts.subject,
        text: opts.body,
        html,
      });
      sent++;
    } catch {
      failed++;
    }
  }
  return { sent, failed };
}

/**
 * Einzelne Benachrichtigung an die Vereinsadresse (z. B. neue Anmeldung).
 * Gibt false zurück, wenn SMTP nicht konfiguriert ist — der Aufrufer speichert
 * dann trotzdem und zeigt die Info im Admin.
 */
export async function sendNotificationMail(opts: {
  subject: string;
  body: string;
  replyTo?: string;
}): Promise<boolean> {
  if (!isMailConfigured()) return false;
  const transport = getTransport();
  await transport.sendMail({
    from: MAIL_FROM,
    to: MAIL_BCC || MAIL_FROM,
    replyTo: opts.replyTo,
    subject: opts.subject,
    text: opts.body,
    html: bodyToHtml(opts.body),
  });
  return true;
}

/**
 * Willkommens-Mail an ein neu angelegtes Mitglied (best effort).
 * Gibt false zurück, wenn SMTP nicht konfiguriert ist.
 */
export async function sendMemberWelcome(opts: {
  to: string;
  firstName: string;
  packageLabel?: string | null;
}): Promise<boolean> {
  if (!isMailConfigured()) return false;
  const transport = getTransport();
  const body = [
    `Hallo ${opts.firstName},`,
    ``,
    `willkommen beim TSV Schloss Treffen! Wir haben dich als Mitglied angelegt.`,
    opts.packageLabel ? `\nDein Paket: ${opts.packageLabel}` : ``,
    ``,
    `Über den Mitgliederbereich auf https://www.tsv-treffen.at/login kannst du dich jederzeit`,
    `mit dieser E-Mail-Adresse anmelden — beim ersten Mal einfach „Passwort vergessen" nutzen,`,
    `um dein Passwort zu setzen.`,
    ``,
    `Mitgliedsbeitrag — Bankverbindung:`,
    `Empfänger: Tennissportverein Schloß Treffen c/o Hr. Kalin Martin`,
    `IBAN: AT43 3939 0000 0400 9684`,
    `Verwendungszweck: Name des Mitglieds`,
    ``,
    `Bei Fragen erreichst du uns unter office@tsv-treffen.at.`,
    ``,
    `Sportliche Grüße`,
    `TSV Schloss Treffen`,
  ].join('\n');
  await transport.sendMail({
    from: MAIL_FROM,
    to: opts.to,
    bcc: MAIL_BCC || undefined,
    subject: 'Willkommen beim TSV Schloss Treffen',
    text: body,
    html: bodyToHtml(body),
  });
  return true;
}

/**
 * Zahlungserinnerung (Mahnmail) an ein Mitglied mit offenem Beitrag (best effort).
 * Gibt false zurück, wenn SMTP nicht konfiguriert ist.
 */
export async function sendDuesReminder(opts: {
  to: string;
  firstName: string;
  amountCents?: number | null;
  year?: number;
}): Promise<boolean> {
  if (!isMailConfigured()) return false;
  const transport = getTransport();
  const year = opts.year ?? new Date().getFullYear();
  const amount =
    opts.amountCents && opts.amountCents > 0
      ? new Intl.NumberFormat('de-AT', { style: 'currency', currency: 'EUR' }).format(
          opts.amountCents / 100,
        )
      : null;
  const body = [
    `Hallo ${opts.firstName},`,
    ``,
    `wir möchten dich freundlich an deinen offenen Mitgliedsbeitrag für ${year} beim`,
    `TSV Schloss Treffen erinnern.`,
    amount ? `\nOffener Betrag: ${amount}` : ``,
    ``,
    `Bankverbindung:`,
    `Empfänger: Tennissportverein Schloß Treffen c/o Hr. Kalin Martin`,
    `IBAN: AT43 3939 0000 0400 9684`,
    `Verwendungszweck: Name des Mitglieds`,
    ``,
    `Falls du den Beitrag bereits überwiesen hast, betrachte diese Nachricht bitte`,
    `als gegenstandslos. Bei Fragen erreichst du uns unter office@tsv-treffen.at.`,
    ``,
    `Sportliche Grüße`,
    `TSV Schloss Treffen`,
  ]
    .filter((l) => l !== ``)
    .join('\n');
  await transport.sendMail({
    from: MAIL_FROM,
    to: opts.to,
    bcc: MAIL_BCC || undefined,
    subject: `Erinnerung: Mitgliedsbeitrag ${year}`,
    text: body,
    html: bodyToHtml(body),
  });
  return true;
}

/**
 * Anwesenheits-Erinnerung an ein Mitglied ohne Rückmeldung zu einem anstehenden
 * Training (best effort). Gibt false zurück, wenn SMTP nicht konfiguriert ist.
 */
export async function sendTrainingReminder(opts: {
  to: string;
  firstName: string;
  trainingTitle: string;
  when: string;
}): Promise<boolean> {
  if (!isMailConfigured()) return false;
  const transport = getTransport();
  const body = [
    `Hallo ${opts.firstName},`,
    ``,
    `für dein anstehendes Training „${opts.trainingTitle}" (${opts.when}) fehlt noch deine`,
    `Rückmeldung. Bitte sag im Mitgliederbereich kurz zu oder ab:`,
    `https://www.tsv-treffen.at/login`,
    ``,
    `Danke & sportliche Grüße`,
    `TSV Schloss Treffen`,
  ].join('\n');
  await transport.sendMail({
    from: MAIL_FROM,
    to: opts.to,
    bcc: MAIL_BCC || undefined,
    subject: `Erinnerung: Rückmeldung zu „${opts.trainingTitle}"`,
    text: body,
    html: bodyToHtml(body),
  });
  return true;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function bodyToHtml(body: string): string {
  const paragraphs = body
    .split(/\n\n+/)
    .map((p) => `<p style="margin:0 0 16px;line-height:1.6">${escapeHtml(p).replace(/\n/g, '<br/>')}</p>`)
    .join('');
  return `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#2b2b2b">${paragraphs}</div>`;
}
