// Protected app layout
import { requireAuth } from '@/lib/auth/session';
import { MobileNav } from '@/components/layout/MobileNav';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This will throw and redirect to login if not authenticated
  await requireAuth();

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      {children}
      <MobileNav />
    </div>
  );
}
