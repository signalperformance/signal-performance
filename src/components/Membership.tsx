
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '@/components/ui/table';
import { Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from "@/components/ui/card";

const Membership = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("physical");
  const sectionRef = useRef<HTMLElement>(null);
  
  // Handle intersection observer for auto-selecting Physical tab when scrolled into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActiveTab("physical");
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
    physical: [
      {
        title: t('membership.fitness.title'),
        description: t('membership.fitness.description'),
      },
      {
        title: t('membership.training.title'),
        description: t('membership.training.description'),
      }
    ],
    mental: [
      {
        title: t('membership.mental.title'),
        description: t('membership.mental.description'),
      }
    ],
    golf: [
      {
        title: t('membership.simulator.title'),
        description: t('membership.simulator.description'),
      }
    ],
    other: [
      {
        title: "Networking Events",
        description: "Regular networking events with golf professionals and industry experts",
      },
      {
        title: "Equipment Analysis",
        description: "Quarterly equipment reviews and fitting sessions with specialists",
      }
    ]
  };

  return (
    <section id="membership" className="section-padding bg-signal-light-gray" ref={sectionRef}>
      <div className="container mx-auto container-padding">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-lora">{t('membership.title')}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t('membership.subtitle')}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Category Buttons on the Left */}
            <div className="w-full md:w-1/4 bg-signal-charcoal p-4 md:p-0">
              <div className="flex md:flex-col overflow-x-auto md:h-full">
                {Object.entries({
                  physical: "Physical Training",
                  mental: "Mental Training",
                  golf: "Golf Training",
                  other: "Other Benefits"
                }).map(([key, label]) => (
                  <Button
                    key={key}
                    variant="ghost"
                    className={`flex-1 md:flex-none justify-start px-6 py-4 rounded-none border-b border-signal-charcoal/20 text-left ${
                      activeTab === key 
                        ? "bg-signal-gold/20 text-white font-medium"
                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                    }`}
                    onClick={() => setActiveTab(key)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Feature Details on the Right */}
            <div className="w-full md:w-3/4 p-0">
              <Card className="rounded-none border-0 shadow-none h-full">
                <CardContent className="p-0">
                  {Object.entries(categories).map(([key, features]) => (
                    <div
                      key={key}
                      className={`${activeTab === key ? "block" : "hidden"}`}
                    >
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-signal-light-gray hover:bg-signal-light-gray">
                            <TableHead className="text-signal-charcoal font-lora text-xl p-6 w-1/3">Feature</TableHead>
                            <TableHead className="text-signal-charcoal font-lora text-xl p-6 w-2/3">Details</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {features.map((feature, index) => (
                            <TableRow key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                              <TableCell className="p-6 align-top border-b">
                                <div className="flex items-center gap-3">
                                  <Badge variant="outline" className="bg-signal-gold bg-opacity-10 text-signal-charcoal border-signal-gold px-3 py-1.5">
                                    {index + 1}
                                  </Badge>
                                  <span className="font-medium text-lg font-lora">{feature.title}</span>
                                </div>
                              </TableCell>
                              <TableCell className="p-6 border-b">
                                <div className="flex items-center gap-2">
                                  <Check className="text-signal-gold h-5 w-5 flex-shrink-0" />
                                  <span className="text-muted-foreground">{feature.description}</span>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Membership;
