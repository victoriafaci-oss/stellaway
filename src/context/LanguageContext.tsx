import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedLanguage, TRANSLATIONS, LANGUAGE_OPTIONS, LanguageOption } from '../data/translations';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
  languageOptions: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'es',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key) => key,
  languageOptions: LANGUAGE_OPTIONS,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>('es');

  useEffect(() => {
    try {
      const validLangs: SupportedLanguage[] = ['es', 'en', 'de', 'fr', 'pt', 'it'];
      const params = new URLSearchParams(window.location.search);
      const urlLang = params.get('lang') as SupportedLanguage | null;
      if (urlLang && validLangs.includes(urlLang)) {
        setLanguageState(urlLang);
        localStorage.setItem('stellaway_language', urlLang);
        return;
      }
      const saved = localStorage.getItem('stellaway_language') as SupportedLanguage;
      if (saved && validLangs.includes(saved)) {
        setLanguageState(saved);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      document.documentElement.lang = language;
    } catch {
      // ignore
    }
  }, [language]);

  const setLanguage = (lang: SupportedLanguage) => {
    const validLangs: SupportedLanguage[] = ['es', 'en', 'de', 'fr', 'pt', 'it'];
    if (validLangs.includes(lang)) {
      setLanguageState(lang);
      try {
        localStorage.setItem('stellaway_language', lang);
        document.documentElement.lang = lang;
      } catch {
        // ignore
      }
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es');
  };

  const t = (key: string, fallback?: string): string => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS['es'];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    const esDict = TRANSLATIONS['es'];
    if (esDict && esDict[key]) {
      return esDict[key];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, languageOptions: LANGUAGE_OPTIONS }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
