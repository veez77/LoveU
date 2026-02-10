'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarHeaderProps {
  title: string;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onNewEvent: () => void;
}

export function CalendarHeader({
  title,
  onPrev,
  onNext,
  onToday,
  onNewEvent,
}: CalendarHeaderProps) {
  return (
    <div className="flex items-center justify-between p-3 md:p-4 border-b bg-background">
      <div className="flex items-center gap-1 md:gap-2">
        {/* Navigation buttons with minimum touch target size */}
        <Button
          variant="outline"
          size="sm"
          onClick={onPrev}
          className="min-w-[44px] min-h-[44px] p-2"
          aria-label="Previous"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onToday}
          className="min-w-[44px] min-h-[44px] px-3"
        >
          Today
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onNext}
          className="min-w-[44px] min-h-[44px] p-2"
          aria-label="Next"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Title - responsive text size */}
      <h2 className="text-base md:text-xl font-semibold truncate px-2">
        {title}
      </h2>

      {/* New Event button - hidden on mobile (use bottom nav instead) */}
      <Button
        onClick={onNewEvent}
        className="hidden md:flex min-h-[44px]"
      >
        + New Event
      </Button>
      <div className="w-11 md:hidden" /> {/* Spacer for layout balance */}
    </div>
  );
}
