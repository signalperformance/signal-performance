
import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

declare global {
  interface Window {
    Calendly: {
      initPopupWidget: (options: {
        url: string;
        text?: string;
        color?: string;
        textColor?: string;
      }) => void;
    };
  }
}

export const useCalendly = () => {
  const { language } = useLanguage();

  const openCalendlyPopup = () => {
    if (typeof window !== 'undefined' && window.Calendly) {
      const text = language === 'zh' ? '預約評估' : 'Book Assessment';
      
      window.Calendly.initPopupWidget({
        url: 'https://calendly.com/noah-signalperformance/assessment',
        text: text,
        color: '#c8ab70',
        textColor: '#ffffff'
      });
    }
  };

  return {
    openCalendlyPopup
  };
};
