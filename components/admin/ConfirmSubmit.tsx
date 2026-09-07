'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/Button';

/**
 * Button, der eine Server-Action per Mini-Formular auslöst und vorher per
 * Browser-Dialog nach Bestätigung fragt (für Aktionen ohne Datensatz-ID).
 */
export function ConfirmSubmit({
  action,
  label,
  confirmText,
  variant = 'primary',
  icon,
}: {
  action: () => void | Promise<void>;
  label: string;
  confirmText: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  icon?: ReactNode;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(confirmText)) e.preventDefault();
      }}
    >
      <Button type="submit" variant={variant} icon={icon}>
        {label}
      </Button>
    </form>
  );
}
