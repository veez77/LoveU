// Client-side event types
import type { Event, EventType } from './database';

export type { Event, EventType };

export interface EventFormData {
  title: string;
  description: string;
  event_type: EventType;
  start_date: string;
  start_time: string;
  end_time: string;
  is_all_day: boolean;
}

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  exam: 'Exam',
  project: 'Project',
  book_report: 'Book Report',
  school_event: 'School Event',
  private_lesson: 'Private Lesson',
};

export const EVENT_TYPE_COLORS: Record<EventType, string> = {
  exam: 'bg-red-100 text-red-800 border-red-200',
  project: 'bg-blue-100 text-blue-800 border-blue-200',
  book_report: 'bg-green-100 text-green-800 border-green-200',
  school_event: 'bg-purple-100 text-purple-800 border-purple-200',
  private_lesson: 'bg-orange-100 text-orange-800 border-orange-200',
};
