'use client';

import { TaskWithRelations } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, CheckCircle2, Circle, Clock, Trash2, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { useLanguage } from '@/lib/language-context';
import { translateCategory, translateStatus, translatePriority } from '@/lib/translations';

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
  const { language } = useLanguage();
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'COMPLETED';

  const toggleStatus = () => {
    if (!onStatusChange) return;
    
    const nextStatus = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    onStatusChange(task.id, nextStatus);
  };

  // Priority-based styling
  const getPriorityStyle = () => {
    if (isOverdue) {
      return 'border-l-4 border-l-red-500 bg-gradient-to-br from-red-50 to-white dark:from-red-950/30 dark:to-gray-900';
    }
    
    switch (task.priority) {
      case 'URGENT':
        return 'border-l-4 border-l-rose-500 bg-gradient-to-br from-rose-50 to-white dark:from-rose-950/30 dark:to-gray-900';
      case 'HIGH':
        return 'border-l-4 border-l-orange-500 bg-gradient-to-br from-orange-50 to-white dark:from-orange-950/30 dark:to-gray-900';
      case 'MEDIUM':
        return 'border-l-4 border-l-amber-500 bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/30 dark:to-gray-900';
      case 'LOW':
        return 'border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/30 dark:to-gray-900';
      default:
        return 'border-l-4 border-l-slate-300 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-gray-900';
    }
  };

  return (
    <Card className={`transition-all hover:shadow-lg hover:scale-[1.02] ${getPriorityStyle()}`}>
      <CardHeader className="pb-3 px-3 md:px-6 pt-4 md:pt-6">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleStatus}
                className="h-6 w-6 p-0 flex-shrink-0"
              >
                {task.status === 'COMPLETED' ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-400" />
                )}
              </Button>
              <CardTitle className={`text-base md:text-lg truncate ${task.status === 'COMPLETED' ? 'line-through text-gray-500' : ''}`}>
                {task.title}
              </CardTitle>
            </div>
            {task.description && (
              <CardDescription className="text-xs md:text-sm line-clamp-2">
                {task.description}
              </CardDescription>
            )}
          </div>
          <div className="flex gap-1 flex-shrink-0">
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
      <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
        <div className="flex flex-wrap gap-1.5 md:gap-2">
          <Badge className={`text-xs ${priorityColors[task.priority]}`}>
            {translatePriority(task.priority, language)}
          </Badge>
          <Badge className={`text-xs ${statusColors[task.status]}`}>
            {translateStatus(task.status, language)}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {translateCategory(task.category, language)}
          </Badge>
          {task.dueDate && (
            <Badge variant="outline" className={`text-xs ${isOverdue ? 'border-red-500 text-red-600' : ''}`}>
              <Calendar className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">{format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
              <span className="sm:hidden">{format(new Date(task.dueDate), 'MMM d')}</span>
            </Badge>
          )}
          {task.assignedTo && (
            <Badge variant="outline" className="text-xs">
              <User className="h-3 w-3 mr-1" />
              <span className="truncate max-w-[100px]">{task.assignedTo.displayName || task.assignedTo.username}</span>
            </Badge>
          )}
          {task.isRecurring && (
            <Badge variant="outline" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">Recurring</span>
              <span className="sm:hidden">↻</span>
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
