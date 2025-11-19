'use client';

import { useEffect, useState } from 'react';
import { TaskWithRelations } from '@/lib/types';
import TaskList from '@/components/task-list';
import CreateTaskDialog from '@/components/create-task-dialog';
import EditTaskDialog from '@/components/edit-task-dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ListTodo } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function TasksPage() {
  const { t } = useLanguage();
  const [tasks, setTasks] = useState<TaskWithRelations[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [users, setUsers] = useState<Array<{ id: string; username: string; displayName?: string | null }>>([]);
  const [currentUser, setCurrentUser] = useState<{ id: string; username: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingTask, setEditingTask] = useState<TaskWithRelations | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'my' | 'all'>('my');

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      const data = await response.json();
      
      if (response.ok) {
        setTasks(data.tasks);
      } else {
        setError(data.error || 'Failed to load tasks');
      }
    } catch (err) {
      setError('An error occurred while loading tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      
      if (response.ok) {
        setCategories(data.categories.map((c: any) => c.name));
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      
      if (response.ok) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('/api/auth/session');
      const data = await response.json();
      if (response.ok && data.user) {
        setCurrentUser(data.user);
      }
    } catch (err) {
      console.error('Failed to load current user:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchCategories();
    fetchUsers();
    fetchCurrentUser();
  }, []);

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchTasks(); // Refresh tasks
      }
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const handleEdit = (task: TaskWithRelations) => {
    setEditingTask(task);
    setEditDialogOpen(true);
  };

  const handleDelete = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchTasks(); // Refresh tasks
      }
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  // Filter tasks based on view mode
  const filteredTasks = viewMode === 'my' && currentUser
    ? tasks.filter(task => task.assignedToId === currentUser.id)
    : tasks;

  return (
    <div className="space-y-4 md:space-y-6 px-4 md:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">{t('tasks')}</h1>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mt-1 md:mt-2">
            {t('manageTasks')}
          </p>
        </div>
        <CreateTaskDialog
          onTaskCreated={fetchTasks}
          categories={categories}
          users={users}
        />
      </div>

      {/* Tab buttons */}
      <div className="flex gap-2 border-b-2 border-indigo-100 dark:border-indigo-900 overflow-x-auto">
        <Button
          variant={viewMode === 'my' ? 'default' : 'ghost'}
          onClick={() => setViewMode('my')}
          className={`rounded-b-none whitespace-nowrap transition-all ${viewMode === 'my' ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600' : 'hover:bg-indigo-50 dark:hover:bg-indigo-950'}`}
        >
          {t('myTasks')}
        </Button>
        <Button
          variant={viewMode === 'all' ? 'default' : 'ghost'}
          onClick={() => setViewMode('all')}
          className={`rounded-b-none whitespace-nowrap transition-all ${viewMode === 'all' ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600' : 'hover:bg-indigo-50 dark:hover:bg-indigo-950'}`}
        >
          {t('allTasks')}
        </Button>
      </div>

      {filteredTasks.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>{t('noTasksYet')}</CardTitle>
            <CardDescription>{t('noTasksMessage')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
              <ListTodo className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>{t('noTasksMessage')}</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <TaskList
            tasks={filteredTasks}
            onStatusChange={handleStatusChange}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          <EditTaskDialog
            task={editingTask}
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            onTaskUpdated={fetchTasks}
            categories={categories}
            users={users}
          />
        </>
      )}
    </div>
  );
}
