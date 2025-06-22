
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

    // Create a completely hidden temporary container
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '-9999px';
    tempContainer.style.width = '1px';
    tempContainer.style.height = '1px';
    tempContainer.style.overflow = 'hidden';
    tempContainer.style.visibility = 'hidden';
    tempContainer.style.opacity = '0';
    tempContainer.style.pointerEvents = 'none';
    
    document.body.appendChild(tempContainer);

    try {
      window.calendar.schedulingButton.load({
        url: 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ0jnzzZw7z7Iwpdi24B5bFkJrr78-BVkS3GztoZgLiiP-3Uwevn0_rTk5CDgtDL_dyd2fYc4FZZ?gv=true',
        color: '#c9aa71', // Using your gold color
        label: 'Book an appointment',
        target: tempContainer,
      });

      // Wait for the button to be created, then trigger it and clean up
      setTimeout(() => {
        const calendarButton = tempContainer.querySelector('button');
        if (calendarButton) {
          // Trigger the calendar popup
          calendarButton.click();
          
          // Clean up the temporary container after a short delay
          setTimeout(() => {
            if (document.body.contains(tempContainer)) {
              document.body.removeChild(tempContainer);
            }
          }, 500);
        } else {
          console.error('Google Calendar button not found');
          if (document.body.contains(tempContainer)) {
            document.body.removeChild(tempContainer);
          }
        }
      }, 200);
    } catch (error) {
      console.error('Error opening Google Calendar:', error);
      if (document.body.contains(tempContainer)) {
        document.body.removeChild(tempContainer);
      }
    }
  };

  return { openCalendar, isLoaded };
};
