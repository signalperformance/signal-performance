import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const FloatingAssessmentButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { t, language } = useLanguage();

  const getAssessmentButtonText = () => {
    if (language === 'en') {
      return 'Book Assessment';
    }
    return t('hero.cta.assessment');
  };

  const handleBookAssessment = () => {
    window.open('https://calendly.com/noah-signalperformance/assessment', '_blank');
  };

  useEffect(() => {
    const heroSection = document.getElementById('home');
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Button appears when hero section is NOT intersecting (scrolled past)
        setIsVisible(!entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: '-100px 0px 0px 0px' // Trigger slightly after hero is out of view
      }
    );

    if (heroSection) {
      observer.observe(heroSection);
    }

    return () => {
      if (heroSection) {
        observer.unobserve(heroSection);
      }
    };
  }, []);

  return (
    <div 
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <Button
        onClick={handleBookAssessment}
        className="bg-signal-gold hover:bg-signal-gold/90 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
        size="lg"
      >
        {getAssessmentButtonText()}
      </Button>
    </div>
  );
};

export default FloatingAssessmentButton;