
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef, useMemo } from 'react';

const Membership = () => {
  const { t } = useLanguage();
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
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Add a small delay to ensure smooth loading
          setTimeout(() => setIsLoaded(true), 100);
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: '50px 0px', // Start loading 50px before element comes into view
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);
  
  return (
    <section ref={sectionRef} id="membership" className="section-padding bg-signal-light-gray">
      <div className="container mx-auto container-padding">
        <div className={cn(
          "text-center mb-12 transition-all duration-700 ease-out",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <h2 className="text-3xl md:text-4xl font-bold font-lora">{t('membership.title')}</h2>
        </div>

        {/* Show skeleton/loading state before content is loaded */}
        {!isLoaded && isVisible && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-xl h-64 shadow-lg"></div>
              </div>
            ))}
          </div>
        )}

        {/* Actual content with fade-in animation */}
        <div className={cn(
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 transition-all duration-1000 ease-out",
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          {isLoaded && Object.entries(categories).map(([key, category], index) => {
            const item = category.items[0];
            const styles = categoryStyles[key as keyof typeof categoryStyles];
            return (
              <Card 
                key={key} 
                className={cn(
                  "shadow-2xl rounded-xl overflow-hidden flex flex-col border-l-4 border-2 border-slate-200/60 backdrop-blur-sm hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1",
                  getGradientBackground(key), 
                  styles.border,
                  // Staggered animation delay for each card
                  isLoaded ? "animate-fade-in" : ""
                )}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <CardContent className="p-6 md:p-8 flex-grow flex flex-col relative overflow-hidden text-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-slate-50/30 to-blue-50/20 pointer-events-none"></div>
                  
                  <div className="mb-1 relative z-10">
                    <h3 className="text-3xl font-lora font-medium text-foreground mb-1 md:text-3xl">
                      {category.title}
                    </h3>
                    <p className={cn("text-xl md:text-2xl font-bold", styles.text)}>
                      {category.frequency}
                    </p>
                  </div>

                  {/* Subtle dash separator */}
                  <div className="mb-4 relative z-10">
                    <div className="text-muted-foreground text-lg">—</div>
                  </div>

                  <div className="flex-grow relative z-10">
                    <h4 className={cn("mb-2 font-bold text-xl md:text-lg", styles.text)}>{item.title}</h4>
                    <p className="text-muted-foreground text-sm">
                      {item.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Membership;
