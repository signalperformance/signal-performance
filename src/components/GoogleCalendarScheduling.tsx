
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
        window.calendar.schedulingButton.load({
          url: 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ0jnzzZw7z7Iwpdi24B5bFkJrr78-BVkS3GztoZgLiiP-3Uwevn0_rTk5CDgtDL_dyd2fYc4FZZ?gv=true',
          color: '#c8ab70',
          label: 'Book an appointment',
          target: targetRef.current,
        });

        // Apply custom styling to override Google's default styles
        setTimeout(() => {
          const calendarButton = targetRef.current?.querySelector('button');
          if (calendarButton) {
            // Apply Inter font family and white text color
            calendarButton.style.fontFamily = 'Inter, sans-serif';
            calendarButton.style.color = '#FFFFFF';
            calendarButton.style.fontWeight = '500';
            calendarButton.style.fontSize = '16px';
            // Ensure the background color stays as configured
            calendarButton.style.backgroundColor = '#c8ab70';
            console.log('✅ Applied custom styling to Google Calendar button');
          }
        }, 100);
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
