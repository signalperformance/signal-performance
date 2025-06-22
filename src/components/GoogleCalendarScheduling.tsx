
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
