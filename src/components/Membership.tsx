import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const Membership = () => {
  const {
    t, language
  } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("physical");
  const sectionRef = useRef<HTMLElement>(null);

  // Handle intersection observer for auto-selecting Physical tab when scrolled into view
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setActiveCategory("physical");
      }
    }, {
      threshold: 0.5
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
  
  const categories = {
    physical: {
      title: t('membership.physical.title'),
      shortTitle: language === 'zh' ? '身體' : 'Body',
      items: [{
        title: t('membership.physical.assessment'),
        description: t('membership.physical.assessment.description')
      }, {
        title: t('membership.physical.coaching'),
        description: t('membership.physical.coaching.description')
      }, {
        title: t('membership.physical.train'),
        description: t('membership.physical.train.description')
      }, {
        title: t('membership.physical.app'),
        description: t('membership.physical.app.description')
      }]
    },
    mental: {
      title: t('membership.mental.title'),
      shortTitle: language === 'zh' ? '心理' : 'Mind',
      items: [{
        title: t('membership.mental.coaching'),
        description: t('membership.mental.coaching.description')
      }, {
        title: t('membership.mental.plan'),
        description: t('membership.mental.plan.description')
      }, {
        title: t('membership.mental.toolkit'),
        description: t('membership.mental.toolkit.description')
      }]
    },
    golf: {
      title: t('membership.golf.title'),
      shortTitle: language === 'zh' ? '高爾夫' : 'Golf',
      items: [{
        title: t('membership.golf.simulator'),
        description: t('membership.golf.simulator.description')
      }, {
        title: t('membership.golf.putting'),
        description: t('membership.golf.putting.description')
      }, {
        title: t('membership.golf.tracking'),
        description: t('membership.golf.tracking.description')
      }]
    },
    other: {
      title: t('membership.facility.title'),
      shortTitle: language === 'zh' ? '空間特色' : 'Facility',
      items: [{
        title: t('membership.facility.refresh'),
        description: t('membership.facility.refresh.description')
      }, {
        title: t('membership.facility.atmosphere'),
        description: t('membership.facility.atmosphere.description')
      }]
    }
  };
  
  const getCategoryColor = (key: string) => {
    switch (key) {
      case 'physical':
        return '#3b82f6'; // blue-500
      case 'mental':
        return '#ef4444'; // red-500
      case 'golf':
        return '#22c55e'; // green-500
      case 'other':
        return '#a855f7'; // purple-500
      default:
        return '#6b7280'; // gray-500
    }
  };
  
  return (
    <section id="membership" className="section-padding bg-black text-white" ref={sectionRef}>
      <div className="container mx-auto container-padding">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 font-lora">Membership Options</h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Explore our membership tiers designed to enhance your golf experience, from beginners to seasoned pros.
          </p>
        </div>
        
        {/* Tab Navigation */}
        <div className="overflow-x-auto mb-8">
          <div className="flex border-b border-gray-700 min-w-max">
            {Object.entries(categories).map(([key, category]) => {
              const isActive = activeCategory === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={cn(
                    "px-6 py-3 font-medium text-lg transition-colors relative whitespace-nowrap",
                    isActive 
                      ? "text-white" 
                      : "text-gray-400 hover:text-gray-300"
                  )}
                >
                  {key === 'physical' ? 'Physical Training' : 
                   key === 'mental' ? 'Mental Training' : 
                   key === 'golf' ? 'Golf Training' : 
                   'Facility Features'}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Content Area */}
        <div>
          {/* Section Title */}
          <h3 className="text-2xl font-bold mb-8">
            {activeCategory === 'physical' ? 'Physical Training' : 
             activeCategory === 'mental' ? 'Mental Training' : 
             activeCategory === 'golf' ? 'Golf Training' : 
             'Facility Features'}
          </h3>
          
          {/* Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories[activeCategory as keyof typeof categories].items.map((item, index) => (
              <Card key={index} className="bg-gray-900 border-gray-800 overflow-hidden">
                <CardContent className="p-6">
                  <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                  <p className="text-gray-400">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Membership;
