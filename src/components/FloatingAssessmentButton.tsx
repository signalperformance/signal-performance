
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const FloatingAssessmentButton = () => {
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Get the hero section height (100svh)
      const heroHeight = window.innerHeight;
      const scrollPosition = window.scrollY;
      
      // Show button when scrolled past hero section
      setIsVisible(scrollPosition > heroHeight);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getAssessmentButtonText = () => {
    return language === 'zh' ? '預約評估' : 'Book Assessment';
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button 
        size="lg" 
        asChild
        className="font-medium px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg text-signal-white bg-signal-gold hover:bg-signal-gold/90 active:bg-signal-gold focus:bg-signal-gold shadow-lg hover:shadow-xl transition-all duration-300"
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
  );
};

export default FloatingAssessmentButton;
