'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SwipeHandler } from './SwipeHandler';
import { EventCard } from './EventCard';
import { Button } from '@/components/ui/button';
import {
  getWeekDays,
  getNextWeek,
  getPrevWeek,
  formatMonthYear,
  formatDayOfWeek,
  formatDayNumber,
  formatHour,
  getHoursArray,
  isTodayUtil,
} from '@/lib/calendar/date-utils';
import { getEventsForDate, getAllDayEvents, getTimedEvents, getEventsForHour } from '@/lib/calendar/event-utils';
import { cn } from '@/lib/utils';
import type { Event } from '@/types/database';

interface WeekViewProps {
  events: Event[];
  initialDate?: Date;
}

export function WeekView({ events, initialDate }: WeekViewProps) {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(initialDate || new Date());

  const weekDays = getWeekDays(currentDate);
  const hours = getHoursArray();

  const handlePrevWeek = () => {
    setCurrentDate(getPrevWeek(currentDate));
  };

  const handleNextWeek = () => {
    setCurrentDate(getNextWeek(currentDate));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-3 md:p-4 border-b">
        <div className="flex items-center gap-1 md:gap-2">
          <Button variant="outline" size="sm" onClick={handlePrevWeek} className="min-w-[44px] min-h-[44px]">
            ←
          </Button>
          <Button variant="outline" size="sm" onClick={handleToday} className="min-w-[44px] min-h-[44px]">
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={handleNextWeek} className="min-w-[44px] min-h-[44px]">
            →
          </Button>
        </div>
        <h2 className="text-sm md:text-xl font-semibold truncate px-2">
          {formatMonthYear(weekDays[0])}
        </h2>
        <Button onClick={() => router.push('/events/new')} className="hidden md:flex">
          + New Event
        </Button>
        <div className="w-11 md:hidden" />
      </div>

      {/* Week Grid */}
      <SwipeHandler
        onSwipeLeft={handleNextWeek}
        onSwipeRight={handlePrevWeek}
        className="flex-1 overflow-auto"
      >
        <div className="p-4">
          {/* Day headers */}
          <div className="grid grid-cols-8 gap-2 mb-2 sticky top-0 bg-background z-10">
            <div className="text-sm font-medium text-center py-2">Time</div>
            {weekDays.map((day, idx) => (
              <div
                key={idx}
                className={cn(
                  'text-center py-2 rounded-lg',
                  isTodayUtil(day) && 'bg-primary text-primary-foreground'
                )}
              >
                <div className="text-xs">{formatDayOfWeek(day)}</div>
                <div className="text-lg font-semibold">{formatDayNumber(day)}</div>
              </div>
            ))}
          </div>

          {/* All-day events row */}
          <div className="grid grid-cols-8 gap-2 mb-4">
            <div className="text-xs text-muted-foreground p-2">All Day</div>
            {weekDays.map((day, idx) => {
              const dayEvents = getEventsForDate(events, day);
              const allDayEvents = getAllDayEvents(dayEvents);

              return (
                <div key={idx} className="space-y-1">
                  {allDayEvents.map((event) => (
                    <EventCard key={event.id} event={event} size="small" showTime={false} />
                  ))}
                </div>
              );
            })}
          </div>

          {/* Hourly timeline */}
          {hours.map((hour) => (
            <div key={hour} className="grid grid-cols-8 gap-2 border-t">
              <div className="text-xs text-muted-foreground p-2">
                {formatHour(hour)}
              </div>
              {weekDays.map((day, idx) => {
                const dayEvents = getEventsForDate(events, day);
                const timedEvents = getTimedEvents(dayEvents);
                const hourEvents = getEventsForHour(timedEvents, hour);

                return (
                  <div key={idx} className="min-h-[60px] p-1 space-y-1">
                    {hourEvents.map((event) => (
                      <EventCard key={event.id} event={event} size="small" />
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </SwipeHandler>
    </div>
  );
}
