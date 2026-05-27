import { useState, useEffect } from 'react';
import translations from './translations';

type Locale = 'es' | 'en';

let currentLocale: Locale = 'es';
const listeners = new Set<(locale: Locale) => void>();

export function useI18n() {
  const [locale, setLocaleState] = useState<Locale>(currentLocale);

  useEffect(() => {
    listeners.add(setLocaleState);
    return () => {
      listeners.delete(setLocaleState);
    };
  }, []);

  const setLocale = (newLocale: Locale) => {
    currentLocale = newLocale;
    listeners.forEach((listener) => listener(newLocale));
  };

  const t = (key: string): string => {
    const value = (translations[locale] as Record<string, string>)[key];
    return value ?? key;
  };

  return { locale, setLocale, t };
}

