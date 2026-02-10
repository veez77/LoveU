import Link from 'next/link';
import { cn } from '@/lib/utils';
import { EVENT_TYPE_LABELS, EVENT_TYPE_COLORS } from '@/types/event';
import { formatTime } from '@/lib/calendar/date-utils';
import type { Event } from '@/types/database';

interface EventCardProps {
  event: Event;
  size?: 'small' | 'medium' | 'large';
  showTime?: boolean;
}

export function EventCard({ event, size = 'medium', showTime = true }: EventCardProps) {
  const sizeClasses = {
    small: 'text-xs p-1.5',
    medium: 'text-sm p-2',
    large: 'text-base p-3',
  };

  return (
    <Link
      href={`/events/${event.id}/edit`}
      className={cn(
        'block rounded-md border transition-colors hover:opacity-80',
        EVENT_TYPE_COLORS[event.event_type],
        sizeClasses[size]
      )}
    >
      <div className="font-medium truncate">{event.title}</div>
      {showTime && !event.is_all_day && event.start_time && (
        <div className="text-xs opacity-75 mt-0.5">
          {formatTime(event.start_time)}
          {event.end_time && ` - ${formatTime(event.end_time)}`}
        </div>
      )}
      {size === 'large' && event.description && (
        <div className="text-sm opacity-75 mt-1 line-clamp-2">
          {event.description}
        </div>
      )}
      {size !== 'small' && (
        <div className="text-xs opacity-60 mt-1">
          {EVENT_TYPE_LABELS[event.event_type]}
        </div>
      )}
    </Link>
  );
}
