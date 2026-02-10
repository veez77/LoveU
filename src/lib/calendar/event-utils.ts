// Event filtering and grouping utilities
import { isSameDay, parseISO } from 'date-fns';
import type { Event } from '@/types/database';

/**
 * Filter events for a specific date
 */
export function getEventsForDate(events: Event[], date: Date): Event[] {
  return events.filter((event) => {
    const eventDate = parseISO(event.start_date);
    return isSameDay(eventDate, date);
  });
}

/**
 * Group events by date
 */
export function groupEventsByDate(events: Event[]): Map<string, Event[]> {
  const grouped = new Map<string, Event[]>();

  events.forEach((event) => {
    const dateKey = event.start_date;
    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, []);
    }
    grouped.get(dateKey)!.push(event);
  });

  return grouped;
}

/**
 * Sort events by time (all-day events first, then by start time)
 */
export function sortEventsByTime(events: Event[]): Event[] {
  return [...events].sort((a, b) => {
    // All-day events come first
    if (a.is_all_day && !b.is_all_day) return -1;
    if (!a.is_all_day && b.is_all_day) return 1;

    // If both all-day or both timed, sort by start time
    if (a.start_time && b.start_time) {
      return a.start_time.localeCompare(b.start_time);
    }

    // If one has time and other doesn't, prioritize the one with time
    if (a.start_time && !b.start_time) return 1;
    if (!a.start_time && b.start_time) return -1;

    // If neither has time, maintain original order
    return 0;
  });
}

/**
 * Get events for a specific hour (used in week/day views)
 */
export function getEventsForHour(events: Event[], hour: number): Event[] {
  return events.filter((event) => {
    if (event.is_all_day) return false;
    if (!event.start_time) return false;

    const [eventHour] = event.start_time.split(':').map(Number);
    return eventHour === hour;
  });
}

/**
 * Check if event spans multiple hours
 */
export function getEventDuration(event: Event): number {
  if (event.is_all_day || !event.start_time || !event.end_time) {
    return 1; // Default to 1 hour
  }

  const [startHour, startMinute] = event.start_time.split(':').map(Number);
  const [endHour, endMinute] = event.end_time.split(':').map(Number);

  const startInMinutes = startHour * 60 + startMinute;
  const endInMinutes = endHour * 60 + endMinute;

  return (endInMinutes - startInMinutes) / 60; // Return duration in hours
}

/**
 * Get all-day events for a date
 */
export function getAllDayEvents(events: Event[]): Event[] {
  return events.filter((event) => event.is_all_day);
}

/**
 * Get timed events for a date
 */
export function getTimedEvents(events: Event[]): Event[] {
  return events.filter((event) => !event.is_all_day);
}

/**
 * Count events for a specific date
 */
export function getEventCountForDate(events: Event[], date: Date): number {
  return getEventsForDate(events, date).length;
}
