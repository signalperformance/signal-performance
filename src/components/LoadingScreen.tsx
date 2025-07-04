
import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const LoadingScreen = ({ onLoadingComplete }: LoadingScreenProps) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const preloadResources = async () => {
      const promises = [];

      // Preload the new gold logo image for loading screen
      const logoPromise = new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.src = "/lovable-uploads/a46da5a6-283e-4115-91d7-c1373de8fb80.png";
      });
      promises.push(logoPromise);

      // Preload the navbar logo to prevent flash
      const navbarLogoPromise = new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.src = "/lovable-uploads/0959e8f0-e34c-4d16-9e3e-16462b6d8961.png";
      });
      promises.push(navbarLogoPromise);

      // Wait for fonts to load
      const fontPromise = document.fonts.ready;
      promises.push(fontPromise);

      // Minimum loading time for smooth experience
      const minLoadTime = new Promise(resolve => setTimeout(resolve, 2000));
      promises.push(minLoadTime);

      try {
        await Promise.all(promises);
        
        // Start fade out animation
        setFadeOut(true);
        
        // Complete loading after fade animation
        setTimeout(() => {
          onLoadingComplete();
        }, 500);
      } catch (error) {
        console.log('Some resources failed to load, continuing anyway');
        setFadeOut(true);
        setTimeout(() => {
          onLoadingComplete();
        }, 500);
      }
    };

    preloadResources();
  }, [onLoadingComplete]);

  return (
    <div className={`fixed inset-0 z-[100] bg-white flex items-center justify-center transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      <div className="flex flex-col items-center">
        {/* Gold logo with subtle pulse animation */}
        <div className="animate-pulse">
          <img 
            src="/lovable-uploads/a46da5a6-283e-4115-91d7-c1373de8fb80.png" 
            alt="Signal Performance Logo" 
            className="h-16 w-auto md:h-20 object-contain"
          />
        </div>
        
        {/* Company name */}
        <h1 className="text-2xl md:text-3xl brand-font font-bold text-signal-charcoal mt-4 animate-fade-in">
          Signal Performance
        </h1>
        
        {/* Subtle loading indicator */}
        <div className="mt-8 flex space-x-1">
          <div className="w-2 h-2 bg-signal-gold rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-signal-gold rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-signal-gold rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
