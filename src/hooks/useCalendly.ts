
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

// Enhanced scroll lock utilities
const lockBodyScroll = () => {
  const body = document.body;
  const scrollY = window.scrollY;
  
  console.log('Locking scroll at position:', scrollY);
  
  // Store scroll position first
  body.setAttribute('data-scroll-y', scrollY.toString());
  
  // Apply styles and class together
  body.style.position = 'fixed';
  body.style.top = `-${scrollY}px`;
  body.style.left = '0';
  body.style.right = '0';
  body.style.width = '100%';
  body.style.overflow = 'hidden';
  body.style.touchAction = 'none';
  body.classList.add('calendly-popup-open');
};

const unlockBodyScroll = () => {
  const body = document.body;
  const scrollY = body.getAttribute('data-scroll-y');
  
  console.log('Unlocking scroll, restoring to position:', scrollY);
  
  // Remove class first to prevent CSS conflicts
  body.classList.remove('calendly-popup-open');
  
  // Reset all inline styles
  body.style.position = '';
  body.style.top = '';
  body.style.left = '';
  body.style.right = '';
  body.style.width = '';
  body.style.overflow = '';
  body.style.touchAction = '';
  
  // Restore scroll position
  if (scrollY) {
    window.scrollTo(0, parseInt(scrollY));
    body.removeAttribute('data-scroll-y');
  }
};

// Check if Calendly popup is currently open
const isCalendlyPopupOpen = () => {
  return document.querySelector('.calendly-overlay') !== null ||
         document.querySelector('[data-url*="calendly"]') !== null ||
         document.body.classList.contains('calendly-popup-open');
};

export const useCalendly = () => {
  const { language } = useLanguage();

  useEffect(() => {
    if (isMobileDevice() && typeof window !== 'undefined') {
      let popupCheckInterval: NodeJS.Timeout | null = null;
      let isPopupCurrentlyOpen = false;

      const handleCalendlyMessage = (e: MessageEvent) => {
        if (e.data && e.data.event) {
          console.log('Calendly event received:', e.data.event);
          
          // Handle popup opening events
          if (e.data.event === 'calendly.profile_page_viewed' || 
              e.data.event === 'calendly.page_height_changed') {
            if (!isPopupCurrentlyOpen) {
              console.log('Calendly popup opened');
              isPopupCurrentlyOpen = true;
              lockBodyScroll();
              
              // Start periodic check for popup closure
              if (popupCheckInterval) clearInterval(popupCheckInterval);
              popupCheckInterval = setInterval(() => {
                if (!isCalendlyPopupOpen()) {
                  console.log('Calendly popup detected as closed via periodic check');
                  isPopupCurrentlyOpen = false;
                  unlockBodyScroll();
                  if (popupCheckInterval) {
                    clearInterval(popupCheckInterval);
                    popupCheckInterval = null;
                  }
                }
              }, 500);
            }
          }
          
          // Handle popup closing events
          if (e.data.event === 'calendly.popup_closed' || 
              e.data.event === 'calendly.event_scheduled') {
            console.log('Calendly popup closed via event');
            isPopupCurrentlyOpen = false;
            unlockBodyScroll();
            if (popupCheckInterval) {
              clearInterval(popupCheckInterval);
              popupCheckInterval = null;
            }
          }
        }
      };

      // Handle escape key press
      const handleEscapeKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && isPopupCurrentlyOpen) {
          console.log('Escape key pressed, checking if popup is closed');
          setTimeout(() => {
            if (!isCalendlyPopupOpen()) {
              console.log('Popup closed via escape key');
              isPopupCurrentlyOpen = false;
              unlockBodyScroll();
              if (popupCheckInterval) {
                clearInterval(popupCheckInterval);
                popupCheckInterval = null;
              }
            }
          }, 100);
        }
      };

      // Handle clicks outside popup area
      const handleDocumentClick = (e: MouseEvent) => {
        if (isPopupCurrentlyOpen) {
          const target = e.target as Element;
          const isCalendlyElement = target.closest('.calendly-overlay') || 
                                  target.closest('[data-url*="calendly"]');
          
          if (!isCalendlyElement) {
            setTimeout(() => {
              if (!isCalendlyPopupOpen()) {
                console.log('Popup closed via outside click');
                isPopupCurrentlyOpen = false;
                unlockBodyScroll();
                if (popupCheckInterval) {
                  clearInterval(popupCheckInterval);
                  popupCheckInterval = null;
                }
              }
            }, 100);
          }
        }
      };

      // Add event listeners
      window.addEventListener('message', handleCalendlyMessage);
      document.addEventListener('keydown', handleEscapeKey);
      document.addEventListener('click', handleDocumentClick);

      // Cleanup function
      return () => {
        window.removeEventListener('message', handleCalendlyMessage);
        document.removeEventListener('keydown', handleEscapeKey);
        document.removeEventListener('click', handleDocumentClick);
        
        if (popupCheckInterval) {
          clearInterval(popupCheckInterval);
        }
        
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
      
      console.log('Opening Calendly popup');
      
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
