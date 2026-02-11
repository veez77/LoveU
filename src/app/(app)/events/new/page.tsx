import { EventForm } from '@/components/events/EventForm';

export default function NewEventPage({
  searchParams,
}: {
  searchParams: { date?: string };
}) {
  return (
    <div className="container max-w-4xl py-8">
      <EventForm mode="create" defaultDate={searchParams.date} />
    </div>
  );
}
