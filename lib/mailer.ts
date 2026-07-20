import 'server-only';
import nodemailer from 'nodemailer';

/**
 * SMTP-Versand, z. B. über World4You (smtp.world4you.com:587, STARTTLS).
 * Konfiguration über Env:
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM, MAIL_BCC (optional)
 * Ohne Konfiguration ist isMailConfigured() = false → die UI bietet den
 * mailto-Fallback an, es wird nichts automatisch versendet.
 */

export function isMailConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.MAIL_FROM,
  );
}

export const MAIL_FROM = process.env.MAIL_FROM ?? '';
export const MAIL_BCC = process.env.MAIL_BCC ?? process.env.MAIL_FROM ?? '';

function getTransport() {
  const port = Number(process.env.SMTP_PORT ?? 587);
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465, // 465 = SSL, 587 = STARTTLS
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
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
