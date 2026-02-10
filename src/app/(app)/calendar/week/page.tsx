import { getSession } from '@/lib/auth/session';
import { getEventsByFamily } from '@/lib/db/queries';
import { WeekView } from '@/components/calendar/WeekView';
import { CalendarNav } from '@/components/calendar/CalendarNav';

export default async function WeekViewPage() {
  const session = await getSession();
  if (!session) {
    return null;
  }

  const events = await getEventsByFamily(session.user.familyId);

  return (
    <div className="flex flex-col h-screen">
      <CalendarNav currentView="week" />
      <WeekView events={events} />
    </div>
  );
}
