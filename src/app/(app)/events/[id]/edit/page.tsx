import { notFound } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { getEventById } from '@/lib/db/queries';
import { EventForm } from '@/components/events/EventForm';

export default async function EditEventPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();
  if (!session) {
    notFound();
  }

  const eventId = parseInt(params.id);
  if (isNaN(eventId)) {
    notFound();
  }

  const event = await getEventById(eventId);

  if (!event || event.family_id !== session.user.familyId) {
    notFound();
  }

  return (
    <div className="container max-w-4xl py-8">
      <EventForm event={event} mode="edit" />
    </div>
  );
}
