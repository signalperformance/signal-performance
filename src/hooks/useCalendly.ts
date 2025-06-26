
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

// Improved body scroll lock utilities
const lockBodyScroll = () => {
  const body = document.body;
  const scrollY = window.scrollY;
  
  // Store scroll position first
  body.setAttribute('data-scroll-y', scrollY.toString());
  
  // Apply all styles atomically to prevent jumping
  body.style.position = 'fixed';
  body.style.top = `-${scrollY}px`;
  body.style.left = '0';
  body.style.right = '0';
  body.style.width = '100%';
  body.style.overflow = 'hidden';
  body.style.touchAction = 'none';
  
  // Add class AFTER position is set to prevent jump
  body.classList.add('calendly-popup-open');
};

const unlockBodyScroll = () => {
  const body = document.body;
  const scrollY = body.getAttribute('data-scroll-y');
  
  // Remove class FIRST to prevent !important conflicts
  body.classList.remove('calendly-popup-open');
  
  // Reset all inline styles
  body.style.position = '';
  body.style.top = '';
  body.style.left = '';
  body.style.right = '';
  body.style.width = '';
  body.style.overflow = '';
  body.style.touchAction = '';
  
  // Restore scroll position after styles are cleared
  if (scrollY) {
    window.scrollTo(0, parseInt(scrollY));
    body.removeAttribute('data-scroll-y');
  }
};

export const useCalendly = () => {
  const { language } = useLanguage();

  useEffect(() => {
    // Only add event listeners for mobile devices
    if (isMobileDevice() && typeof window !== 'undefined') {
      const handleCalendlyMessage = (e: MessageEvent) => {
        if (e.data && e.data.event) {
          console.log('Calendly event:', e.data.event);
          
          if (e.data.event === 'calendly.event_scheduled' || 
              e.data.event === 'calendly.popup_closed') {
            console.log('Calendly popup closed, unlocking scroll');
            unlockBodyScroll();
          }
        }
      };

      // Listen for Calendly widget events
      window.addEventListener('message', handleCalendlyMessage);

      // Cleanup function
      return () => {
        window.removeEventListener('message', handleCalendlyMessage);
        // Ensure scroll is unlocked on component unmount
        if (document.body.classList.contains('calendly-popup-open')) {
          unlockBodyScroll();
        }
      };
    }
  }, []);

  const openCalendlyPopup = () => {
    if (typeof window !== 'undefined' && window.Calendly) {
      const text = language === 'zh' ? '預約評估' : 'Book Assessment';
      
      // Apply mobile-specific handling BEFORE opening popup
      if (isMobileDevice()) {
        console.log('Opening Calendly popup on mobile device');
        lockBodyScroll();
      }
      
      // Open Calendly popup
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
