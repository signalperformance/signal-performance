
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
  
  // Text phases to display sequentially - different for each language
  const textPhases = language === 'zh' 
    ? ["體能、", "心理與", "技術訓練", "集中於一個專業空間"] 
    : ["Physical,", "mental,", "and skill training", "— all in one place"];
  
  // Reset animation when language changes
  useEffect(() => {
    setDisplayText('');
    setCurrentPhaseIndex(0);
  }, [language]);
  
  // Typewriter effect
  useEffect(() => {
    if (currentPhaseIndex >= textPhases.length) return;
    
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
  }, [currentPhaseIndex, language]);
  
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
  
  return <section id="home" className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background - using a clean white background */}
      <div className="absolute inset-0 z-0 bg-white"></div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 text-signal-charcoal max-w-5xl mx-auto leading-tight">
          {renderHeadline()}
        </h1>
        <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-signal-charcoal/80 min-h-[2rem]">
          {displayText}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
          <Button className="bg-signal-charcoal hover:bg-signal-charcoal/90 text-white font-medium px-8 py-6 text-lg flex items-center gap-2" size="lg" onClick={openWaitlist}>
            {t('hero.cta.waitlist')} <ArrowRight size={18} />
          </Button>
          <Button className="bg-white hover:bg-gray-100 text-signal-charcoal font-medium border border-gray-200 px-8 py-6 text-lg" variant="outline" size="lg" onClick={() => document.getElementById('membership')?.scrollIntoView({
          behavior: 'smooth'
        })}>
            {t('hero.cta.membership')}
          </Button>
        </div>
      </div>
    </section>;
};
export default Hero;
