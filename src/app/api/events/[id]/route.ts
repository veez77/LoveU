// Events API - Get, Update, Delete specific event
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { getEventById, updateEvent, deleteEvent } from '@/lib/db/queries';
import type { UpdateEventInput, Event } from '@/types/database';

// Serialize event dates to strings for JSON response
function serializeEvent(event: any): Event {
  return {
    ...event,
    start_date: event.start_date instanceof Date
      ? event.start_date.toISOString().split('T')[0]
      : event.start_date,
  };
}

// GET /api/events/[id] - Get specific event
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const eventId = parseInt(params.id);
    if (isNaN(eventId)) {
      return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 });
    }

    const event = await getEventById(eventId);

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Verify event belongs to user's family
    if (event.family_id !== session.user.familyId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Serialize dates to strings for JSON response
    const serializedEvent = serializeEvent(event);

    return NextResponse.json({ event: serializedEvent }, { status: 200 });
  } catch (error) {
    console.error('Get event error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}

// PATCH /api/events/[id] - Update event
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const eventId = parseInt(params.id);
    if (isNaN(eventId)) {
      return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 });
    }

    // Verify event exists and belongs to user's family
    const existingEvent = await getEventById(eventId);
    if (!existingEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    if (existingEvent.family_id !== session.user.familyId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const updateInput: UpdateEventInput = {};

    // Only include fields that are provided
    if (body.title !== undefined) updateInput.title = body.title;
    if (body.description !== undefined) updateInput.description = body.description;
    if (body.event_type !== undefined) {
      const validTypes = ['exam', 'project', 'book_report', 'school_event', 'private_lesson'];
      if (!validTypes.includes(body.event_type)) {
        return NextResponse.json({ error: 'Invalid event type' }, { status: 400 });
      }
      updateInput.event_type = body.event_type;
    }
    if (body.start_date !== undefined) updateInput.start_date = body.start_date;
    if (body.start_time !== undefined) updateInput.start_time = body.start_time;
    if (body.end_time !== undefined) updateInput.end_time = body.end_time;
    if (body.is_all_day !== undefined) updateInput.is_all_day = body.is_all_day;

    const updatedEvent = await updateEvent(
      eventId,
      session.user.familyId,
      updateInput
    );

    if (!updatedEvent) {
      return NextResponse.json(
        { error: 'Failed to update event' },
        { status: 500 }
      );
    }

    // Serialize dates to strings for JSON response
    const serializedEvent = serializeEvent(updatedEvent);

    return NextResponse.json({ event: serializedEvent }, { status: 200 });
  } catch (error) {
    console.error('Update event error:', error);
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    );
  }
}

// DELETE /api/events/[id] - Delete event
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const eventId = parseInt(params.id);
    if (isNaN(eventId)) {
      return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 });
    }

    // Verify event exists and belongs to user's family
    const existingEvent = await getEventById(eventId);
    if (!existingEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    if (existingEvent.family_id !== session.user.familyId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const success = await deleteEvent(eventId, session.user.familyId);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete event' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Delete event error:', error);
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}
