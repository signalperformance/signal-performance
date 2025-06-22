
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect, useRef } from 'react';

declare global {
  interface Window {
    VANTA: any;
    THREE: any;
  }
}

const Hero = () => {
  const { t, language } = useLanguage();
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

  // Function to render headline with responsive behavior
  const renderHeadline = () => {
    const headlineText = t('hero.headline');
    
    // On desktop (sm and above), render as single unbroken text with proper centering
    const desktopHeadline = (
      <span className="hidden sm:inline text-center w-full block">{headlineText}</span>
    );
    
    // On mobile, render with explicit breaks
    const mobileHeadline = (() => {
      if (language === 'zh') {
        // Split the Chinese title after "空間"
        const parts = headlineText.split('空間');
        if (parts.length > 1) {
          return (
            <span className="sm:hidden">
              <span>{parts[0]}空間</span>
              <br />
              <span>{parts[1].trim()}</span>
            </span>
          );
        }
        return <span className="sm:hidden">{headlineText}</span>;
      }
      
      // For English, find "Space" and add break after it
      const spaceWord = 'Space';
      if (headlineText.includes(spaceWord)) {
        const spaceIndex = headlineText.indexOf(spaceWord) + spaceWord.length;
        const beforeBreak = headlineText.substring(0, spaceIndex);
        const afterBreak = headlineText.substring(spaceIndex).trim();
        
        return (
          <span className="sm:hidden">
            <span className="whitespace-nowrap">{beforeBreak}</span>
            <br />
            <span>{afterBreak}</span>
          </span>
        );
      }
      
      return <span className="sm:hidden">{headlineText}</span>;
    })();
    
    return (
      <>
        {desktopHeadline}
        {mobileHeadline}
      </>
    );
  };

  // Function to render subtitle with responsive behavior
  const renderSubtitle = () => {
    if (language === 'zh') {
      // Chinese version - always single line
      return '體能、心理與技術訓練集中於一個專業空間';
    }
    
    // English version
    const fullSubtitle = 'Physical, mental, and skill training — all in one place';
    
    // Desktop version - single line with em dash
    const desktopSubtitle = (
      <span className="hidden sm:inline">{fullSubtitle}</span>
    );
    
    // Mobile version - two lines without em dash
    const mobileSubtitle = (
      <span className="sm:hidden">
        <span>Physical, mental, and skill training</span>
        <br />
        <span>all in one place</span>
      </span>
    );
    
    return (
      <>
        {desktopSubtitle}
        {mobileSubtitle}
      </>
    );
  };

  // Custom assessment button text
  const getAssessmentButtonText = () => {
    return language === 'zh' ? '預約評估' : 'Book Assessment';
  };

  return (
    <section id="home" className="relative min-h-[100svh] overflow-hidden flex items-center justify-center">
      {/* VANTA Waves Background with fallback */}
      <div 
        ref={vantaRef} 
        className="absolute inset-0 w-full h-full z-0" 
        style={{
          backgroundColor: vantaLoaded ? 'transparent' : '#85858c',
          transition: 'background-color 0.5s ease'
        }} 
      />
      
      {/* Content Overlay */}
      <div className="relative z-10 container mx-auto px-4 text-center py-16 md:py-0">
        <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-1 sm:mb-2 text-signal-charcoal max-w-5xl mx-auto leading-tight py-[35px] ${language === 'en' ? 'sm:!text-5xl md:!text-6xl lg:!text-6xl xl:!text-6xl' : ''}`}>
          {renderHeadline()}
        </h1>
        
        <p className="text-lg sm:text-xl md:text-2xl text-signal-charcoal mb-8 sm:mb-12 max-w-4xl mx-auto">
          {renderSubtitle()}
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
          {/* Philosophy button */}
          <Button 
            size="lg" 
            onClick={() => document.getElementById('philosophy')?.scrollIntoView({ behavior: 'smooth' })} 
            className="text-white font-medium px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg flex items-center gap-2 bg-signal-charcoal hover:bg-signal-charcoal active:bg-signal-charcoal focus:bg-signal-charcoal"
          >
            {t('hero.cta.membership')}
          </Button>
          {/* Assessment button - now links to LINE */}
          <Button 
            size="lg" 
            asChild
            className="font-medium px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg text-signal-white bg-signal-gold hover:bg-signal-gold/90 active:bg-signal-gold focus:bg-signal-gold"
          >
            <a 
              href="https://lin.ee/CaWvRmo" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              {getAssessmentButtonText()}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
