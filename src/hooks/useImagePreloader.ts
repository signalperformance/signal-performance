import { useState, useEffect } from 'react';

interface UseImagePreloaderReturn {
  isLoading: boolean;
  loadedCount: number;
  totalCount: number;
  hasErrors: boolean;
}

export const useImagePreloader = (imageUrls: string[]): UseImagePreloaderReturn => {
  const [loadedCount, setLoadedCount] = useState(0);
  const [hasErrors, setHasErrors] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (imageUrls.length === 0) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setLoadedCount(0);
    setHasErrors(false);

    const imagePromises = imageUrls.map((url) => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        
        img.onload = () => {
          setLoadedCount(prev => prev + 1);
          resolve();
        };
        
        img.onerror = () => {
          console.warn(`Failed to preload image: ${url}`);
          setHasErrors(true);
          setLoadedCount(prev => prev + 1); // Still count as "processed"
          resolve(); // Don't reject to prevent blocking other images
        };
        
        img.src = url;
      });
    });

    Promise.all(imagePromises).finally(() => {
      setIsLoading(false);
    });
  }, [imageUrls]);

  return {
    isLoading,
    loadedCount,
    totalCount: imageUrls.length,
    hasErrors
  };
};