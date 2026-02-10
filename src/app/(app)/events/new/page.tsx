import { EventForm } from '@/components/events/EventForm';

export default function NewEventPage() {
  return (
    <div className="container max-w-4xl py-8">
      <EventForm mode="create" />
    </div>
  );
}
