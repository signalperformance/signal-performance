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
  const [language, setLanguage] = useState<Language>('en');
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize language from localStorage after component mounts
  useEffect(() => {
    const savedLanguage = getSavedLanguage();
    setLanguage(savedLanguage);
    setIsInitialized(true);
  }, []);

  // Save language preference to localStorage whenever it changes
  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    if (!isLocalStorageAvailable()) {
      return;
    }

    try {
      localStorage.setItem('signal-performance-language', language);
    } catch (error) {
      // Silently fail
    }
  }, [language, isInitialized]);

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
