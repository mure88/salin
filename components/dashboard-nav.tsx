'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { SessionPayload } from '@/lib/auth';
import { LogOut, Home, Users, Settings, ListTodo } from 'lucide-react';
import Link from 'next/link';
import LanguageSwitcher from './language-switcher';
import { useLanguage } from '@/lib/language-context';

interface DashboardNavProps {
  session: SessionPayload;
}

export default function DashboardNav({ session }: DashboardNavProps) {
  const router = useRouter();
  const { t } = useLanguage();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  return (
    <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="text-xl font-bold text-slate-900 dark:text-white">
              Salin Family
            </Link>
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <Home className="w-4 h-4" />
                {t('dashboard')}
              </Link>
              <Link
                href="/dashboard/tasks"
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <ListTodo className="w-4 h-4" />
                {t('tasks')}
              </Link>
              {session.role === 'ADMIN' && (
                <Link
                  href="/dashboard/admin"
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <Users className="w-4 h-4" />
                  {t('users')}
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {session.username}
              {session.role === 'ADMIN' && (
                <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                  {t('admin')}
                </span>
              )}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              {t('logout')}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
