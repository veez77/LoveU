import { getSession } from '@/lib/auth/session';
import { getEventsByFamily } from '@/lib/db/queries';
import { DayView } from '@/components/calendar/DayView';
import { CalendarNav } from '@/components/calendar/CalendarNav';

export default async function DayViewPage() {
  const session = await getSession();
  if (!session) {
    return null;
  }

  const events = await getEventsByFamily(session.user.familyId);

  return (
    <div className="flex flex-col h-screen">
      <CalendarNav currentView="day" />
      <DayView events={events} />
    </div>
  );
}
