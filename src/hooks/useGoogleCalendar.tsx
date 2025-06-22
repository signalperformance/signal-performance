
import { useEffect, useState } from 'react';

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

export const useGoogleCalendar = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const checkCalendarAvailability = () => {
      if (window.calendar && window.calendar.schedulingButton) {
        setIsLoaded(true);
      } else {
        // Retry after a short delay
        setTimeout(checkCalendarAvailability, 100);
      }
    };

    // Start checking after window load
    if (document.readyState === 'complete') {
      checkCalendarAvailability();
    } else {
      window.addEventListener('load', checkCalendarAvailability);
    }

    return () => {
      window.removeEventListener('load', checkCalendarAvailability);
    };
  }, []);

  const openCalendar = () => {
    if (!isLoaded || !window.calendar) {
      console.warn('Google Calendar not loaded yet');
      return;
    }

    // Create a temporary target element for the calendar popup
    const tempTarget = document.createElement('div');
    tempTarget.style.display = 'none';
    document.body.appendChild(tempTarget);

    try {
      window.calendar.schedulingButton.load({
        url: 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ0jnzzZw7z7Iwpdi24B5bFkJrr78-BVkS3GztoZgLiiP-3Uwevn0_rTk5CDgtDL_dyd2fYc4FZZ?gv=true',
        color: '#c9aa71', // Using your gold color
        label: 'Book an appointment',
        target: tempTarget,
      });

      // Trigger the click on the hidden calendar button
      setTimeout(() => {
        const calendarButton = tempTarget.querySelector('button');
        if (calendarButton) {
          calendarButton.click();
        }
        // Clean up the temporary element
        document.body.removeChild(tempTarget);
      }, 100);
    } catch (error) {
      console.error('Error opening Google Calendar:', error);
      document.body.removeChild(tempTarget);
    }
  };

  return { openCalendar, isLoaded };
};
