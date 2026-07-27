import { Icon } from '@/components/ui/Icon';
import type { Contact } from '@/lib/db/schema';

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase() || '?';
}

export function ContactsGrid({ contacts }: { contacts: Contact[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {contacts.map((c) => (
        <div key={c.id} className="bg-white rounded-lg border border-stone-200 p-5 flex items-start gap-4">
          <div className="flex-none">
            {c.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={c.photoUrl}
                alt={c.name}
                className="h-14 w-14 rounded-full object-cover border border-stone-200"
                loading="lazy"
              />
            ) : (
              <div className="h-14 w-14 rounded-full bg-paper-100 border border-stone-200 flex items-center justify-center font-display text-[18px] text-stone-600">
                {initialsOf(c.name)}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-display text-[18px] text-stone-800 leading-tight">{c.name}</div>
            {c.role && (
              <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-stone-500 mt-0.5">
                {c.role}
              </div>
            )}
            <div className="mt-2 space-y-1">
              {c.phone && (
                <a href={`tel:${c.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 text-[14px] text-stone-700 hover:text-lake-700">
                  <Icon.Phone size={14} className="text-stone-400 flex-none" />
                  <span className="truncate">{c.phone}</span>
                </a>
              )}
              {c.email && (
                <a href={`mailto:${c.email}`} className="flex items-center gap-2 text-[14px] text-stone-700 hover:text-lake-700">
                  <Icon.Mail size={14} className="text-stone-400 flex-none" />
                  <span className="truncate">{c.email}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
