
import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect, useRef } from 'react'; // useEffect and useRef might be removable if no longer used for observer
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"; // Added CardHeader, CardTitle, CardDescription
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"; // Tabs are no longer used
// import { cn } from "@/lib/utils"; // cn might not be needed directly here anymore
import { Check } from "lucide-react"; // Check icon might be better suited inside the item card or removed if redundant

const Membership = () => {
  const { t, language } = useLanguage();
  // const [activeCategory, setActiveCategory] = useState("physical"); // No longer needed
  // const sectionRef = useRef<HTMLElement>(null); // No longer needed if observer is removed

  // Intersection observer logic can be removed as tabs are gone
  // useEffect(() => { ... });

  const categories = {
    physical: {
      title: t('membership.physical.title'),
      shortTitle: language === 'zh' ? '身體' : 'Body',
      items: [
        {
          title: t('membership.physical.assessment'),
          description: t('membership.physical.assessment.description')
        },
        {
          title: language === 'zh' ? "每週四次 1 對 3 體能訓練課程" : "1-on-3 Fitness Coaching (4x/Week)",
          description: t('membership.physical.coaching.description')
        }
      ]
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
      default:
        return '#6b7280'; // gray-500
    }
  };

  return (
    <section id="membership" className="section-padding bg-signal-light-gray">
      <div className="container mx-auto container-padding">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-1 font-lora">{t('membership.title')}</h2>
          <p className="text-xl text-muted-foreground font-medium">{t('membership.price')}</p>
          <p className="text-sm text-muted-foreground italic mt-1">{t('membership.subtitle')}</p>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 md:gap-8 space-y-6 md:space-y-8">
          {Object.entries(categories).flatMap(([categoryKey, category]) =>
            category.items.map((item, itemIndex) => (
              <Card 
                key={`${categoryKey}-${itemIndex}`} 
                className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col break-inside-avoid-column"
              >
                <CardHeader className="pb-3 pt-5 px-5 md:px-6"> {/* Adjusted padding */}
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2.5 flex-shrink-0" // Smaller dot
                      style={{ backgroundColor: getCategoryColor(categoryKey) }}
                    ></div>
                    <CardTitle className="text-base md:text-lg font-medium text-foreground leading-tight"> {/* Adjusted text size & leading */}
                      {item.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="px-5 pb-5 md:px-6 md:pb-6 pt-0 flex-grow"> {/* Adjusted padding */}
                  <CardDescription className="text-sm text-muted-foreground">
                    {item.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </section>
  );
};
export default Membership;
