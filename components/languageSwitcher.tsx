import { useTranslation } from '@/lib/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setManualLanguage } from '@/lib/store/slices/languageSlice';

export function LanguageSwitcher() {
  const { changeLanguage, locale: currentLanguage } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Add this line to force UI update
      dispatch(setManualLanguage(localStorage.getItem('locale') || 'de'));
    }
  }, [dispatch]);

  const handleLanguageChange = (lang: string) => {
    dispatch(setManualLanguage(lang));
    changeLanguage(lang);
    // Force immediate update of translations
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="bg-white dark:bg-gray-700 rounded-l-none">
          <Globe className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => handleLanguageChange('en')}
          className={currentLanguage === 'en' ? 'bg-accent' : ''}
        >
          English
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleLanguageChange('de')}
          className={currentLanguage === 'de' ? 'bg-accent' : ''}
        >
          Deutsch
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}