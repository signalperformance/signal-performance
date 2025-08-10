import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef, useMemo } from 'react';
const Membership = () => {
  const {
    t
  } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Memoize categories to prevent unnecessary recalculations
  const categories = useMemo(() => ({
    physical: {
      title: t('membership.physical.title'),
      frequency: t('membership.physical.frequency'),
      items: [{
        title: t('membership.physical.coaching'),
        description: t('membership.physical.coaching.description')
      }]
    },
    mental: {
      title: t('membership.mental.title'),
      frequency: t('membership.mental.frequency'),
      items: [{
        title: t('membership.mental.coaching'),
        description: t('membership.mental.coaching.description')
      }]
    },
    golf: {
      title: t('membership.golf.title'),
      frequency: t('membership.golf.frequency'),
      items: [{
        title: t('membership.golf.skillassessment'),
        description: t('membership.golf.skillassessment.description')
      }]
    },
    report: {
      title: t('membership.report.title'),
      frequency: t('membership.report.frequency'),
      items: [{
        title: t('membership.report.performancereport'),
        description: t('membership.report.description')
      }]
    }
  }), [t]);

  // Memoize category styles to prevent recalculation
  const categoryStyles = useMemo(() => ({
    physical: {
      bg: 'bg-signal-physical-light',
      border: 'border-signal-physical',
      text: 'text-signal-physical'
    },
    mental: {
      bg: 'bg-signal-mental-light',
      border: 'border-signal-mental',
      text: 'text-signal-mental'
    },
    golf: {
      bg: 'bg-signal-golf-light',
      border: 'border-signal-golf',
      text: 'text-signal-golf'
    },
    report: {
      bg: 'bg-gray-50',
      border: 'border-gray-400',
      text: 'text-gray-600'
    }
  }), []);

  // Memoize gradient background function
  const getGradientBackground = useMemo(() => (key: string) => {
    switch (key) {
      case 'physical':
        return 'bg-gradient-to-br from-blue-50 via-white to-blue-50/40';
      case 'mental':
        return 'bg-gradient-to-br from-red-50 via-white to-red-50/40';
      case 'golf':
        return 'bg-gradient-to-br from-green-50 via-white to-green-50/40';
      case 'report':
        return 'bg-gradient-to-br from-gray-50 via-white to-gray-50/40';
      default:
        return 'bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/40';
    }
  }, []);

  // Intersection Observer for visibility detection
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        setIsVisible(true);
        // Add a small delay to ensure smooth loading
        setTimeout(() => setIsLoaded(true), 100);
      }
    }, {
      threshold: 0.1,
      // Trigger when 10% of the element is visible
      rootMargin: '50px 0px' // Start loading 50px before element comes into view
    });
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);
  return null;
};
export default Membership;