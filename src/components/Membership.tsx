
import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

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
      shortTitle: language === 'zh' ? '其他' : 'Other',
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
  
  return <section id="membership" className="section-padding bg-signal-light-gray" ref={sectionRef}>
      <div className="container mx-auto container-padding">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-1 font-lora">{t('membership.title')}</h2>
          <p className="text-xl text-muted-foreground font-medium">{t('membership.price')}</p>
          <p className="text-sm text-muted-foreground italic mt-1">{t('membership.subtitle')}</p>
        </div>
        
        {/* Desktop View - Now using tabs like mobile */}
        <div className="hidden md:block">
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
            <TabsList className="flex justify-center mb-6 rounded-xl p-1.5 bg-muted/20 shadow-sm">
              {Object.entries(categories).map(([key, category]) => {
                const isActive = activeCategory === key;
                const categoryColor = getCategoryColor(key);
                
                return (
                  <TabsTrigger 
                    key={key} 
                    value={key} 
                    className={cn(
                      "py-3 px-6 rounded-lg cursor-pointer transition-all min-w-[120px]",
                      isActive ? "bg-white shadow-md" : "hover:bg-muted/40"
                    )}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: categoryColor }}
                      ></div>
                      <span className={cn(
                        "font-medium",
                        isActive ? "text-foreground" : "text-muted-foreground"
                      )}>
                        {category.title}
                      </span>
                    </div>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {/* Content for each tab */}
            {Object.entries(categories).map(([key, category]) => (
              <TabsContent key={key} value={key} className="mt-0">
                <Card className="bg-white shadow-lg rounded-xl overflow-hidden">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-lora mb-6 font-medium">{category.title}</h3>
                    
                    <div className="grid gap-6">
                      {category.items.map((item, index) => (
                        <div key={index} className="flex items-start gap-4 pb-5 border-b last:border-0 last:pb-0">
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white mt-0.5 flex-shrink-0" 
                            style={{ backgroundColor: getCategoryColor(key) }}
                          >
                            <Check className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="font-medium text-lg">{item.title}</h4>
                            <p className="text-muted-foreground mt-1">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Mobile View - Modified to remove colored dots to save space */}
        <div className="md:hidden">
          {/* Category Pills - Horizontal Scrolling - Removed colored dots */}
          <div className="mb-6 overflow-x-auto pb-2 no-scrollbar">
            <div className="flex gap-2 min-w-full">
              {Object.entries(categories).map(([key, category]) => {
                const isActive = activeCategory === key;
                const categoryColor = getCategoryColor(key);
                
                return (
                  <div 
                    key={key} 
                    className={cn(
                      "py-2 px-3 rounded-lg cursor-pointer transition-all flex-1 min-w-0",
                      isActive 
                        ? "bg-white shadow-md" 
                        : "hover:bg-muted/40 bg-muted/20"
                    )}
                    onClick={() => setActiveCategory(key)}
                    style={isActive ? { borderBottom: `2px solid ${categoryColor}` } : {}}
                  >
                    <span className={cn(
                      "font-medium text-sm text-center block truncate",
                      isActive ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {category.shortTitle}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Content Card */}
          <Card className="bg-white shadow-md rounded-xl overflow-hidden">
            <CardContent className="p-6">
              <h3 className="text-xl font-lora mb-4 font-medium">{categories[activeCategory as keyof typeof categories].title}</h3>
              
              <div className="space-y-6">
                {categories[activeCategory as keyof typeof categories].items.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0">
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white mt-0.5 flex-shrink-0" 
                      style={{ backgroundColor: getCategoryColor(activeCategory) }}
                    >
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-base">{item.title}</h4>
                      <p className="text-muted-foreground text-sm mt-1">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>;
};
export default Membership;
