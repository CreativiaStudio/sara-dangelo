'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import itDictionary from './it.json';
import enDictionary from './en.json';

export type Language = 'it' | 'en';

export type Translations = typeof itDictionary;

export interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  isEn: boolean;
  isIt: boolean;
}

const STORAGE_KEY = 'sda_lang';
const DEFAULT_LANGUAGE: Language = 'it';

const dictionaries: Record<Language, Translations> = {
  it: itDictionary,
  en: enDictionary as Translations,
};

function isLanguage(value: string | null): value is Language {
  return value === 'it' || value === 'en';
}

export const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);

  // Al mount sul client: legge la lingua salvata (default 'it').
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isLanguage(stored)) {
      setLanguageState(stored);
    }
  }, []);

  // Mantiene l'attributo lang del documento sincronizzato con lo stato.
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    window.localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      t: dictionaries[language],
      isEn: language === 'en',
      isIt: language === 'it',
    }),
    [language, setLanguage],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);

  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }

  return context;
}
