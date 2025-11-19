'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Clock, AlertCircle, ListTodo, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { format } from 'date-fns';
import { useLanguage } from '@/lib/language-context';

interface DashboardContentProps {
  username: string;
  stats: {
    totalTasks: number;
    activeTasks: number;
    completedTasks: number;
    urgentTasks: number;
    todayTasks: number;
    overdueTasks: number;
  };
  recentTasks: any[];
}

export default function DashboardContent({ username, stats, recentTasks }: DashboardContentProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 md:space-y-8 px-4 md:px-0">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
          {t('welcomeBack')}, {username}!
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          {t('happeningToday')}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-400 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 md:px-6 pt-4 md:pt-6">
            <CardTitle className="text-xs md:text-sm font-medium text-blue-900 dark:text-blue-100">{t('totalTasks')}</CardTitle>
            <ListTodo className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent className="px-4 md:px-6 pb-4 md:pb-6">
            <div className="text-xl md:text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.totalTasks}</div>
            <p className="text-xs text-blue-600/70 dark:text-blue-400/70 truncate">
              {stats.activeTasks} {t('active')}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-400 bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/20 dark:to-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 md:px-6 pt-4 md:pt-6">
            <CardTitle className="text-xs md:text-sm font-medium text-amber-900 dark:text-amber-100">{t('today')}</CardTitle>
            <Calendar className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </CardHeader>
          <CardContent className="px-4 md:px-6 pb-4 md:pb-6">
            <div className="text-xl md:text-2xl font-bold text-amber-700 dark:text-amber-300">{stats.todayTasks}</div>
            <p className="text-xs text-amber-600/70 dark:text-amber-400/70 truncate">
              {stats.overdueTasks > 0 && `${stats.overdueTasks} ${t('overdue')}`}
              {stats.overdueTasks === 0 && t('noOverdue')}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-400 bg-gradient-to-br from-green-50 to-white dark:from-green-950/20 dark:to-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 md:px-6 pt-4 md:pt-6">
            <CardTitle className="text-xs md:text-sm font-medium text-green-900 dark:text-green-100">{t('completed')}</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent className="px-4 md:px-6 pb-4 md:pb-6">
            <div className="text-xl md:text-2xl font-bold text-green-700 dark:text-green-300">{stats.completedTasks}</div>
            <p className="text-xs text-green-600/70 dark:text-green-400/70 truncate">
              {stats.totalTasks > 0
                ? `${Math.round((stats.completedTasks / stats.totalTasks) * 100)}% ${t('completion')}`
                : t('noTasksYet')}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-rose-400 bg-gradient-to-br from-rose-50 to-white dark:from-rose-950/20 dark:to-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 md:px-6 pt-4 md:pt-6">
            <CardTitle className="text-xs md:text-sm font-medium text-rose-900 dark:text-rose-100">{t('urgent')}</CardTitle>
            <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400" />
          </CardHeader>
          <CardContent className="px-4 md:px-6 pb-4 md:pb-6">
            <div className="text-xl md:text-2xl font-bold text-rose-700 dark:text-rose-300">{stats.urgentTasks}</div>
            <p className="text-xs text-muted-foreground">{t('highPriority')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tasks */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t('recentTasks')}</CardTitle>
            <CardDescription>{t('latestTasks')}</CardDescription>
          </div>
          <Link href="/dashboard/tasks">
            <Button variant="outline" size="sm">
              {t('viewAll')}
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentTasks.length === 0 ? (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
              <ListTodo className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>{t('noTasksMessage')}</p>
              <Link href="/dashboard/tasks">
                <Button className="mt-4">{t('createTask')}</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTasks.map((task: any) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <div className="flex-1">
                    <p className="font-medium">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-600 dark:text-slate-400">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700">
                        {task.category}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700">
                        {task.priority}
                      </span>
                      {task.dueDate && (
                        <span>{t('due')}: {format(new Date(task.dueDate), 'MMM d')}</span>
                      )}
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      task.status === 'COMPLETED'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
