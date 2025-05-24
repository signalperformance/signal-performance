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
  const [vantaLoaded, setVantaLoaded] = useState(false);
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

  // Initialize VANTA effect with comprehensive debugging
  useEffect(() => {
    console.log('🌊 VANTA Hero useEffect started');
    const initVanta = () => {
      console.log('🌊 initVanta called');
      console.log('🌊 window.THREE:', !!window.THREE);
      console.log('🌊 window.VANTA:', !!window.VANTA);
      console.log('🌊 vantaRef.current:', !!vantaRef.current);
      if (vantaRef.current && window.VANTA && window.THREE) {
        try {
          console.log('🌊 Creating VANTA WAVES effect...');
          vantaEffect.current = window.VANTA.WAVES({
            el: vantaRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0x989b9b,
            // Changed to medium gray color
            shininess: 0.00,
            waveHeight: 2.00,
            waveSpeed: 1.1,
            zoom: 0.85
          });
          if (vantaEffect.current) {
            console.log('✅ VANTA WAVES effect created successfully!');
            setVantaLoaded(true);
          } else {
            console.error('❌ VANTA effect creation returned null/undefined');
          }
        } catch (error) {
          console.error('❌ Error creating VANTA effect:', error);
        }
      } else {
        console.log('❌ Missing dependencies for VANTA initialization');
      }
    };

    // Improved script loading detection with timeout and retries
    let retries = 0;
    const maxRetries = 50;
    const checkVanta = () => {
      console.log('🔍 Checking VANTA availability... Attempt:', retries + 1);
      if (window.VANTA && window.THREE) {
        console.log('✅ VANTA and THREE.js are available');
        initVanta();
      } else {
        console.log('⏳ VANTA or THREE.js not available, retrying...');
        console.log('window.THREE available:', !!window.THREE);
        console.log('window.VANTA available:', !!window.VANTA);
        retries++;
        if (retries < maxRetries) {
          setTimeout(checkVanta, 100);
        } else {
          console.error('❌ VANTA loading failed after', maxRetries, 'attempts');
        }
      }
    };

    // Add a timeout to prevent infinite retries
    const timeoutId = setTimeout(() => {
      if (!vantaLoaded) {
        console.error('⏰ VANTA loading timed out after 10 seconds');
      }
    }, 10000);
    checkVanta();
    return () => {
      clearTimeout(timeoutId);
      if (vantaEffect.current) {
        console.log('🧹 Cleaning up VANTA effect');
        vantaEffect.current.destroy();
      }
    };
  }, [vantaLoaded]);

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
  return <section id="home" className="relative min-h-[100svh] overflow-hidden flex items-center justify-center">
      {/* VANTA Waves Background with fallback */}
      <div ref={vantaRef} className="absolute inset-0 w-full h-full z-0" style={{
      backgroundColor: vantaLoaded ? 'transparent' : '#85858c',
      transition: 'background-color 0.5s ease'
    }} />
      
      {/* Content Overlay */}
      <div className="relative z-10 container mx-auto px-4 text-center py-16 md:py-0">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 sm:mb-8 text-signal-charcoal max-w-5xl mx-auto leading-tight py-[50px]">
          {renderHeadline()}
        </h1>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
          {/* Philosophy button */}
          <Button size="lg" onClick={() => document.getElementById('philosophy')?.scrollIntoView({
          behavior: 'smooth'
        })} className="text-white font-medium px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg flex items-center gap-2 bg-signal-charcoal">
            {t('hero.cta.membership')}
          </Button>
          {/* Waitlist button with ID for tracking visibility */}
          <Button id="hero-waitlist-button" variant="outline" size="lg" onClick={openWaitlist} className="font-medium border border-signal-charcoal/30 px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg text-signal-white bg-signal-gold">
            {t('hero.cta.waitlist')}
          </Button>
        </div>
      </div>
    </section>;
};
export default Hero;