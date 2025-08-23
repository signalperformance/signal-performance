
import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const LoadingScreen = ({ onLoadingComplete }: LoadingScreenProps) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const preloadResources = async () => {
      const promises = [];
      let progressCount = 0;
      const totalResources = 20; // Approximate count for progress

      // Comprehensive image preloading - all critical above-the-fold images
      const criticalImages = [
        "/lovable-uploads/a46da5a6-283e-4115-91d7-c1373de8fb80.png", // Loading logo
        "/lovable-uploads/0959e8f0-e34c-4d16-9e3e-16462b6d8961.png", // Navbar logo
        // Hero background image (if any)
        // Philosophy section images - all variants for responsive design
        "/lovable-uploads/4bdd82f1-a74e-471c-ad2d-72a158c7e24e.png", // Philosophy Chinese mobile
        "/lovable-uploads/bad88ef0-fed5-4d79-90c4-5fbeed980400.png", // Philosophy English mobile
        "/lovable-uploads/23ce2472-9cbc-4d05-bd80-cd0ac6eb27a8.png", // Philosophy Chinese desktop
        "/lovable-uploads/2277bfb2-f510-4e78-bf50-410d94a0f83b.png", // Philosophy English desktop
        // About section images - profile and certifications
        "/lovable-uploads/9cd6f4c9-9cfc-435a-8ebb-2bbe20537915.png", // Dr. Noah Sachs profile
        "/lovable-uploads/1d022755-a8e7-481a-91db-13f7db87b26a.png", // PGA certification
        "/lovable-uploads/1dc02882-2327-403c-9e82-8b8207c618ff.png", // CSCS certification
        "/lovable-uploads/09961efd-a840-417f-a93a-2e2990b91489.png", // CMPC certification
        "/lovable-uploads/b8e8e7d5-5980-475f-9534-3660f734bccf.png", // BCIA Biofeedback
        "/lovable-uploads/80663943-a684-4747-88d6-29d27b58e790.png", // TPI certification
        "/lovable-uploads/650394e1-2bf5-4354-b912-86a81648eaaa.png"  // BCIA Neurofeedback
      ];
      
      // Enhanced image preloading with progress tracking
      const imagePromises = criticalImages.map(src => new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          progressCount++;
          resolve(true);
        };
        img.onerror = () => {
          progressCount++;
          resolve(true); // Don't fail loading if image fails
        };
        img.src = src;
      }));
      promises.push(...imagePromises);

      // Enhanced font loading - wait for ALL font weights and variants
      const fontPromise = document.fonts.ready.then(async () => {
        const fontLoadPromises = [
          // IBM Plex Sans JP - all weights
          document.fonts.load('300 16px "IBM Plex Sans JP"'),
          document.fonts.load('400 16px "IBM Plex Sans JP"'),
          document.fonts.load('500 16px "IBM Plex Sans JP"'),
          document.fonts.load('600 16px "IBM Plex Sans JP"'),
          document.fonts.load('700 16px "IBM Plex Sans JP"'),
          // Montserrat - all weights
          document.fonts.load('400 16px "Montserrat"'),
          document.fonts.load('500 16px "Montserrat"'),
          document.fonts.load('600 16px "Montserrat"'),
          document.fonts.load('700 16px "Montserrat"'),
          // Lora
          document.fonts.load('400 16px "Lora"'),
          document.fonts.load('700 16px "Lora"'),
          // Inter
          document.fonts.load('300 16px "Inter"'),
          document.fonts.load('400 16px "Inter"'),
          document.fonts.load('500 16px "Inter"'),
          document.fonts.load('600 16px "Inter"'),
          document.fonts.load('700 16px "Inter"')
        ];
        
        try {
          await Promise.all(fontLoadPromises);
          progressCount += 3; // Add to progress count
          return true;
        } catch (error) {
          console.log('Some fonts failed to load:', error);
          progressCount += 3;
          return true; // Continue even if some fonts fail
        }
      }).catch(() => {
        progressCount += 3;
        return Promise.resolve();
      });
      promises.push(fontPromise);

      // Preload lazy components during loading screen
      const componentPreloadPromises = [
        import('./memo/MemoizedPhilosophy'),
        import('./memo/MemoizedStudioLocation'), 
        import('./memo/MemoizedWeeklySchedule')
      ].map(p => p.then(() => {
        progressCount++;
        return true;
      }).catch(() => {
        progressCount++;
        return true;
      }));
      promises.push(...componentPreloadPromises);

      // Minimum load time for smooth experience (reduced from 1200ms)
      const minLoadTime = new Promise(resolve => setTimeout(resolve, 800));
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
        
        {/* Enhanced loading indicator with progress */}
        <div className="mt-8">
          {/* Progress dots */}
          <div className="flex space-x-1 justify-center">
            <div className="w-2 h-2 bg-signal-gold rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-signal-gold rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-signal-gold rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
