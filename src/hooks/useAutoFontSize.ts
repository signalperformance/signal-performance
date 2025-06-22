
import { useEffect, useRef, useState } from 'react';

interface UseAutoFontSizeOptions {
  maxFontSize: number;
  minFontSize: number;
  text: string;
}

export const useAutoFontSize = <T extends HTMLElement>({ maxFontSize, minFontSize, text }: UseAutoFontSizeOptions) => {
  const elementRef = useRef<T>(null);
  const [fontSize, setFontSize] = useState(maxFontSize);

  useEffect(() => {
    const adjustFontSize = () => {
      if (!elementRef.current) return;

      const element = elementRef.current;
      const parent = element.parentElement;
      if (!parent) return;

      // Detect mobile
      const isMobile = window.innerWidth < 768;
      console.log('🔧 Font sizing - isMobile:', isMobile, 'text length:', text.length);

      // Get actual computed padding values
      const parentStyles = getComputedStyle(parent);
      const paddingLeft = parseFloat(parentStyles.paddingLeft) || 0;
      const paddingRight = parseFloat(parentStyles.paddingRight) || 0;
      const totalPadding = paddingLeft + paddingRight;

      // Add extra buffer for mobile and long text
      const mobileBuffer = isMobile ? 40 : 20;
      const longTextBuffer = text.length > 40 ? 20 : 0;
      const totalBuffer = mobileBuffer + longTextBuffer;

      // Use getBoundingClientRect for more accurate width
      const parentRect = parent.getBoundingClientRect();
      const availableWidth = parentRect.width - totalPadding - totalBuffer;
      
      console.log('🔧 Available width:', availableWidth, 'Parent width:', parentRect.width, 'Total padding:', totalPadding, 'Buffer:', totalBuffer);

      // Adjust max font size for mobile
      const adjustedMaxFontSize = isMobile ? Math.min(maxFontSize, 48) : maxFontSize;
      const adjustedMinFontSize = isMobile ? Math.max(minFontSize, 18) : minFontSize;

      // Create temporary element as child of parent for better context
      const tempElement = document.createElement('span');
      tempElement.style.visibility = 'hidden';
      tempElement.style.position = 'absolute';
      tempElement.style.whiteSpace = 'nowrap';
      tempElement.style.top = '-9999px';
      tempElement.style.left = '-9999px';
      
      // Copy all relevant styles from the actual element
      const elementStyles = getComputedStyle(element);
      tempElement.style.fontFamily = elementStyles.fontFamily;
      tempElement.style.fontWeight = elementStyles.fontWeight;
      tempElement.style.fontStyle = elementStyles.fontStyle;
      tempElement.style.letterSpacing = elementStyles.letterSpacing;
      tempElement.style.textTransform = elementStyles.textTransform;
      
      tempElement.textContent = text;
      parent.appendChild(tempElement);

      let optimalFontSize = adjustedMinFontSize;
      
      // Binary search with more iterations for precision
      let low = adjustedMinFontSize;
      let high = adjustedMaxFontSize;
      let iterations = 0;
      const maxIterations = 20;
      
      while (low <= high && iterations < maxIterations) {
        const mid = Math.floor((low + high) / 2);
        tempElement.style.fontSize = `${mid}px`;
        
        const textWidth = tempElement.getBoundingClientRect().width;
        console.log('🔧 Testing font size:', mid, 'Text width:', textWidth, 'Available:', availableWidth);
        
        if (textWidth <= availableWidth) {
          optimalFontSize = mid;
          low = mid + 1;
        } else {
          high = mid - 1;
        }
        iterations++;
      }
      
      parent.removeChild(tempElement);
      
      // Final validation with a safety margin
      const finalFontSize = Math.max(optimalFontSize, adjustedMinFontSize);
      console.log('🔧 Final font size:', finalFontSize);
      
      setFontSize(finalFontSize);
    };

    // Improved timing for mobile devices
    const performAdjustment = () => {
      if (window.innerWidth < 768) {
        // Mobile: wait for layout to settle
        setTimeout(() => {
          requestAnimationFrame(adjustFontSize);
        }, 100);
      } else {
        // Desktop: immediate
        requestAnimationFrame(adjustFontSize);
      }
    };

    // Initial adjustment with retry mechanism
    let retryCount = 0;
    const initialAdjust = () => {
      if (elementRef.current && elementRef.current.parentElement) {
        performAdjustment();
      } else if (retryCount < 5) {
        retryCount++;
        setTimeout(initialAdjust, 50);
      }
    };

    initialAdjust();

    // Debounced resize handler
    let timeoutId: NodeJS.Timeout;
    const debouncedAdjust = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(performAdjustment, 150);
    };

    window.addEventListener('resize', debouncedAdjust);
    
    // Also listen to orientation change for mobile
    window.addEventListener('orientationchange', () => {
      setTimeout(debouncedAdjust, 200);
    });

    return () => {
      window.removeEventListener('resize', debouncedAdjust);
      window.removeEventListener('orientationchange', debouncedAdjust);
      clearTimeout(timeoutId);
    };
  }, [text, maxFontSize, minFontSize]);

  return { elementRef, fontSize };
};
