import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { LogoutButton } from '@/components/layout/LogoutButton';
import { cn } from '@/lib/utils';
import { getSession } from '@/lib/auth/session';

interface CalendarNavProps {
  currentView: 'month' | 'week' | 'day';
}

export async function CalendarNav({ currentView }: CalendarNavProps) {
  const session = await getSession();

  return (
    <div className="border-b bg-background">
      <div className="flex items-center justify-between py-2 px-3 md:py-3 md:px-6">
        <div className="flex items-center gap-2 md:gap-3">
          <Image
            src="/logo.png"
            alt="LoveU"
            width={40}
            height={40}
            className="w-8 h-8 md:w-10 md:h-10"
          />
          {session && (
            <span className="text-xs md:text-sm text-muted-foreground hidden sm:inline">
              {session.user.firstName}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 md:gap-2">
          {/* View Switcher */}
          <div className="flex gap-0.5 md:gap-1 border rounded-lg p-0.5 md:p-1">
            <Link href="/calendar">
              <Button
                variant={currentView === 'month' ? 'default' : 'ghost'}
                size="sm"
                className="text-xs md:text-sm px-2 md:px-3"
              >
                Month
              </Button>
            </Link>
            <Link href="/calendar/week">
              <Button
                variant={currentView === 'week' ? 'default' : 'ghost'}
                size="sm"
                className="text-xs md:text-sm px-2 md:px-3"
              >
                Week
              </Button>
            </Link>
            <Link href="/calendar/day">
              <Button
                variant={currentView === 'day' ? 'default' : 'ghost'}
                size="sm"
                className="text-xs md:text-sm px-2 md:px-3"
              >
                Day
              </Button>
            </Link>
          </div>

          {/* Logout - Hidden on mobile */}
          <div className="hidden md:block">
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  );
}
