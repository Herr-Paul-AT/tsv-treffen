import { redirect } from 'next/navigation';
import { TopNav } from '@/components/nav/TopNav';
import { getCurrentMember } from '@/lib/db/queries/session';
import { isSupabaseConfigured } from '@/lib/supabase/config';

const ADMIN_ROLES = ['admin', 'obmann'];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Rollensperre nur bei aktiver Auth — im Dev-Modus bleibt der Bereich offen.
  if (isSupabaseConfigured()) {
    const me = await getCurrentMember();
    if (!me) redirect('/login?redirect=/admin');
    if (!ADMIN_ROLES.includes(me.role)) redirect('/app/dashboard');
  }

  return (
    <div className="min-h-dvh bg-paper-100">
      <TopNav />
      {children}
    </div>
  );
}
