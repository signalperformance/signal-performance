
import { useEffect, useState } from 'react';

declare global {
  interface Window {
    calendar?: {
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

export const useGoogleCalendarScheduling = () => {
  const [isCalendarReady, setIsCalendarReady] = useState(false);

  useEffect(() => {
    const checkCalendarAvailability = () => {
      if (window.calendar?.schedulingButton) {
        setIsCalendarReady(true);
        return;
      }
      
      // Check again in 100ms if not ready
      setTimeout(checkCalendarAvailability, 100);
    };

    // Start checking when component mounts
    checkCalendarAvailability();
  }, []);

  const openScheduling = () => {
    if (window.calendar?.schedulingButton) {
      // Create a hidden target element for the calendar popup
      const target = document.createElement('div');
      target.style.display = 'none';
      document.body.appendChild(target);

      // Initialize the calendar scheduling
      window.calendar.schedulingButton.load({
        url: 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ0jnzzZw7z7Iwpdi24B5bFkJrr78-BVkS3GztoZgLiiP-3Uwevn0_rTk5CDgtDL_dyd2fYc4FZZ?gv=true',
        color: '#c9aa71',
        label: 'Book Assessment',
        target,
      });

      // Trigger the click programmatically
      setTimeout(() => {
        const calendarButton = target.querySelector('button') as HTMLButtonElement;
        if (calendarButton) {
          calendarButton.click();
        }
        // Clean up the temporary element
        document.body.removeChild(target);
      }, 100);
    } else {
      console.warn('Google Calendar scheduling is not available yet');
    }
  };

  return { openScheduling, isCalendarReady };
};
