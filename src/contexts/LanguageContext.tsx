
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations } from '@/i18n';

type Language = 'en' | 'zh';

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Helper function to check if localStorage is available
const isLocalStorageAvailable = (): boolean => {
  try {
    return typeof window !== 'undefined' && 'localStorage' in window && window.localStorage !== null;
  } catch (error) {
    return false;
  }
};

// Helper function to get saved language from localStorage
const getSavedLanguage = (): Language => {
  if (!isLocalStorageAvailable()) {
    return 'en';
  }

  try {
    const saved = localStorage.getItem('signal-performance-language');
    if (saved === 'en' || saved === 'zh') {
      return saved;
    }
  } catch (error) {
    // Silently fail
  }
  return 'en'; // Default to English for first-time visitors
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    console.log('LanguageProvider initializing...');
    return getSavedLanguage();
  });

  // Save language preference to localStorage whenever it changes
  useEffect(() => {
    if (isLocalStorageAvailable()) {
      try {
        localStorage.setItem('signal-performance-language', language);
      } catch (error) {
        // Silently fail
      }
    }
    
    // Set data-language attribute on body for CSS font switching
    if (typeof document !== 'undefined') {
      document.body.setAttribute('data-language', language);
    }
  }, [language]);

  // Set initial data-language attribute
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.setAttribute('data-language', language);
    }
  }, []);

  const t = (key: string): string => {
    console.log('Translation called with:', key, 'language:', language);
    console.log('Available translations:', translations);
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
    console.error('useLanguage hook used outside LanguageProvider. Make sure your component is wrapped with LanguageProvider.');
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
