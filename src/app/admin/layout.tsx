import { redirect } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import MobileTopBar from '@/components/MobileTopBar';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }
  if (user.role !== 'admin') {
    redirect('/student');
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar role="admin" name={user.name} />
      <MobileTopBar role="admin" name={user.name} />
      <main className="lg:mr-64">
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
