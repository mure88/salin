'use client';

import { TaskWithRelations } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, CheckCircle2, Circle, Clock, Trash2, Edit } from 'lucide-react';
import { format } from 'date-fns';

interface TaskCardProps {
  task: TaskWithRelations;
  onStatusChange?: (taskId: string, newStatus: string) => void;
  onEdit?: (task: TaskWithRelations) => void;
  onDelete?: (taskId: string) => void;
}

const priorityColors = {
  LOW: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  MEDIUM: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  HIGH: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  URGENT: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const statusColors = {
  PENDING: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  IN_PROGRESS: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  COMPLETED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export default function TaskCard({ task, onStatusChange, onEdit, onDelete }: TaskCardProps) {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'COMPLETED';

  const toggleStatus = () => {
    if (!onStatusChange) return;
    
    const nextStatus = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    onStatusChange(task.id, nextStatus);
  };

  return (
    <Card className={`transition-all hover:shadow-md ${isOverdue ? 'border-red-300 dark:border-red-700' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleStatus}
                className="h-6 w-6 p-0"
              >
                {task.status === 'COMPLETED' ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-400" />
                )}
              </Button>
              <CardTitle className={`text-lg ${task.status === 'COMPLETED' ? 'line-through text-gray-500' : ''}`}>
                {task.title}
              </CardTitle>
            </div>
            {task.description && (
              <CardDescription className="text-sm">
                {task.description}
              </CardDescription>
            )}
          </div>
          <div className="flex gap-1">
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(task)}
                className="h-8 w-8 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(task.id)}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <Badge className={priorityColors[task.priority]}>
            {task.priority}
          </Badge>
          <Badge className={statusColors[task.status]}>
            {task.status.replace('_', ' ')}
          </Badge>
          <Badge variant="outline">
            {task.category}
          </Badge>
          {task.dueDate && (
            <Badge variant="outline" className={isOverdue ? 'border-red-500 text-red-600' : ''}>
              <Calendar className="h-3 w-3 mr-1" />
              {format(new Date(task.dueDate), 'MMM d, yyyy')}
            </Badge>
          )}
          {task.assignedTo && (
            <Badge variant="outline">
              <User className="h-3 w-3 mr-1" />
              {task.assignedTo.displayName || task.assignedTo.username}
            </Badge>
          )}
          {task.isRecurring && (
            <Badge variant="outline">
              <Clock className="h-3 w-3 mr-1" />
              Recurring
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
