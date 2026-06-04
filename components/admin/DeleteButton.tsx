'use client';

import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

/**
 * Generischer Lösch-Button: rendert ein Mini-Formular, das eine Server-Action
 * aufruft, und fragt vorher per Browser-Dialog nach Bestätigung.
 */
export function DeleteButton({
  action,
  id,
  label = 'Löschen',
  confirmText = 'Wirklich unwiderruflich löschen?',
}: {
  action: (formData: FormData) => void | Promise<void>;
  id: string;
  label?: string;
  confirmText?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(confirmText)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <Button type="submit" variant="destructive" icon={<Icon.Trash size={16} />}>
        {label}
      </Button>
    </form>
  );
}
