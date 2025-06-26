
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

const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
    || window.innerWidth <= 768;
};

const lockBodyScroll = () => {
  const body = document.body;
  const scrollY = window.scrollY;
  
  body.style.position = 'fixed';
  body.style.top = `-${scrollY}px`;
  body.style.width = '100%';
  body.style.overflow = 'hidden';
  
  // Store scroll position
  body.dataset.scrollY = scrollY.toString();
};

const unlockBodyScroll = () => {
  const body = document.body;
  const scrollY = body.dataset.scrollY;
  
  body.style.position = '';
  body.style.top = '';
  body.style.width = '';
  body.style.overflow = '';
  
  if (scrollY) {
    window.scrollTo(0, parseInt(scrollY));
    delete body.dataset.scrollY;
  }
};

export const useCalendly = () => {
  const { language } = useLanguage();

  useEffect(() => {
    // Listen for Calendly events to manage body scroll
    const handleCalendlyEvent = (e: MessageEvent) => {
      if (e.data.type === 'calendly.event_type_viewed' || e.data.type === 'calendly.profile_page_viewed') {
        if (isMobileDevice()) {
          lockBodyScroll();
        }
      } else if (e.data.type === 'calendly.close_overlay') {
        if (isMobileDevice()) {
          unlockBodyScroll();
        }
      }
    };

    window.addEventListener('message', handleCalendlyEvent);
    
    return () => {
      window.removeEventListener('message', handleCalendlyEvent);
    };
  }, []);

  const openCalendlyPopup = () => {
    if (typeof window !== 'undefined' && window.Calendly) {
      const text = language === 'zh' ? '預約評估' : 'Book Assessment';
      
      // Add viewport meta tag to prevent zoom on mobile
      if (isMobileDevice()) {
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
          viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
        }
      }
      
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
