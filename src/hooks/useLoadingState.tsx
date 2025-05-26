
import { useState } from 'react';

export const useLoadingState = () => {
  const [isLoading, setIsLoading] = useState(true);

  const completeLoading = () => {
    setIsLoading(false);
  };

  return {
    isLoading,
    completeLoading
  };
};
