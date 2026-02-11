'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SwipeHandler } from './SwipeHandler';
import { EventCard } from './EventCard';
import { DayEventsModal } from './DayEventsModal';
import { EventSearchModal } from './EventSearchModal';
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
  const [modalDay, setModalDay] = useState<{ date: Date; events: Event[] } | null>(null);
  const [showSearch, setShowSearch] = useState(false);

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

  const handleDayClick = (day: Date, dayEvents: Event[]) => {
    if (dayEvents.length === 0) {
      router.push(`/events/new?date=${formatDateForAPI(day)}`);
    } else {
      setModalDay({ date: day, events: dayEvents });
    }
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
        <div className="flex items-center gap-1 md:gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowSearch(true)} className="min-w-[44px] min-h-[44px]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </Button>
          <Button onClick={() => router.push('/events/new')} className="hidden md:flex">
            + New Event
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <SwipeHandler
        onSwipeLeft={handleNextMonth}
        onSwipeRight={handlePrevMonth}
        className="flex-1 overflow-auto"
      >
        <div className="p-1 md:p-4 w-full">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-px md:gap-1 mb-1 md:mb-2">
            {daysOfWeek.map((day) => (
              <div
                key={day}
                className="text-center text-[10px] md:text-sm font-medium text-muted-foreground py-1"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-px md:gap-1">
            {days.map((day, idx) => {
              const dayEvents = sortEventsByTime(getEventsForDate(events, day));
              const isCurrentMonth = isSameMonthUtil(day, currentDate);
              const isToday = isTodayUtil(day);

              return (
                <div
                  key={idx}
                  onClick={() => handleDayClick(day, dayEvents)}
                  className={cn(
                    'min-h-[70px] md:min-h-[100px] p-0.5 md:p-2 border rounded cursor-pointer transition-colors hover:bg-muted/50',
                    !isCurrentMonth && 'bg-muted/30 text-muted-foreground',
                    isToday && 'ring-1 md:ring-2 ring-primary'
                  )}
                >
                  <div
                    className={cn(
                      'text-[10px] md:text-sm font-medium mb-0.5 md:mb-1',
                      isToday && 'text-primary font-bold'
                    )}
                  >
                    {formatDayNumber(day)}
                  </div>
                  <div className="space-y-0.5 md:space-y-1">
                    {dayEvents.slice(0, 2).map((event) => (
                      <EventCard key={event.id} event={event} size="small" />
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-[8px] md:text-xs text-muted-foreground px-0.5">
                        +{dayEvents.length - 2}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </SwipeHandler>

      {/* Day Events Modal */}
      {modalDay && (
        <DayEventsModal
          date={modalDay.date}
          events={modalDay.events}
          onClose={() => setModalDay(null)}
        />
      )}

      {/* Search Modal */}
      {showSearch && (
        <EventSearchModal onClose={() => setShowSearch(false)} />
      )}
    </div>
  );
}
