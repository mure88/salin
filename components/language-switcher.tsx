'use client';

import { useLanguage } from '@/lib/language-context';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'fi' : 'en');
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2"
      title={language === 'en' ? 'Switch to Finnish' : 'Vaihda englanniksi'}
    >
      <Languages className="h-4 w-4" />
      <span className="font-medium">{language === 'en' ? 'FI' : 'EN'}</span>
    </Button>
  );
}
