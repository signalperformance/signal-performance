
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations } from '@/i18n';

type Language = 'en' | 'zh';

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Helper function to get saved language from localStorage
const getSavedLanguage = (): Language => {
  // Guard against SSR environments where `window` is not defined
  if (typeof window === 'undefined') {
    return 'en';
  }

  try {
    const saved = localStorage.getItem('signal-performance-language');
    if (saved === 'en' || saved === 'zh') {
      return saved;
    }
  } catch (error) {
    // Fails silently if localStorage is not available (e.g., private browsing)
  }
  return 'en'; // Default to English
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Initialize state directly from localStorage using a lazy initializer.
  // This function is only called on the initial render.
  const [language, setLanguage] = useState<Language>(getSavedLanguage);

  // Save language preference to localStorage whenever it changes
  useEffect(() => {
    if (typeof window === 'undefined') {
      try {
        localStorage.setItem('signal-performance-language', language);
      } catch (error) {
        // Fails silently if localStorage is not available
      }
    }
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
