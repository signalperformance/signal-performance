import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const FloatingAssessmentButton = () => {
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling 400px (past hero section)
      if (window.scrollY > 400) {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial position
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
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
    <div className="fixed bottom-6 right-6 z-[100]">
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