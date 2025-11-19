'use client';

import { useEffect, useState } from 'react';
import { TaskWithRelations } from '@/lib/types';
import TaskList from '@/components/task-list';
import CreateTaskDialog from '@/components/create-task-dialog';
import EditTaskDialog from '@/components/edit-task-dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ListTodo } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function TasksPage() {
  const { t } = useLanguage();
  const [tasks, setTasks] = useState<TaskWithRelations[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [users, setUsers] = useState<Array<{ id: string; username: string; displayName?: string | null }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingTask, setEditingTask] = useState<TaskWithRelations | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

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

  useEffect(() => {
    fetchTasks();
    fetchCategories();
    fetchUsers();
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t('tasks')}</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            {t('manageTasks')}
          </p>
        </div>
        <CreateTaskDialog
          onTaskCreated={fetchTasks}
          categories={categories}
          users={users}
        />
      </div>

      {tasks.length === 0 ? (
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
            tasks={tasks}
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
