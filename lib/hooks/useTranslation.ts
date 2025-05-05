'use client';

import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import de from '../i18n/translations/de.json';
import en from '../i18n/translations/en.json';
import { RootState } from '@/lib/store/store';
import { setLanguage, setManualLanguage } from '../store/slices/languageSlice';

export function useTranslation() {
  const dispatch = useDispatch();
  const currentLanguage = useSelector((state: RootState) => state.language.currentLanguage);

  useEffect(() => {
    // Sync with localStorage on mount
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('locale') || 'de';
      dispatch(setManualLanguage(savedLang));
    }
  }, [dispatch]);

  const t = useCallback(
    (key: string) => {
      const keys = key.split('.');
      let translation: any = currentLanguage === 'de' ? de : en;

      for (const k of keys) {
        if (translation === undefined) return key;
        translation = translation[k];
      }

      return translation || key;
    },
    [currentLanguage]
  );

  const currentLanguageState = useSelector((state: RootState) => state.language.currentLanguage);

  const changeLanguage = useCallback(
    (newLocale: string) => {
      dispatch(setManualLanguage(newLocale));
      if (typeof window !== 'undefined') {
        localStorage.setItem('locale', newLocale);
        localStorage.setItem('localSetByUser', 'true');
      }
    },
    [dispatch]
  );

  return {
    t,
    locale: currentLanguage,
    changeLanguage,
    isReady: true,
    currentLanguageState
  };
}