'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations, TranslationType } from '@/lib/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationType;
}

// Safe SSR default — Uzbek translations, no-op setter
const defaultValue: LanguageContextType = {
  language: 'uz',
  setLanguage: () => {},
  t: translations['uz'],
};

const LanguageContext = createContext<LanguageContextType>(defaultValue);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('uz');

  useEffect(() => {
    const storedLang = localStorage.getItem('app_language') as Language;
    if (storedLang && (storedLang === 'uz' || storedLang === 'ru' || storedLang === 'en')) {
      setLanguageState(storedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app_language', lang);
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
