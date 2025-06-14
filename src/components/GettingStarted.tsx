
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList, Users, FilePieChart, Rocket } from 'lucide-react';

const GettingStarted = () => {
  const { t } = useLanguage();

  const processSteps = [
    {
      icon: <ClipboardList className="w-10 h-10 text-signal-gold" />,
      title: t('gettingStarted.step1.title'),
      description: t('gettingStarted.step1.description'),
    },
    {
      icon: <Users className="w-10 h-10 text-signal-gold" />,
      title: t('gettingStarted.step2.title'),
      description: t('gettingStarted.step2.description'),
    },
    {
      icon: <FilePieChart className="w-10 h-10 text-signal-gold" />,
      title: t('gettingStarted.step3.title'),
      description: t('gettingStarted.step3.description'),
    },
    {
      icon: <Rocket className="w-10 h-10 text-signal-gold" />,
      title: t('gettingStarted.step4.title'),
      description: t('gettingStarted.step4.description'),
    },
  ];

  return (
    <section id="getting-started" className="section-padding bg-gray-50">
      <div className="container mx-auto container-padding">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-lora">{t('gettingStarted.title')}</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">{t('gettingStarted.description')}</p>
        </div>

        <div className="relative">
          {/* Dashed line connector for desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 mt-[-1px]">
            <svg width="100%" height="100%">
              <line x1="0" y1="0" x2="100%" y2="0" strokeDasharray="10, 10" stroke="#d1d5db" strokeWidth="2" />
            </svg>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <Card key={index} className="bg-white text-center shadow-lg hover:shadow-xl transition-shadow duration-300 z-10 border-t-4 border-t-signal-gold">
                <CardHeader>
                  <div className="mx-auto bg-gray-50 rounded-full p-4 w-fit mb-4">
                    {step.icon}
                  </div>
                  <CardTitle className="font-lora text-xl">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GettingStarted;
