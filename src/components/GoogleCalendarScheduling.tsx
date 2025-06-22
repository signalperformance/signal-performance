
import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';

interface GoogleCalendarSchedulingProps {
  children: React.ReactNode;
}

declare global {
  interface Window {
    calendar: {
      schedulingButton: {
        load: (config: {
          url: string;
          color: string;
          label: string;
          target: HTMLElement;
        }) => void;
      };
    };
  }
}

const GoogleCalendarScheduling = ({ children }: GoogleCalendarSchedulingProps) => {
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeScheduling = () => {
      if (window.calendar && window.calendar.schedulingButton && targetRef.current) {
        console.log('🗓️ Initializing Google Calendar scheduling...');
        
        // Clear any existing buttons first
        targetRef.current.innerHTML = '';
        
        window.calendar.schedulingButton.load({
          url: 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ0jnzzZw7z7Iwpdi24B5bFkJrr78-BVkS3GztoZgLiiP-3Uwevn0_rTk5CDgtDL_dyd2fYc4FZZ?gv=true',
          color: '#c8ab70',
          label: 'Book an appointment',
          target: targetRef.current,
        });

        // Apply custom styling with multiple attempts and better targeting
        const applyCustomStyling = () => {
          const buttons = targetRef.current?.querySelectorAll('button');
          console.log('🎨 Found buttons:', buttons?.length || 0);
          
          if (buttons && buttons.length > 0) {
            buttons.forEach((button, index) => {
              console.log(`🎨 Styling button ${index + 1}`);
              // Apply Inter font family and white text color with !important
              button.style.setProperty('font-family', 'Inter, sans-serif', 'important');
              button.style.setProperty('color', '#FFFFFF', 'important');
              button.style.setProperty('font-weight', '500', 'important');
              button.style.setProperty('font-size', '16px', 'important');
              button.style.setProperty('background-color', '#c8ab70', 'important');
              button.style.setProperty('border', 'none', 'important');
              button.style.setProperty('border-radius', '6px', 'important');
              button.style.setProperty('padding', '12px 24px', 'important');
            });
            console.log('✅ Applied custom styling to Google Calendar buttons');
          } else {
            console.log('⏳ No buttons found yet, retrying styling...');
            setTimeout(applyCustomStyling, 100);
          }
        };

        // Try styling immediately and then after a delay
        setTimeout(applyCustomStyling, 100);
        setTimeout(applyCustomStyling, 500);
        setTimeout(applyCustomStyling, 1000);
      } else {
        console.log('⏳ Google Calendar scheduling not ready, retrying...');
        setTimeout(initializeScheduling, 100);
      }
    };

    // Wait for window load and scripts to be ready
    if (document.readyState === 'complete') {
      initializeScheduling();
    } else {
      window.addEventListener('load', initializeScheduling);
      return () => window.removeEventListener('load', initializeScheduling);
    }
  }, []);

  return (
    <div ref={targetRef}>
      {children}
    </div>
  );
};

export default GoogleCalendarScheduling;
