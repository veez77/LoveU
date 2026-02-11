// Database query functions
import { query, queryOne } from './index';
import type {
  Family,
  User,
  Event,
  CreateFamilyInput,
  CreateUserInput,
  CreateEventInput,
  UpdateEventInput,
} from '@/types/database';

// ============================================================================
// FAMILIES
// ============================================================================

export async function createFamily(input: CreateFamilyInput): Promise<Family> {
  const result = await queryOne<Family>(
    'INSERT INTO families (name) VALUES ($1) RETURNING *',
    [input.name]
  );
  if (!result) throw new Error('Failed to create family');
  return result;
}

export async function getFamilyById(id: number): Promise<Family | null> {
  return queryOne<Family>('SELECT * FROM families WHERE id = $1', [id]);
}

export async function getAllFamilies(): Promise<Family[]> {
  return query<Family>('SELECT * FROM families ORDER BY created_at DESC');
}

// ============================================================================
// USERS
// ============================================================================

export async function createUser(input: CreateUserInput): Promise<User> {
  const result = await queryOne<User>(
    `INSERT INTO users (family_id, first_name, last_name, role)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [input.family_id, input.first_name, input.last_name, input.role || 'member']
  );
  if (!result) throw new Error('Failed to create user');
  return result;
}

export async function getUserById(id: number): Promise<User | null> {
  return queryOne<User>('SELECT * FROM users WHERE id = $1', [id]);
}

export async function getUserByName(
  firstName: string,
  lastName: string
): Promise<User | null> {
  return queryOne<User>(
    'SELECT * FROM users WHERE first_name = $1 AND last_name = $2',
    [firstName, lastName]
  );
}

export async function getUsersByFamily(familyId: number): Promise<User[]> {
  return query<User>(
    'SELECT * FROM users WHERE family_id = $1 ORDER BY created_at ASC',
    [familyId]
  );
}

// ============================================================================
// EVENTS
// ============================================================================

export async function createEvent(input: CreateEventInput): Promise<Event> {
  const result = await queryOne<Event>(
    `INSERT INTO events (
      family_id, created_by, title, description, event_type,
      start_date, start_time, end_time, is_all_day
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *`,
    [
      input.family_id,
      input.created_by,
      input.title,
      input.description || null,
      input.event_type,
      input.start_date,
      input.start_time || null,
      input.end_time || null,
      input.is_all_day || false,
    ]
  );
  if (!result) throw new Error('Failed to create event');
  return result;
}

export async function getEventById(id: number): Promise<Event | null> {
  return queryOne<Event>('SELECT * FROM events WHERE id = $1', [id]);
}

export async function getEventsByFamily(familyId: number): Promise<Event[]> {
  return query<Event>(
    'SELECT * FROM events WHERE family_id = $1 ORDER BY start_date ASC, start_time ASC',
    [familyId]
  );
}

export async function getEventsByDateRange(
  familyId: number,
  startDate: string,
  endDate: string
): Promise<Event[]> {
  return query<Event>(
    `SELECT * FROM events
     WHERE family_id = $1
     AND start_date >= $2
     AND start_date <= $3
     ORDER BY start_date ASC, start_time ASC`,
    [familyId, startDate, endDate]
  );
}

export async function getEventsByType(
  familyId: number,
  eventType: string
): Promise<Event[]> {
  return query<Event>(
    `SELECT * FROM events
     WHERE family_id = $1
     AND event_type = $2
     ORDER BY start_date ASC`,
    [familyId, eventType]
  );
}

export async function searchEvents(
  familyId: number,
  searchTerm: string,
  exactWord: boolean = false
): Promise<Event[]> {
  if (exactWord) {
    return query<Event>(
      `SELECT * FROM events
       WHERE family_id = $1
       AND title ~* $2
       ORDER BY start_date ASC, start_time ASC`,
      [familyId, `\\m${searchTerm}\\M`]
    );
  }
  return query<Event>(
    `SELECT * FROM events
     WHERE family_id = $1
     AND title ILIKE $2
     ORDER BY start_date ASC, start_time ASC`,
    [familyId, `%${searchTerm}%`]
  );
}

export async function updateEvent(
  id: number,
  familyId: number,
  input: UpdateEventInput
): Promise<Event | null> {
  const updates: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  // Build dynamic UPDATE query based on provided fields
  if (input.title !== undefined) {
    updates.push(`title = $${paramIndex++}`);
    values.push(input.title);
  }
  if (input.description !== undefined) {
    updates.push(`description = $${paramIndex++}`);
    values.push(input.description);
  }
  if (input.event_type !== undefined) {
    updates.push(`event_type = $${paramIndex++}`);
    values.push(input.event_type);
  }
  if (input.start_date !== undefined) {
    updates.push(`start_date = $${paramIndex++}`);
    values.push(input.start_date);
  }
  if (input.start_time !== undefined) {
    updates.push(`start_time = $${paramIndex++}`);
    values.push(input.start_time);
  }
  if (input.end_time !== undefined) {
    updates.push(`end_time = $${paramIndex++}`);
    values.push(input.end_time);
  }
  if (input.is_all_day !== undefined) {
    updates.push(`is_all_day = $${paramIndex++}`);
    values.push(input.is_all_day);
  }

  if (updates.length === 0) {
    // No updates provided, return existing event
    return getEventById(id);
  }

  values.push(id, familyId);

  return queryOne<Event>(
    `UPDATE events
     SET ${updates.join(', ')}
     WHERE id = $${paramIndex++} AND family_id = $${paramIndex++}
     RETURNING *`,
    values
  );
}

export async function deleteEvent(
  id: number,
  familyId: number
): Promise<boolean> {
  const result = await query(
    'DELETE FROM events WHERE id = $1 AND family_id = $2 RETURNING id',
    [id, familyId]
  );
  return result.length > 0;
}
