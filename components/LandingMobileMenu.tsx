'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';

const LINKS = [
  { href: '#anlage', label: 'Anlage' },
  { href: '#mannschaften', label: 'Mannschaften' },
  { href: '#training', label: 'Training' },
  { href: '#mitgliedschaft', label: 'Mitglied werden' },
  { href: '#anfahrt', label: 'Anfahrt' },
];

export function LandingMobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        type="button"
        aria-label={open ? 'Menü schließen' : 'Menü öffnen'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="text-paper-50/90 w-11 h-11 inline-flex items-center justify-center"
      >
        {open ? <Icon.Minus /> : <Icon.Menu />}
      </button>

      {open && (
        <>
          {/* Klick außerhalb schließt */}
          <button
            type="button"
            aria-label="Menü schließen"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-stone-900/40"
          />
          <div className="fixed top-[68px] left-4 right-4 z-50 bg-paper-50 rounded-xl border border-stone-200 shadow-pop p-2">
            <nav className="flex flex-col">
              {LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="px-4 py-3.5 rounded-lg text-[16px] text-stone-800 hover:bg-paper-100"
                >
                  {l.label}
                </a>
              ))}
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="mt-1 px-4 py-3.5 rounded-lg text-[16px] font-medium text-lake-700 hover:bg-paper-100 inline-flex items-center gap-2"
              >
                <Icon.Lock size={16} /> Anmelden
              </Link>
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
