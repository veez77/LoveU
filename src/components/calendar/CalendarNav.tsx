import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getSession } from '@/lib/auth/session';

interface CalendarNavProps {
  currentView: 'month' | 'week' | 'day';
}

export async function CalendarNav({ currentView }: CalendarNavProps) {
  const session = await getSession();

  const handleLogout = async () => {
    'use server';
    const { cookies } = await import('next/headers');
    (await cookies()).delete('auth-token');
  };

  return (
    <div className="border-b bg-background">
      <div className="container flex items-center justify-between py-3">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold">LoveU</h1>
          {session && (
            <span className="text-sm text-muted-foreground">
              {session.user.firstName}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* View Switcher */}
          <div className="flex gap-1 border rounded-lg p-1">
            <Link href="/calendar">
              <Button
                variant={currentView === 'month' ? 'default' : 'ghost'}
                size="sm"
              >
                Month
              </Button>
            </Link>
            <Link href="/calendar/week">
              <Button
                variant={currentView === 'week' ? 'default' : 'ghost'}
                size="sm"
              >
                Week
              </Button>
            </Link>
            <Link href="/calendar/day">
              <Button
                variant={currentView === 'day' ? 'default' : 'ghost'}
                size="sm"
              >
                Day
              </Button>
            </Link>
          </div>

          {/* Logout */}
          <form action={handleLogout}>
            <Button variant="outline" size="sm" type="submit">
              Logout
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
