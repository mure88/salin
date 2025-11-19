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
    <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4 md:gap-8">
            <Link href="/dashboard" className="flex items-center gap-2 group">
              <div className="bg-white rounded-lg p-2 shadow-md group-hover:shadow-xl transition-all">
                <Home className="w-5 h-5 text-indigo-600" />
              </div>
              <span className="text-lg md:text-xl font-bold text-white hidden sm:inline">Salin Family</span>
            </Link>
            <div className="flex items-center gap-2">
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 text-white hover:bg-white/20 hover:text-white transition-all"
                >
                  <Home className="w-4 h-4" />
                  <span className="hidden md:inline">{t('dashboard')}</span>
                </Button>
              </Link>
              <Link href="/dashboard/tasks">
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 text-white hover:bg-white/20 hover:text-white transition-all"
                >
                  <ListTodo className="w-4 h-4" />
                  <span className="hidden md:inline">{t('tasks')}</span>
                </Button>
              </Link>
              {session.role === 'ADMIN' && (
                <Link href="/dashboard/admin">
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 text-white hover:bg-white/20 hover:text-white transition-all"
                  >
                    <Users className="w-4 h-4" />
                    <span className="hidden md:inline">{t('users')}</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <LanguageSwitcher />
            <span className="text-sm text-white font-medium hidden md:inline">
              {session.username}
              {session.role === 'ADMIN' && (
                <span className="ml-2 text-xs bg-white/20 text-white px-2 py-1 rounded">
                  {t('admin')}
                </span>
              )}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2 text-white hover:bg-white/20 hover:text-white"
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
