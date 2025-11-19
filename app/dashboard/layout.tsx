import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import DashboardNav from '@/components/dashboard-nav';
import { LanguageProvider } from '@/lib/language-context';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <DashboardNav session={session} />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </div>
    </LanguageProvider>
  );
}
