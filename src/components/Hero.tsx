
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight } from 'lucide-react';
import { useWaitlistDialog } from '@/hooks/useWaitlistDialog';
import { useState, useEffect } from 'react';

const Hero = () => {
  const {
    t,
    language
  } = useLanguage();
  const {
    openWaitlist
  } = useWaitlistDialog();
  
  // For typewriter animation
  const [displayText, setDisplayText] = useState('');
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
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
  
  // Text phases to display sequentially - different for each language
  const textPhases = language === 'zh' 
    ? ["體能、", "心理與", "技術訓練", "集中於一個專業空間"] 
    : ["Physical,", "mental,", "and skill training", "— all in one place"];
  
  // Reset animation when language changes
  useEffect(() => {
    setDisplayText('');
    setCurrentPhaseIndex(0);
  }, [language]);
  
  // Typewriter effect - only on desktop
  useEffect(() => {
    if (isMobile || currentPhaseIndex >= textPhases.length) return;
    
    const nextPhrase = textPhases[currentPhaseIndex];
    let currentText = '';
    
    // Add content from previous phases with spaces between
    for (let i = 0; i < currentPhaseIndex; i++) {
      currentText += textPhases[i] + (language === 'zh' ? '' : ' ');
    }
    
    let charIndex = 0;
    
    const typingInterval = setInterval(() => {
      if (charIndex < nextPhrase.length) {
        setDisplayText(currentText + nextPhrase.substring(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typingInterval);
        if (currentPhaseIndex < textPhases.length - 1) {
          setTimeout(() => {
            setCurrentPhaseIndex(prevIndex => prevIndex + 1);
          }, 500); // 0.5 second delay between word groups
        }
      }
    }, language === 'zh' ? 100 : 50); // Slower typing speed for Chinese characters
    
    return () => clearInterval(typingInterval);
  }, [currentPhaseIndex, language, isMobile]);
  
  // Generate the complete text for mobile display
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
        return (
          <>
            {parts[0]}的<br className="md:hidden" />{parts[1]}
          </>
        );
      }
      return headlineText;
    }
    return t('hero.headline');
  };
  
  return (
    <section id="home" className="relative min-h-[100svh] py-16 md:py-0 md:h-screen flex flex-col items-center justify-center overflow-x-hidden overflow-y-auto">
      {/* Background - using a clean white background */}
      <div className="absolute inset-0 z-0 bg-white"></div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 text-signal-charcoal max-w-5xl mx-auto leading-tight">
          {renderHeadline()}
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl mb-8 sm:mb-12 max-w-3xl mx-auto text-signal-charcoal/80 min-h-[2rem]">
          {isMobile ? getCompleteText() : displayText}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
          <Button 
            className="bg-signal-charcoal hover:bg-signal-charcoal/90 text-white font-medium px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg flex items-center gap-2" 
            size="lg" 
            onClick={openWaitlist}
          >
            {t('hero.cta.waitlist')} <ArrowRight size={18} />
          </Button>
          <Button 
            className="bg-white hover:bg-gray-100 text-signal-charcoal font-medium border border-gray-200 px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg" 
            variant="outline" 
            size="lg" 
            onClick={() => document.getElementById('membership')?.scrollIntoView({behavior: 'smooth'})}
          >
            {t('hero.cta.membership')}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
