import { useEffect, useRef, useCallback } from 'react';

interface UseOptimizedScrollOptions {
  throttleMs?: number;
  threshold?: number;
}

export const useOptimizedScroll = (
  callback: (scrollY: number) => void,
  options: UseOptimizedScrollOptions = {}
) => {
  const { throttleMs = 16, threshold = 0 } = options; // 16ms ≈ 60fps
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    
    // Only proceed if scroll change is significant enough
    if (Math.abs(scrollY - lastScrollY.current) < threshold) {
      return;
    }

    if (!ticking.current) {
      requestAnimationFrame(() => {
        callback(scrollY);
        lastScrollY.current = scrollY;
        ticking.current = false;
      });
      ticking.current = true;
    }
  }, [callback, threshold]);

  useEffect(() => {
    // Throttle scroll events
    let timeoutId: NodeJS.Timeout;
    
    const throttledScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, throttleMs);
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', throttledScroll);
    };
  }, [handleScroll, throttleMs]);

  return { lastScrollY: lastScrollY.current };
};