
import { useEffect, useRef, useState } from 'react';

interface UseAutoFontSizeOptions {
  maxFontSize: number;
  minFontSize: number;
  text: string;
}

export const useAutoFontSize = ({ maxFontSize, minFontSize, text }: UseAutoFontSizeOptions) => {
  const elementRef = useRef<HTMLElement>(null);
  const [fontSize, setFontSize] = useState(maxFontSize);

  useEffect(() => {
    const adjustFontSize = () => {
      if (!elementRef.current) return;

      const element = elementRef.current;
      const parent = element.parentElement;
      if (!parent) return;

      // Get available width (subtract padding)
      const availableWidth = parent.clientWidth - 32; // 32px for padding (16px on each side)
      
      // Create a temporary element to measure text width
      const tempElement = document.createElement('span');
      tempElement.style.visibility = 'hidden';
      tempElement.style.position = 'absolute';
      tempElement.style.whiteSpace = 'nowrap';
      tempElement.style.fontFamily = getComputedStyle(element).fontFamily;
      tempElement.style.fontWeight = getComputedStyle(element).fontWeight;
      tempElement.textContent = text;
      
      document.body.appendChild(tempElement);

      let currentFontSize = maxFontSize;
      
      // Binary search for optimal font size
      let low = minFontSize;
      let high = maxFontSize;
      
      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        tempElement.style.fontSize = `${mid}px`;
        
        if (tempElement.offsetWidth <= availableWidth) {
          currentFontSize = mid;
          low = mid + 1;
        } else {
          high = mid - 1;
        }
      }
      
      document.body.removeChild(tempElement);
      setFontSize(Math.max(currentFontSize, minFontSize));
    };

    // Initial adjustment
    adjustFontSize();

    // Adjust on window resize with debouncing
    let timeoutId: NodeJS.Timeout;
    const debouncedAdjust = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(adjustFontSize, 100);
    };

    window.addEventListener('resize', debouncedAdjust);
    return () => {
      window.removeEventListener('resize', debouncedAdjust);
      clearTimeout(timeoutId);
    };
  }, [text, maxFontSize, minFontSize]);

  return { elementRef, fontSize };
};
