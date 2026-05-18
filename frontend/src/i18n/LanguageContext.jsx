import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { languages, translations } from './translations';

const LanguageContext = createContext(null);
const defaultLanguage = 'en';

const getNestedValue = (source, path) => path.split('.').reduce((current, key) => current?.[key], source);

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => localStorage.getItem('rentspot-language') || defaultLanguage);
  const currentLanguage = languages.find((item) => item.code === language) || languages[0];

  useEffect(() => {
    localStorage.setItem('rentspot-language', currentLanguage.code);
    document.documentElement.lang = currentLanguage.code;
    document.documentElement.dir = currentLanguage.dir;
  }, [currentLanguage]);

  const value = useMemo(() => ({
    language: currentLanguage.code,
    languageMeta: currentLanguage,
    languages,
    setLanguage: (nextLanguage) => {
      if (translations[nextLanguage]) setLanguageState(nextLanguage);
    },
    t: (key) => getNestedValue(translations[currentLanguage.code], key) || getNestedValue(translations[defaultLanguage], key) || key,
  }), [currentLanguage]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useLanguage must be used inside LanguageProvider');
  }

  return context;
}
