
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from 'react';

const GettingStarted = () => {
  const { t } = useLanguage();
  const steps = [{
    title: t('gettingstarted.step1.title')
  }, {
    title: t('gettingstarted.step2.title')
  }, {
    title: t('gettingstarted.step3.title')
  }, {
    title: t('gettingstarted.step4.title')
  }];

  const stepsAndPackage = [
    { type: 'step', title: steps[0].title, number: 1 },
    { type: 'step', title: steps[1].title, number: 2 },
    { type: 'package' },
    { type: 'step', title: steps[2].title, number: 3 },
    { type: 'step', title: steps[3].title, number: 4 },
  ];

  return <section id="getting-started" className="section-padding bg-background">
      <div className="container mx-auto container-padding">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-signal-charcoal">
            {t('gettingstarted.title')}
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            {t('gettingstarted.subtitle')}
          </p>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-x-6 gap-y-12 relative">
          {/* Connector line for desktop */}
          <div className="hidden md:block absolute left-0 right-0 top-8 z-0 h-0.5 bg-gradient-to-r from-signal-gold/50 via-gray-300 to-signal-gold/50 mx-10"></div>

          {stepsAndPackage.map((item) => {
            if (item.type === 'package') {
              return (
                <div key="package" className="relative z-10 flex flex-col items-center justify-center text-center flex-1 group md:-mt-4">
                  <Card className="bg-signal-charcoal text-white border-signal-gold/50 shadow-xl w-full max-w-[220px] transform hover:scale-105 transition-transform duration-300">
                      <CardHeader className="p-3 text-center">
                          <CardTitle className="text-base text-signal-gold font-semibold">
                              {t('gettingstarted.assessmentPackage.title')}
                          </CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 pt-0 text-center">
                          <p className="text-2xl font-bold text-white">
                              {t('gettingstarted.assessmentPackage.price')}
                          </p>
                      </CardContent>
                  </Card>
                </div>
              );
            }
            // 'step' type
            return (
              <div key={item.title} className="relative z-10 flex flex-col items-center text-center flex-1 group">
                <div className="flex items-center justify-center w-16 h-16 mb-4 bg-signal-gold rounded-full shadow-lg border-4 border-background transition-transform group-hover:scale-105">
                  <span className="text-2xl font-bold text-signal-white">{item.number}</span>
                </div>
                <h3 className="text-lg font-semibold text-signal-charcoal px-2">{item.title}</h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>;
};
export default GettingStarted;
