
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWaitlistDialog } from '@/hooks/useWaitlistDialog';
import { useState, useEffect, useRef } from 'react';

const Hero = () => {
  const {
    t,
    language
  } = useLanguage();
  const {
    openWaitlist
  } = useWaitlistDialog();
  const [isMobile, setIsMobile] = useState(false);
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<any>(null);

  // Check for mobile device
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Set initial value
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);

    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Initialize VANTA waves effect
  useEffect(() => {
    const initVanta = () => {
      if (vantaRef.current && (window as any).VANTA && (window as any).THREE) {
        console.log('Initializing VANTA effect...');
        try {
          vantaEffect.current = (window as any).VANTA.WAVES({
            el: vantaRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0x18232c,
            shininess: 30.00,
            waveHeight: 15.00,
            waveSpeed: 1.00,
            zoom: 0.75
          });
          console.log('VANTA effect initialized successfully');
        } catch (error) {
          console.error('Error initializing VANTA effect:', error);
        }
      } else {
        console.log('VANTA or THREE.js not available, retrying...');
        // Retry after a short delay
        setTimeout(initVanta, 100);
      }
    };

    // Wait for scripts to load
    const timer = setTimeout(initVanta, 100);

    return () => {
      clearTimeout(timer);
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
      }
    };
  }, []);

  // Text phases for different languages
  const textPhases = language === 'zh' ? ["體能、", "心理與", "技術訓練", "集中於一個專業空間"] : ["Physical,", "mental,", "and skill training", "— all in one place"];

  // Function to get the complete text
  const getCompleteText = () => {
    return textPhases.join(language === 'zh' ? '' : ' ');
  };

  // Function to render headline with line break for Chinese
  const renderHeadline = () => {
    if (language === 'zh') {
      // Split the Chinese title after "的"
      const headlineText = t('hero.headline');
      const parts = headlineText.split('的');
      if (parts.length > 1) {
        return <>
            {parts[0]}的<br className="md:hidden" />{parts[1]}
          </>;
      }
      return headlineText;
    }
    return t('hero.headline');
  };

  return (
    <section id="home" className="relative min-h-[100svh] py-16 md:py-0 md:h-screen overflow-x-hidden overflow-y-auto">
      <div ref={vantaRef} className="absolute inset-0 bg-gray-900">
        <div className="relative z-10 container mx-auto px-4 text-center h-full flex flex-col justify-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 sm:mb-8 text-white max-w-5xl mx-auto leading-tight">
            {renderHeadline()}
          </h1>
          <p className="text-lg sm:text-xl mb-10 sm:mb-14 max-w-3xl mx-auto min-h-[2rem] font-medium md:text-3xl text-white/90">
            {getCompleteText()}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
            {/* Philosophy button */}
            <Button 
              className="bg-white hover:bg-gray-100 text-signal-charcoal font-medium px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg flex items-center gap-2" 
              size="lg" 
              onClick={() => document.getElementById('philosophy')?.scrollIntoView({
                behavior: 'smooth'
              })}
            >
              {t('hero.cta.membership')}
            </Button>
            {/* Waitlist button with ID for tracking visibility */}
            <Button 
              id="hero-waitlist-button"
              className="bg-transparent hover:bg-white/10 text-white font-medium border border-white/30 px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg" 
              variant="outline" 
              size="lg" 
              onClick={openWaitlist}
            >
              {t('hero.cta.waitlist')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
