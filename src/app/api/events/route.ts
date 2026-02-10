// Events API - List and Create
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { getEventsByFamily, getEventsByDateRange, createEvent } from '@/lib/db/queries';
import type { CreateEventInput } from '@/types/database';

// GET /api/events - List events for the authenticated user's family
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let events;

    if (startDate && endDate) {
      // Get events in date range
      events = await getEventsByDateRange(
        session.user.familyId,
        startDate,
        endDate
      );
    } else {
      // Get all events for family
      events = await getEventsByFamily(session.user.familyId);
    }

    return NextResponse.json({ events }, { status: 200 });
  } catch (error) {
    console.error('Get events error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

// POST /api/events - Create a new event
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, event_type, start_date, start_time, end_time, is_all_day } = body;

    // Validate required fields
    if (!title || !event_type || !start_date) {
      return NextResponse.json(
        { error: 'Title, event type, and start date are required' },
        { status: 400 }
      );
    }

    // Validate event type
    const validTypes = ['exam', 'project', 'book_report', 'school_event', 'private_lesson'];
    if (!validTypes.includes(event_type)) {
      return NextResponse.json(
        { error: 'Invalid event type' },
        { status: 400 }
      );
    }

    // Create event input
    const eventInput: CreateEventInput = {
      family_id: session.user.familyId,
      created_by: session.user.id,
      title,
      description,
      event_type,
      start_date,
      start_time,
      end_time,
      is_all_day: is_all_day || false,
    };

    const event = await createEvent(eventInput);

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    console.error('Create event error:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}
