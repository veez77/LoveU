'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { EVENT_TYPE_COLORS, EVENT_TYPE_LABELS } from '@/types/event';
import { formatTime } from '@/lib/calendar/date-utils';
import { cn } from '@/lib/utils';
import type { Event } from '@/types/database';

interface EventSearchModalProps {
  onClose: () => void;
}

export function EventSearchModal({ onClose }: EventSearchModalProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [exactWord, setExactWord] = useState(false);
  const [results, setResults] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  // Auto-focus the input when modal opens
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Debounced search
  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ search: query.trim() });
        if (exactWord) params.set('exactWord', 'true');
        const res = await fetch(`/api/events?${params}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.events);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, exactWord]);

  const handleEventClick = (eventId: number) => {
    router.push(`/events/${eventId}/edit`);
    onClose();
  };

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-background rounded-lg shadow-lg w-full max-w-lg mx-4 max-h-[70vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-muted-foreground flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search events by name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground text-xl leading-none p-1 flex-shrink-0"
              aria-label="Close"
            >
              ×
            </button>
          </div>
          <div className="flex items-center gap-2 mt-2 ml-7">
            <input
              type="checkbox"
              id="exactWord"
              checked={exactWord}
              onChange={(e) => setExactWord(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="exactWord" className="text-sm text-muted-foreground cursor-pointer">
              Entire word
            </label>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-auto p-2">
          {loading && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              Searching...
            </div>
          )}

          {!loading && query.trim().length > 0 && results.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No events found for &ldquo;{query}&rdquo;
            </div>
          )}

          {!loading && query.trim().length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              Type to search for events
            </div>
          )}

          {results.map((event) => (
            <button
              key={event.id}
              onClick={() => handleEventClick(event.id)}
              className={cn(
                'w-full text-left rounded-md border p-3 mb-2 transition-colors hover:opacity-80',
                EVENT_TYPE_COLORS[event.event_type]
              )}
            >
              <div className="font-medium">{event.title}</div>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-xs opacity-75">
                  {EVENT_TYPE_LABELS[event.event_type]}
                </span>
                <span className="text-xs opacity-75">
                  {formatDate(event.start_date)}
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
              {event.description && (
                <div className="text-xs opacity-60 mt-1 line-clamp-1">
                  {event.description}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
