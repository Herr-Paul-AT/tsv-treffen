import { TopNav } from '@/components/nav/TopNav';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-paper-100">
      <TopNav />
      {children}
    </div>
  );
}
