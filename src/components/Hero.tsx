
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWaitlistDialog } from '@/hooks/useWaitlistDialog';
import { useState, useEffect, useRef } from 'react';

declare global {
  interface Window {
    VANTA: any;
    THREE: any;
  }
}

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

  // Initialize VANTA effect
  useEffect(() => {
    const initVanta = () => {
      if (vantaRef.current && window.VANTA && window.THREE) {
        vantaEffect.current = window.VANTA.WAVES({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          color: 0x1d4f78,
          shininess: 30.00,
          waveHeight: 15.00,
          waveSpeed: 0.75,
          zoom: 0.85
        });
      }
    };

    // Check if VANTA is available, if not retry
    const checkVanta = () => {
      if (window.VANTA && window.THREE) {
        initVanta();
      } else {
        setTimeout(checkVanta, 100);
      }
    };

    checkVanta();

    return () => {
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
    <section id="home" className="relative min-h-[100svh] py-16 md:py-0 md:h-screen overflow-hidden">
      {/* VANTA Waves Background */}
      <div 
        ref={vantaRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1 }}
      />
      
      {/* Content Overlay */}
      <div className="relative z-10 container mx-auto px-4 text-center h-full flex flex-col justify-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 sm:mb-8 text-white max-w-5xl mx-auto leading-tight drop-shadow-lg">
          {renderHeadline()}
        </h1>
        <p className="text-lg sm:text-xl mb-10 sm:mb-14 max-w-3xl mx-auto min-h-[2rem] font-medium md:text-3xl text-white/90 drop-shadow-md">
          {getCompleteText()}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
          {/* Philosophy button */}
          <Button 
            className="bg-white/90 hover:bg-white text-signal-charcoal font-medium px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg flex items-center gap-2 backdrop-blur-sm" 
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
            className="bg-transparent hover:bg-white/10 text-white font-medium border border-white/30 px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg backdrop-blur-sm" 
            variant="outline" 
            size="lg" 
            onClick={openWaitlist}
          >
            {t('hero.cta.waitlist')}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
