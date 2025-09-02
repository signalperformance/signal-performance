
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';

const FloatingAssessmentButton = () => {
  const { language } = useLanguage();
  const isMobile = useIsMobile();
  const [isVisible, setIsVisible] = useState(false);
  const hasBeenTriggered = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleScroll = () => {
      // Throttle scroll events
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      scrollTimeoutRef.current = setTimeout(() => {
        if (hasBeenTriggered.current) return;
        
        const philosophySection = document.getElementById('philosophy');
        if (philosophySection) {
          const rect = philosophySection.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          
          // Show button when 20% of philosophy section is visible
          const isPhilosophyVisible = rect.top < windowHeight * 0.8 && rect.bottom > 0;
          
          if (isPhilosophyVisible) {
            setIsVisible(true);
            hasBeenTriggered.current = true;
          }
        } else {
          // Fallback: show after scrolling past hero section
          const heroSection = document.querySelector('section');
          if (heroSection) {
            const heroHeight = heroSection.offsetHeight;
            const scrollPosition = window.scrollY;
            
            if (scrollPosition > heroHeight * 0.6) {
              setIsVisible(true);
              hasBeenTriggered.current = true;
            }
          }
        }
      }, 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial position
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const getAssessmentButtonText = () => {
    return language === 'zh' ? '預約評估' : 'Book Assessment';
  };

  const handleBookAssessment = () => {
    window.location.href = 'https://calendly.com/noah-signalperformance/assessment';
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      <Button 
        size="lg" 
        onClick={handleBookAssessment}
        className="font-medium px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg text-signal-white bg-signal-gold hover:bg-signal-gold/90 active:bg-signal-gold focus:bg-signal-gold shadow-lg hover:shadow-xl transition-all duration-300"
      >
        {getAssessmentButtonText()}
      </Button>
    </div>
  );
};

export default FloatingAssessmentButton;
