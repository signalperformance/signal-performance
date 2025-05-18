
import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect, useRef } from 'react';
import { Check } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const Membership = () => {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("physical");
  const sectionRef = useRef<HTMLElement>(null);
  
  // Handle intersection observer for auto-selecting Physical tab when scrolled into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActiveCategory("physical");
        }
      },
      { threshold: 0.5 }
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
  
  const categories = {
    physical: {
      title: "Physical Training",
      items: [
        {
          title: t('membership.fitness.title'),
          description: t('membership.fitness.description'),
        },
        {
          title: t('membership.training.title'),
          description: t('membership.training.description'),
        }
      ]
    },
    mental: {
      title: "Mental Training",
      items: [
        {
          title: t('membership.mental.title'),
          description: t('membership.mental.description'),
        }
      ]
    },
    golf: {
      title: "Golf Training",
      items: [
        {
          title: t('membership.simulator.title'),
          description: t('membership.simulator.description'),
        }
      ]
    },
    other: {
      title: "Other Benefits",
      items: [
        {
          title: "Networking Events",
          description: "Regular networking events with golf professionals and industry experts",
        },
        {
          title: "Equipment Analysis",
          description: "Quarterly equipment reviews and fitting sessions with specialists",
        }
      ]
    }
  };

  return (
    <section id="membership" className="section-padding bg-signal-light-gray" ref={sectionRef}>
      <div className="container mx-auto container-padding">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-lora">{t('membership.title')}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t('membership.subtitle')}</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature Categories on the Left */}
          <div className="md:col-span-1">
            <div className="space-y-3">
              {Object.entries(categories).map(([key, category]) => (
                <div
                  key={key}
                  className={cn(
                    "p-6 rounded-lg cursor-pointer transition-all duration-200",
                    activeCategory === key 
                      ? "bg-white shadow-md border-l-4 border-signal-gold" 
                      : "bg-white/50 hover:bg-white"
                  )}
                  onClick={() => setActiveCategory(key)}
                >
                  <h3 className="font-medium text-lg font-lora">{category.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {activeCategory === key ? `${category.items.length} features available` : "Click to view details"}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Feature Details on the Right */}
          <div className="md:col-span-2">
            <Card className="bg-white shadow-md h-full">
              <CardContent className="p-6 md:p-8">
                <h3 className="text-2xl font-lora mb-6">{categories[activeCategory as keyof typeof categories].title}</h3>
                
                <div className="space-y-8">
                  {categories[activeCategory as keyof typeof categories].items.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="bg-signal-gold/10 rounded-full p-1.5">
                          <Check className="text-signal-gold h-5 w-5" />
                        </div>
                        <h4 className="font-lora font-medium text-xl">{item.title}</h4>
                      </div>
                      <p className="text-muted-foreground ml-10">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Membership;
