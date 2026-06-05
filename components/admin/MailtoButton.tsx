'use client';

import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

/**
 * Öffnet das E-Mail-Programm mit allen Empfängern im BCC (Adressen bleiben
 * untereinander verborgen) — pragmatischer Versand ohne SMTP-Konfiguration.
 */
export function MailtoButton({
  recipients,
  subject,
  body,
  label = 'Im E-Mail-Programm öffnen',
}: {
  recipients: string[];
  subject: string;
  body: string;
  label?: string;
}) {
  function open() {
    const bcc = encodeURIComponent(recipients.join(','));
    const s = encodeURIComponent(subject);
    const b = encodeURIComponent(body);
    window.location.href = `mailto:?bcc=${bcc}&subject=${s}&body=${b}`;
  }
  return (
    <Button
      type="button"
      variant="secondary"
      icon={<Icon.Mail size={16} />}
      onClick={open}
      disabled={recipients.length === 0}
    >
      {label}
    </Button>
  );
}
