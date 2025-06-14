import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const Membership = () => {
  const { t, language } = useLanguage();
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
      items: [
        {
          title: language === 'zh' ? "每週四次 1 對 3 體能訓練課程" : "1-on-3 Fitness Coaching (4x/Week)",
          description: t('membership.physical.coaching.description')
        },
        {
          title: t('membership.physical.assessment'),
          description: t('membership.physical.assessment.description')
        }
      ]
    },
    mental: {
      title: t('membership.mental.title'),
      shortTitle: language === 'zh' ? '心理' : 'Mind',
      items: [{
        title: t('membership.mental.coaching'),
        description: t('membership.mental.coaching.description')
      }, 
      {
        title: t('membership.mental.toolkit'),
        description: t('membership.mental.toolkit.description')
      }]
    },
    golf: {
      title: t('membership.golf.title'),
      shortTitle: language === 'zh' ? '高爾夫' : 'Golf',
      items: [{
        title: language === 'zh' ? '高爾夫技能評估（每月一次）' : 'Golf Skill Assessment (1x/month)',
        description: language === 'zh' ? '透過模擬器進行結構化評估，追蹤進步成果。' : 'Track progress with a structured simulator-based evaluation.'
      }, 
      {
        title: t('membership.golf.tracking'),
        description: t('membership.golf.tracking.description')
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
    <section id="membership" className="section-padding bg-signal-light-gray">
      <div className="container mx-auto container-padding">
        <div className="text-center mb-12"> {/* Increased bottom margin for better spacing */}
          <h2 className="text-3xl md:text-4xl font-bold mb-1 font-lora">{t('membership.title')}</h2>
          <p className="text-xl text-muted-foreground font-medium">{t('membership.price')}</p>
          <p className="text-sm text-muted-foreground italic mt-1">{t('membership.subtitle')}</p>
        </div>

        {/* Unified Grid Layout for all screen sizes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {Object.entries(categories).map(([key, category]) => (
            <Card key={key} className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col">
              <CardContent className="p-6 md:p-8 flex-grow"> {/* Use p-6 for mobile, p-8 for desktop */}
                <div className="flex items-center mb-6">
                  <h3 className="text-xl md:text-2xl font-lora font-medium text-foreground">
                    {category.title}
                  </h3>
                </div>

                <div className="space-y-5"> {/* Consistent spacing for items */}
                  {category.items.map((item, index) => (
                    <div key={index} className="flex items-start gap-3"> {/* Consistent gap */}
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white mt-0.5 flex-shrink-0"
                        style={{ backgroundColor: getCategoryColor(key) }}
                      >
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-base md:text-lg">{item.title}</h4>
                        <p className="text-muted-foreground text-sm mt-1">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Membership;
