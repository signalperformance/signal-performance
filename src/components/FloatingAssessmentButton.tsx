
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';

const FloatingAssessmentButton = () => {
  const { language } = useLanguage();
  const isMobile = useIsMobile();
  const [isVisible, setIsVisible] = useState(false);
  const hasBeenTriggered = useRef(false);

  useEffect(() => {
    const philosophySection = document.getElementById('philosophy');
    
    if (philosophySection) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !hasBeenTriggered.current) {
            setIsVisible(true);
            hasBeenTriggered.current = true;
          }
        },
        {
          threshold: 0.1,
          rootMargin: '-100px 0px 0px 0px'
        }
      );
      
      observer.observe(philosophySection);
      return () => observer.disconnect();
    }
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
