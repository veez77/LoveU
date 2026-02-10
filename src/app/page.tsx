import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';

export default async function HomePage() {
  // Check if user is authenticated
  const session = await getSession();

  if (session) {
    // Redirect to calendar if authenticated
    redirect('/calendar');
  } else {
    // Redirect to login if not authenticated
    redirect('/login');
  }
}
