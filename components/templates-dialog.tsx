'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/lib/language-context';
import { BookTemplate, Calendar, User, Award } from 'lucide-react';

interface TemplateTask {
  id: string;
  title: string;
  titleFi: string | null;
  description: string | null;
  descriptionFi: string | null;
  category: string;
  priority: string;
  points: number;
  order: number;
  dependsOnOrder: number | null;
}

interface Template {
  id: string;
  name: string;
  nameFi: string | null;
  description: string | null;
  descriptionFi: string | null;
  category: string;
  icon: string | null;
  isSystem: boolean;
  templateTasks: TemplateTask[];
}

interface TemplatesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  users: Array<{ id: string; username: string; displayName: string | null }>;
  onTemplateUsed: () => void;
}

export default function TemplatesDialog({
  open,
  onOpenChange,
  users,
  onTemplateUsed,
}: TemplatesDialogProps) {
  const { language, t } = useLanguage();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [assignedToId, setAssignedToId] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      fetchTemplates();
    }
  }, [open]);

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/templates');
      if (response.ok) {
        const data = await response.json();
        setTemplates(data.templates);
      }
    } catch (err) {
      console.error('Failed to fetch templates:', err);
    }
  };

  const handleUseTemplate = async () => {
    if (!selectedTemplate) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/templates/${selectedTemplate.id}/use`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignedToId: assignedToId || undefined,
          dueDate: dueDate || undefined,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        onTemplateUsed();
        onOpenChange(false);
        setSelectedTemplate(null);
        setAssignedToId('');
        setDueDate('');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to create tasks from template');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getTemplateName = (template: Template) => {
    return language === 'fi' && template.nameFi ? template.nameFi : template.name;
  };

  const getTemplateDescription = (template: Template) => {
    return language === 'fi' && template.descriptionFi
      ? template.descriptionFi
      : template.description;
  };

  const getTaskTitle = (task: TemplateTask) => {
    return language === 'fi' && task.titleFi ? task.titleFi : task.title;
  };

  const totalPoints = selectedTemplate
    ? selectedTemplate.templateTasks.reduce((sum, task) => sum + task.points, 0)
    : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookTemplate className="h-5 w-5" />
            {language === 'fi' ? 'Rutiinimallit' : 'Routine Templates'}
          </DialogTitle>
          <DialogDescription>
            {language === 'fi'
              ? 'Valitse valmis malli luodaksesi useita tehtäviä kerralla'
              : 'Choose a pre-built template to create multiple tasks at once'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Template List */}
          <div className="space-y-2">
            <Label>{language === 'fi' ? 'Valitse malli' : 'Select Template'}</Label>
            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedTemplate?.id === template.id
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{template.icon || '📋'}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">
                        {getTemplateName(template)}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {getTemplateDescription(template)}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <span>{template.templateTasks.length} {language === 'fi' ? 'tehtävää' : 'tasks'}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Award className="h-3 w-3" />
                          {template.templateTasks.reduce((sum, t) => sum + t.points, 0)} {language === 'fi' ? 'pistettä' : 'points'}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Template Details & Options */}
          <div className="space-y-4">
            {selectedTemplate ? (
              <>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-3xl">{selectedTemplate.icon || '📋'}</span>
                    <div>
                      <h3 className="font-bold">{getTemplateName(selectedTemplate)}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {getTemplateDescription(selectedTemplate)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedTemplate.templateTasks.map((task, index) => (
                      <div
                        key={task.id}
                        className="flex items-start gap-2 text-sm bg-white dark:bg-gray-900 p-2 rounded"
                      >
                        <span className="text-gray-400 font-mono text-xs mt-0.5">
                          {index + 1}.
                        </span>
                        <div className="flex-1">
                          <div className="font-medium">{getTaskTitle(task)}</div>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                            <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">
                              {task.category}
                            </span>
                            <span className="flex items-center gap-1">
                              <Award className="h-3 w-3" />
                              {task.points}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 pt-3 border-t flex items-center justify-between text-sm">
                    <span className="font-semibold">
                      {language === 'fi' ? 'Yhteensä' : 'Total'}:
                    </span>
                    <span className="flex items-center gap-1 font-bold text-indigo-600">
                      <Award className="h-4 w-4" />
                      {totalPoints} {language === 'fi' ? 'pistettä' : 'points'}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {t('assignTo')} ({language === 'fi' ? 'valinnainen' : 'optional'})
                    </Label>
                    <Select value={assignedToId} onValueChange={setAssignedToId}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('selectUser')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">{t('unassigned')}</SelectItem>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.displayName || user.username}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {language === 'fi' ? 'Aloituspäivä' : 'Start Date'} ({language === 'fi' ? 'valinnainen' : 'optional'})
                    </Label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
                    />
                    <p className="text-xs text-gray-500">
                      {language === 'fi'
                        ? 'Tehtävät luodaan peräkkäisille päiville'
                        : 'Tasks will be created on consecutive days'}
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
                    {error}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    disabled={loading}
                    className="w-full sm:w-auto"
                  >
                    {t('cancel')}
                  </Button>
                  <Button
                    onClick={handleUseTemplate}
                    disabled={loading}
                    className="w-full sm:flex-1"
                  >
                    {loading
                      ? (language === 'fi' ? 'Luodaan...' : 'Creating...')
                      : (language === 'fi'
                          ? `Luo ${selectedTemplate.templateTasks.length} tehtävää`
                          : `Create ${selectedTemplate.templateTasks.length} Tasks`)}
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <p>{language === 'fi' ? 'Valitse malli vasemmalta' : 'Select a template from the left'}</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
