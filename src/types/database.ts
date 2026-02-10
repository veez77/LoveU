// Database entity types

export type EventType =
  | 'exam'
  | 'project'
  | 'book_report'
  | 'school_event'
  | 'private_lesson';

export type UserRole = 'parent' | 'child' | 'member';

export interface Family {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export interface User {
  id: number;
  family_id: number;
  first_name: string;
  last_name: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
}

export interface Event {
  id: number;
  family_id: number;
  created_by: number;
  title: string;
  description: string | null;
  event_type: EventType;
  start_date: string; // ISO date string (YYYY-MM-DD)
  start_time: string | null; // HH:MM:SS format
  end_time: string | null; // HH:MM:SS format
  is_all_day: boolean;
  created_at: Date;
  updated_at: Date;
}

// Input types for creation (without auto-generated fields)
export interface CreateFamilyInput {
  name: string;
}

export interface CreateUserInput {
  family_id: number;
  first_name: string;
  last_name: string;
  role?: UserRole;
}

export interface CreateEventInput {
  family_id: number;
  created_by: number;
  title: string;
  description?: string;
  event_type: EventType;
  start_date: string;
  start_time?: string;
  end_time?: string;
  is_all_day?: boolean;
}

export interface UpdateEventInput {
  title?: string;
  description?: string;
  event_type?: EventType;
  start_date?: string;
  start_time?: string;
  end_time?: string;
  is_all_day?: boolean;
}
