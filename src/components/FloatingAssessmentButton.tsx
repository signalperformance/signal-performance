
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';

const FloatingAssessmentButton = () => {
  const { language } = useLanguage();
  const isMobile = useIsMobile();
  const [isVisible, setIsVisible] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Get the hero section height (100svh) and calculate when buttons become invisible
      const heroHeight = window.innerHeight;
      const scrollPosition = window.scrollY;
      
      // Show button when scrolled past about 70% of hero section (when buttons start to disappear)
      const triggerPoint = heroHeight * 0.7;
      setIsVisible(scrollPosition > triggerPoint);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer to detect footer visibility
  useEffect(() => {
    const footer = document.getElementById('contact');
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1, // Trigger when 10% of footer is visible
        rootMargin: '0px 0px -50px 0px' // Account for button height
      }
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const getAssessmentButtonText = () => {
    return language === 'zh' ? '預約評估' : 'Book Assessment';
  };

  const handleBookAssessment = () => {
    window.location.href = 'https://calendly.com/noah-signalperformance/assessment';
  };

  if (!isVisible) return null;

  // Dynamic positioning based on mobile and footer visibility
  const getButtonPosition = () => {
    if (isMobile && isFooterVisible) {
      // On mobile when footer is visible, position much higher to completely clear social icons
      return "fixed bottom-24 right-6 z-50";
    }
    return "fixed bottom-6 right-6 z-50";
  };

  return (
    <div className={getButtonPosition()}>
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
