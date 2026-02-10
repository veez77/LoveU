'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SwipeHandler } from './SwipeHandler';
import { EventCard } from './EventCard';
import { Button } from '@/components/ui/button';
import {
  getMonthDays,
  getNextMonth,
  getPrevMonth,
  formatMonthYear,
  formatDayOfWeek,
  formatDayNumber,
  formatDateForAPI,
  isSameDayUtil,
  isSameMonthUtil,
  isTodayUtil,
} from '@/lib/calendar/date-utils';
import { getEventsForDate, sortEventsByTime } from '@/lib/calendar/event-utils';
import { cn } from '@/lib/utils';
import type { Event } from '@/types/database';

interface MonthViewProps {
  events: Event[];
  initialDate?: Date;
}

export function MonthView({ events, initialDate }: MonthViewProps) {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(initialDate || new Date());

  const days = getMonthDays(currentDate);
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handlePrevMonth = () => {
    setCurrentDate(getPrevMonth(currentDate));
  };

  const handleNextMonth = () => {
    setCurrentDate(getNextMonth(currentDate));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-3 md:p-4 border-b">
        <div className="flex items-center gap-1 md:gap-2">
          <Button variant="outline" size="sm" onClick={handlePrevMonth} className="min-w-[44px] min-h-[44px]">
            ←
          </Button>
          <Button variant="outline" size="sm" onClick={handleToday} className="min-w-[44px] min-h-[44px]">
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={handleNextMonth} className="min-w-[44px] min-h-[44px]">
            →
          </Button>
        </div>
        <h2 className="text-base md:text-xl font-semibold">{formatMonthYear(currentDate)}</h2>
        <Button onClick={() => router.push('/events/new')} className="hidden md:flex">
          + New Event
        </Button>
        <div className="w-11 md:hidden" />
      </div>

      {/* Calendar Grid */}
      <SwipeHandler
        onSwipeLeft={handleNextMonth}
        onSwipeRight={handlePrevMonth}
        className="flex-1 overflow-auto"
      >
        <div className="p-2 md:p-4">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-0.5 md:gap-1 mb-2">
            {daysOfWeek.map((day) => (
              <div
                key={day}
                className="text-center text-xs md:text-sm font-medium text-muted-foreground py-1 md:py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-0.5 md:gap-1">
            {days.map((day, idx) => {
              const dayEvents = sortEventsByTime(getEventsForDate(events, day));
              const isCurrentMonth = isSameMonthUtil(day, currentDate);
              const isToday = isTodayUtil(day);

              return (
                <div
                  key={idx}
                  className={cn(
                    'min-h-[80px] md:min-h-[100px] p-1 md:p-2 border rounded-lg',
                    'min-w-[44px]', // Ensure minimum touch target width
                    !isCurrentMonth && 'bg-muted/30 text-muted-foreground',
                    isToday && 'ring-2 ring-primary'
                  )}
                >
                  <div
                    className={cn(
                      'text-xs md:text-sm font-medium mb-1',
                      isToday && 'text-primary font-bold'
                    )}
                  >
                    {formatDayNumber(day)}
                  </div>
                  <div className="space-y-0.5 md:space-y-1">
                    {dayEvents.slice(0, 3).map((event) => (
                      <EventCard key={event.id} event={event} size="small" />
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-[10px] md:text-xs text-muted-foreground px-1">
                        +{dayEvents.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </SwipeHandler>
    </div>
  );
}
