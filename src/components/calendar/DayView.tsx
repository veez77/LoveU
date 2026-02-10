'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SwipeHandler } from './SwipeHandler';
import { EventCard } from './EventCard';
import { Button } from '@/components/ui/button';
import {
  getNextDay,
  getPrevDay,
  formatFullDate,
  formatHour,
  getHoursArray,
} from '@/lib/calendar/date-utils';
import { getEventsForDate, getAllDayEvents, getTimedEvents, getEventsForHour, sortEventsByTime } from '@/lib/calendar/event-utils';
import type { Event } from '@/types/database';

interface DayViewProps {
  events: Event[];
  initialDate?: Date;
}

export function DayView({ events, initialDate }: DayViewProps) {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(initialDate || new Date());

  const hours = getHoursArray();
  const dayEvents = getEventsForDate(events, currentDate);
  const allDayEvents = sortEventsByTime(getAllDayEvents(dayEvents));
  const timedEvents = getTimedEvents(dayEvents);

  const handlePrevDay = () => {
    setCurrentDate(getPrevDay(currentDate));
  };

  const handleNextDay = () => {
    setCurrentDate(getNextDay(currentDate));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-3 md:p-4 border-b">
        <div className="flex items-center gap-1 md:gap-2">
          <Button variant="outline" size="sm" onClick={handlePrevDay} className="min-w-[44px] min-h-[44px]">
            ←
          </Button>
          <Button variant="outline" size="sm" onClick={handleToday} className="min-w-[44px] min-h-[44px]">
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={handleNextDay} className="min-w-[44px] min-h-[44px]">
            →
          </Button>
        </div>
        <h2 className="text-sm md:text-xl font-semibold truncate px-2">{formatFullDate(currentDate)}</h2>
        <Button onClick={() => router.push('/events/new')} className="hidden md:flex">
          + New Event
        </Button>
        <div className="w-11 md:hidden" />
      </div>

      {/* Day View */}
      <SwipeHandler
        onSwipeLeft={handleNextDay}
        onSwipeRight={handlePrevDay}
        className="flex-1 overflow-auto"
      >
        <div className="p-4 max-w-4xl mx-auto">
          {/* All-day events */}
          {allDayEvents.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                All Day Events
              </h3>
              <div className="space-y-2">
                {allDayEvents.map((event) => (
                  <EventCard key={event.id} event={event} size="large" showTime={false} />
                ))}
              </div>
            </div>
          )}

          {/* Hourly timeline */}
          <div className="space-y-1">
            {hours.map((hour) => {
              const hourEvents = getEventsForHour(timedEvents, hour);

              return (
                <div key={hour} className="flex border-t">
                  <div className="w-20 flex-shrink-0 text-xs text-muted-foreground p-2">
                    {formatHour(hour)}
                  </div>
                  <div className="flex-1 min-h-[60px] p-2 space-y-2">
                    {hourEvents.map((event) => (
                      <EventCard key={event.id} event={event} size="medium" />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty state */}
          {dayEvents.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>No events scheduled for this day</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => router.push('/events/new')}
              >
                Create Event
              </Button>
            </div>
          )}
        </div>
      </SwipeHandler>
    </div>
  );
}
