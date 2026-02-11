'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { EVENT_TYPE_COLORS, EVENT_TYPE_LABELS } from '@/types/event';
import { formatTime, formatFullDate, formatDateForAPI } from '@/lib/calendar/date-utils';
import { cn } from '@/lib/utils';
import type { Event } from '@/types/database';

interface DayEventsModalProps {
  date: Date;
  events: Event[];
  onClose: () => void;
}

export function DayEventsModal({ date, events, onClose }: DayEventsModalProps) {
  const router = useRouter();
  const dateStr = formatDateForAPI(date);

  const handleEventClick = (eventId: number) => {
    router.push(`/events/${eventId}/edit`);
  };

  const handleAddNew = () => {
    router.push(`/events/new?date=${dateStr}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-background rounded-lg shadow-lg w-full max-w-md mx-4 max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">{formatFullDate(date)}</h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground text-xl leading-none p-1"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Events list */}
        <div className="flex-1 overflow-auto p-4 space-y-2">
          <p className="text-sm text-muted-foreground mb-3">
            {events.length} event{events.length !== 1 ? 's' : ''} on this day
          </p>
          {events.map((event) => (
            <button
              key={event.id}
              onClick={() => handleEventClick(event.id)}
              className={cn(
                'w-full text-left rounded-md border p-3 transition-colors hover:opacity-80',
                EVENT_TYPE_COLORS[event.event_type]
              )}
            >
              <div className="font-medium">{event.title}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs opacity-75">
                  {EVENT_TYPE_LABELS[event.event_type]}
                </span>
                {!event.is_all_day && event.start_time && (
                  <span className="text-xs opacity-75">
                    {formatTime(event.start_time)}
                    {event.end_time && ` - ${formatTime(event.end_time)}`}
                  </span>
                )}
                {event.is_all_day && (
                  <span className="text-xs opacity-75">All day</span>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t">
          <Button onClick={handleAddNew} className="w-full">
            + Add New Event
          </Button>
        </div>
      </div>
    </div>
  );
}
