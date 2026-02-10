'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, Plus, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileNav() {
  const pathname = usePathname();

  const isCalendar = pathname?.startsWith('/calendar');
  const isNewEvent = pathname === '/events/new';

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t md:hidden z-50">
      <div className="flex items-center justify-around h-16">
        {/* Calendar */}
        <Link
          href="/calendar"
          className={cn(
            'flex flex-col items-center justify-center flex-1 h-full',
            'min-w-[44px] min-h-[44px]', // Minimum touch target size
            'transition-colors',
            isCalendar && !isNewEvent
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Calendar className="h-5 w-5" />
          <span className="text-xs mt-1">Calendar</span>
        </Link>

        {/* Add Event */}
        <Link
          href="/events/new"
          className={cn(
            'flex flex-col items-center justify-center flex-1 h-full',
            'min-w-[44px] min-h-[44px]',
            'transition-colors',
            isNewEvent
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Plus className="h-5 w-5" />
          <span className="text-xs mt-1">New</span>
        </Link>

        {/* Menu (placeholder for future features) */}
        <button
          className={cn(
            'flex flex-col items-center justify-center flex-1 h-full',
            'min-w-[44px] min-h-[44px]',
            'text-muted-foreground hover:text-foreground transition-colors'
          )}
        >
          <Menu className="h-5 w-5" />
          <span className="text-xs mt-1">Menu</span>
        </button>
      </div>
    </nav>
  );
}
