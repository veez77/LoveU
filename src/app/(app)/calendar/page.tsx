import { getSession } from '@/lib/auth/session';
import { getEventsByFamily } from '@/lib/db/queries';
import { MonthView } from '@/components/calendar/MonthView';
import { CalendarNav } from '@/components/calendar/CalendarNav';

export default async function CalendarPage() {
  const session = await getSession();
  if (!session) {
    return null; // Middleware will redirect
  }

  // Fetch all events for the family
  const events = await getEventsByFamily(session.user.familyId);

  return (
    <div className="flex flex-col h-screen">
      <CalendarNav currentView="month" />
      <MonthView events={events} />
    </div>
  );
}
