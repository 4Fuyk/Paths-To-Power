/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedLanguage, translations, Translations } from './translations';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem('game_selected_language') as SupportedLanguage;
    if (saved && ['en', 'es', 'fr', 'de', 'tr'].includes(saved)) {
      return saved;
    }
    return 'en';
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('game_selected_language', lang);
  };

  useEffect(() => {
    const saved = localStorage.getItem('game_selected_language') as SupportedLanguage;
    if (saved && saved !== language && ['en', 'es', 'fr', 'de', 'tr'].includes(saved)) {
      setLanguageState(saved);
    }
  }, []);

  const currentTranslations = translations[language] || translations.en;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: currentTranslations }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      language: 'en',
      setLanguage: () => {},
      t: translations.en
    };
  }
  return context;
};
