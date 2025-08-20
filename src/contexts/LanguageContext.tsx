import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations } from '@/i18n';

type Language = 'en' | 'zh';

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
};

// Create context with a default value instead of undefined
const defaultContextValue: LanguageContextType = {
  language: 'zh',
  setLanguage: () => {},
  t: (key: string) => key
};

const LanguageContext = createContext<LanguageContextType>(defaultContextValue);

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
    return 'zh';
  }

  try {
    const saved = localStorage.getItem('signal-performance-language');
    if (saved === 'en' || saved === 'zh') {
      return saved;
    }
  } catch (error) {
    // Silently fail
  }
  return 'zh'; // Default to Chinese for first-time visitors
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Initialize synchronously to prevent flash
    const savedLang = getSavedLanguage();
    // Set data-language immediately if possible
    if (typeof document !== 'undefined') {
      document.body.setAttribute('data-language', savedLang);
    }
    return savedLang;
  });
  const [isInitialized, setIsInitialized] = useState(true); // Start as initialized

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

  // Ensure data-language attribute is set on mount (backup)
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.setAttribute('data-language', language);
    }
  }, []);

  const t = (key: string): string => {
    try {
      const translation = translations[language]?.[key as keyof typeof translations[typeof language]];
      return translation || key;
    } catch (error) {
      console.warn(`Translation error for key "${key}":`, error);
      return key;
    }
  };

  const contextValue: LanguageContextType = {
    language,
    setLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  
  // Since we now provide a default value, context should never be undefined
  // But we'll add extra safety checks just in case
  if (!context) {
    console.error('useLanguage hook called but context is null. Using fallback values.');
    return defaultContextValue;
  }
  
  return context;
};