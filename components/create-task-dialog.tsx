'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Camera, Image as ImageIcon, X } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { translateCategory } from '@/lib/translations';

interface CreateTaskDialogProps {
  onTaskCreated?: () => void;
  categories?: string[];
  users?: Array<{ id: string; username: string; displayName?: string | null }>;
}

export default function CreateTaskDialog({ onTaskCreated, categories = [], users = [] }: CreateTaskDialogProps) {
  const { t, language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'MEDIUM',
    dueDate: '',
    assignedToId: '',
    imageUrl: '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData({ ...formData, imageUrl: base64String });
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, imageUrl: '' });
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          dueDate: formData.dueDate || undefined,
          assignedToId: formData.assignedToId || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create task');
        return;
      }

      // Reset form and close dialog
      setFormData({
        title: '',
        description: '',
        category: '',
        priority: 'MEDIUM',
        dueDate: '',
        assignedToId: '',
        imageUrl: '',
      });
      setImagePreview(null);
      setOpen(false);
      
      // Notify parent component
      if (onTaskCreated) {
        onTaskCreated();
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all">
          <Plus className="h-4 w-4 mr-2" />
          {t('newTask')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('createNewTask')}</DialogTitle>
          <DialogDescription>
            {t('addNewTask')}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t('title')} *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              disabled={loading}
              placeholder="e.g., Pick up kids from school"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t('description')}</Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={loading}
              placeholder="Add more details..."
              className="w-full min-h-[80px] px-3 py-2 text-sm rounded-md border border-input bg-background"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">{t('category')} *</Label>
              <Select
                value={formData.category || undefined}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                required
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('category')} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{translateCategory(cat, language)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">{t('priority')}</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value })}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">{t('low')}</SelectItem>
                  <SelectItem value="MEDIUM">{t('medium')}</SelectItem>
                  <SelectItem value="HIGH">{t('high')}</SelectItem>
                  <SelectItem value="URGENT">{t('urgent')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate">{t('dueDate')}</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignedTo">{t('assignTo')}</Label>
              <Select
                value={formData.assignedToId || undefined}
                onValueChange={(value) => setFormData({ ...formData, assignedToId: value })}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('unassigned')} />
                </SelectTrigger>
                <SelectContent>
                  {users.map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.displayName || user.username}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Kuva (valinnainen)</Label>
            <div className="flex gap-2">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageChange}
                className="hidden"
                id="camera-input"
                disabled={loading}
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="gallery-input"
                disabled={loading}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('camera-input')?.click()}
                disabled={loading}
                className="flex-1"
              >
                <Camera className="h-4 w-4 mr-2" />
                Kamera
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('gallery-input')?.click()}
                disabled={loading}
                className="flex-1"
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Galleria
              </Button>
            </div>
            
            {imagePreview && (
              <div className="relative mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={removeImage}
                  className="absolute top-2 right-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {error && (
            <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              {t('cancel')}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? t('creating') : t('createTask')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
