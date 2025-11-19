'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, CheckCircle2, ListTodo, Clock } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

interface UserStat {
  username: string;
  displayName?: string | null;
  assignedTasks: number;
  createdTasks: number;
  completedTasks: number;
  pendingTasks: number;
}

interface UserStatsProps {
  stats: UserStat[];
}

export default function UserStats({ stats }: UserStatsProps) {
  const { t } = useLanguage();

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-gray-900">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-purple-600" />
          Käyttäjätilastot
        </CardTitle>
        <CardDescription>Perheenjäsenten tehtävätilastot</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stats.map((user) => (
            <div
              key={user.username}
              className="p-4 rounded-lg border bg-white dark:bg-gray-800/50 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                    {(user.displayName || user.username).charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{user.displayName || user.username}</p>
                    <p className="text-xs text-gray-500">@{user.username}</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="text-center p-2 rounded-md bg-blue-50 dark:bg-blue-950/30">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <ListTodo className="h-3 w-3 text-blue-600" />
                    <span className="text-xs text-blue-600 dark:text-blue-400">Vastuutettu</span>
                  </div>
                  <p className="text-lg font-bold text-blue-700 dark:text-blue-300">{user.assignedTasks}</p>
                </div>
                
                <div className="text-center p-2 rounded-md bg-purple-50 dark:bg-purple-950/30">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <ListTodo className="h-3 w-3 text-purple-600" />
                    <span className="text-xs text-purple-600 dark:text-purple-400">Luotu</span>
                  </div>
                  <p className="text-lg font-bold text-purple-700 dark:text-purple-300">{user.createdTasks}</p>
                </div>
                
                <div className="text-center p-2 rounded-md bg-green-50 dark:bg-green-950/30">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <CheckCircle2 className="h-3 w-3 text-green-600" />
                    <span className="text-xs text-green-600 dark:text-green-400">Valmis</span>
                  </div>
                  <p className="text-lg font-bold text-green-700 dark:text-green-300">{user.completedTasks}</p>
                </div>
                
                <div className="text-center p-2 rounded-md bg-amber-50 dark:bg-amber-950/30">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Clock className="h-3 w-3 text-amber-600" />
                    <span className="text-xs text-amber-600 dark:text-amber-400">Kesken</span>
                  </div>
                  <p className="text-lg font-bold text-amber-700 dark:text-amber-300">{user.pendingTasks}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
