// Date manipulation utilities using date-fns
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfDay,
  parseISO,
} from 'date-fns';

/**
 * Get all days to display in a month view (including padding days from prev/next month)
 */
export function getMonthDays(date: Date): Date[] {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
}

/**
 * Get days for a week view
 */
export function getWeekDays(date: Date): Date[] {
  const weekStart = startOfWeek(date);
  const weekEnd = endOfWeek(date);

  return eachDayOfInterval({ start: weekStart, end: weekEnd });
}

/**
 * Navigation functions
 */
export function getNextMonth(date: Date): Date {
  return addMonths(date, 1);
}

export function getPrevMonth(date: Date): Date {
  return subMonths(date, 1);
}

export function getNextWeek(date: Date): Date {
  return addWeeks(date, 1);
}

export function getPrevWeek(date: Date): Date {
  return subWeeks(date, 1);
}

export function getNextDay(date: Date): Date {
  return addDays(date, 1);
}

export function getPrevDay(date: Date): Date {
  return subDays(date, 1);
}

/**
 * Format dates for display
 */
export function formatMonthYear(date: Date): string {
  return format(date, 'MMMM yyyy');
}

export function formatDayOfWeek(date: Date): string {
  return format(date, 'EEE');
}

export function formatDayOfWeekLong(date: Date): string {
  return format(date, 'EEEE');
}

export function formatDayNumber(date: Date): string {
  return format(date, 'd');
}

export function formatFullDate(date: Date): string {
  return format(date, 'MMMM d, yyyy');
}

export function formatTime(time: string | null): string {
  if (!time) return '';
  // Convert HH:MM:SS to HH:MM AM/PM
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

/**
 * Date comparison helpers
 */
export function isSameDayUtil(date1: Date, date2: Date): boolean {
  return isSameDay(date1, date2);
}

export function isSameMonthUtil(date1: Date, date2: Date): boolean {
  return isSameMonth(date1, date2);
}

export function isTodayUtil(date: Date): boolean {
  return isToday(date);
}

/**
 * Convert ISO date string to Date object
 */
export function parseDate(dateString: string): Date {
  return parseISO(dateString);
}

/**
 * Format date for API (YYYY-MM-DD)
 */
export function formatDateForAPI(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

/**
 * Get hours array for timeline (0-23)
 */
export function getHoursArray(): number[] {
  return Array.from({ length: 24 }, (_, i) => i);
}

/**
 * Format hour for display (12-hour format)
 */
export function formatHour(hour: number): string {
  if (hour === 0) return '12 AM';
  if (hour === 12) return '12 PM';
  if (hour < 12) return `${hour} AM`;
  return `${hour - 12} PM`;
}

/**
 * Check if event time falls within a specific hour
 */
export function isEventInHour(
  eventTime: string | null,
  hour: number
): boolean {
  if (!eventTime) return false;
  const [eventHour] = eventTime.split(':').map(Number);
  return eventHour === hour;
}

/**
 * Get date range for calendar queries (start and end of month)
 */
export function getMonthDateRange(date: Date): { start: string; end: string } {
  const start = startOfWeek(startOfMonth(date));
  const end = endOfWeek(endOfMonth(date));

  return {
    start: formatDateForAPI(start),
    end: formatDateForAPI(end),
  };
}

/**
 * Get date range for week queries
 */
export function getWeekDateRange(date: Date): { start: string; end: string } {
  const start = startOfWeek(date);
  const end = endOfWeek(date);

  return {
    start: formatDateForAPI(start),
    end: formatDateForAPI(end),
  };
}
