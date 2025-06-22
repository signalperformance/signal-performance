
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

      // Wait longer for the button to be created and try multiple selectors
      setTimeout(() => {
        // Try different selectors to find the calendar button
        let calendarButton = tempContainer.querySelector('button');
        if (!calendarButton) {
          calendarButton = tempContainer.querySelector('a[role="button"]');
        }
        if (!calendarButton) {
          calendarButton = tempContainer.querySelector('div[role="button"]');
        }
        if (!calendarButton) {
          // Look for any clickable element in the container
          calendarButton = tempContainer.querySelector('[onclick], [data-calendar]');
        }
        
        if (calendarButton) {
          console.log('Found calendar button:', calendarButton);
          // Trigger the calendar popup
          calendarButton.click();
          
          // Clean up the temporary container after a short delay
          setTimeout(() => {
            if (document.body.contains(tempContainer)) {
              document.body.removeChild(tempContainer);
            }
          }, 500);
        } else {
          console.error('Google Calendar button not found, checking container contents:', tempContainer.innerHTML);
          // Try to trigger any event listeners on the container itself
          const event = new MouseEvent('click', { bubbles: true, cancelable: true });
          tempContainer.dispatchEvent(event);
          
          setTimeout(() => {
            if (document.body.contains(tempContainer)) {
              document.body.removeChild(tempContainer);
            }
          }, 500);
        }
      }, 500); // Increased wait time
    } catch (error) {
      console.error('Error opening Google Calendar:', error);
      if (document.body.contains(tempContainer)) {
        document.body.removeChild(tempContainer);
      }
    }
  };

  return { openCalendar, isLoaded };
};
