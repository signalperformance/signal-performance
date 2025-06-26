
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

// Mobile detection utility
const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
         (window.innerWidth <= 768);
};

// Body scroll lock utilities
const lockBodyScroll = () => {
  const body = document.body;
  const scrollY = window.scrollY;
  
  body.style.position = 'fixed';
  body.style.top = `-${scrollY}px`;
  body.style.left = '0';
  body.style.right = '0';
  body.style.overflow = 'hidden';
  body.style.touchAction = 'none';
  
  // Store scroll position
  body.setAttribute('data-scroll-y', scrollY.toString());
};

const unlockBodyScroll = () => {
  const body = document.body;
  const scrollY = body.getAttribute('data-scroll-y');
  
  body.style.position = '';
  body.style.top = '';
  body.style.left = '';
  body.style.right = '';
  body.style.overflow = '';
  body.style.touchAction = '';
  
  if (scrollY) {
    window.scrollTo(0, parseInt(scrollY));
    body.removeAttribute('data-scroll-y');
  }
};

export const useCalendly = () => {
  const { language } = useLanguage();

  useEffect(() => {
    // Listen for Calendly events if mobile
    if (isMobileDevice() && typeof window !== 'undefined') {
      const handleCalendlyOpen = () => {
        console.log('Calendly popup opened on mobile');
        lockBodyScroll();
        document.body.classList.add('calendly-popup-open');
      };

      const handleCalendlyClose = () => {
        console.log('Calendly popup closed on mobile');
        unlockBodyScroll();
        document.body.classList.remove('calendly-popup-open');
      };

      // Listen for Calendly widget events
      window.addEventListener('message', (e) => {
        if (e.data && e.data.event) {
          if (e.data.event === 'calendly.event_scheduled' || 
              e.data.event === 'calendly.popup_closed') {
            handleCalendlyClose();
          }
        }
      });

      // Cleanup
      return () => {
        window.removeEventListener('message', handleCalendlyClose);
        document.body.classList.remove('calendly-popup-open');
        unlockBodyScroll();
      };
    }
  }, []);

  const openCalendlyPopup = () => {
    if (typeof window !== 'undefined' && window.Calendly) {
      const text = language === 'zh' ? '預約評估' : 'Book Assessment';
      
      // Apply mobile-specific handling
      if (isMobileDevice()) {
        console.log('Opening Calendly popup on mobile device');
        
        // Add mobile class and lock scroll immediately
        document.body.classList.add('calendly-popup-open');
        
        // Small delay to ensure DOM is ready
        setTimeout(() => {
          lockBodyScroll();
        }, 100);
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
