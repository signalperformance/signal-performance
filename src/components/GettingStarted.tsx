
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from 'react';

const GettingStarted = () => {
  const { t } = useLanguage();
  const steps = [{
    title: t('gettingstarted.step1.title'),
    subtitle: t('gettingstarted.step1.subtitle')
  }, {
    title: t('gettingstarted.step2.title'),
    subtitle: t('gettingstarted.step2.subtitle')
  }, {
    title: t('gettingstarted.step3.title'),
    subtitle: t('gettingstarted.step3.subtitle')
  }, {
    title: t('gettingstarted.step4.title'),
    subtitle: t('gettingstarted.step4.subtitle')
  }];

  return (
    <section id="getting-started" className="section-padding bg-background">
      <div className="container mx-auto container-padding">
        <div className="text-center mb-14 md:mb-32">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-signal-charcoal">
            {t('gettingstarted.title')}
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            {t('gettingstarted.subtitle')}
          </p>
        </div>

        <div className="relative">
          {/* Mobile view */}
          <div className="md:hidden">
            <div className="flex justify-center mb-12">
              <Card className="bg-signal-charcoal text-white border-signal-gold/50 shadow-xl w-full max-w-[280px] sm:max-w-xs text-center">
                  <CardHeader className="p-4">
                      <CardTitle className="text-xl text-signal-gold">
                          {t('gettingstarted.assessmentPackage.title')}
                      </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                      <p className="text-3xl font-bold text-white mb-2">
                          {t('gettingstarted.assessmentPackage.price')}
                      </p>
                  </CardContent>
              </Card>
            </div>
            <div className="flex flex-col items-center gap-y-12">
              {steps.map((step, index) => (
                <div key={step.title} className="flex flex-col items-center text-center w-full max-w-xs">
                  <div className="flex items-center justify-center w-16 h-16 mb-4 bg-signal-gold rounded-full shadow-lg">
                    <span className="text-2xl font-bold text-signal-white">{index + 1}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-signal-charcoal px-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm mt-1 px-4">{step.subtitle}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop view */}
          <div className="hidden md:block relative" style={{ paddingTop: '80px' }}>
            {/* The gray connecting line for all circles */}
            <div className="absolute h-0.5 bg-gray-300 z-10" style={{ top: 'calc(80px + 32px)', left: '12.5%', right: '12.5%' }}></div>

            {/* Assessment package bracket and box */}
            {/* Horizontal line */}
            <div className="absolute h-[3px] bg-signal-charcoal z-20" style={{ top: '60px', left: '12.5%', width: '50%' }}></div>
            {/* Vertical line left */}
            <div className="absolute w-[3px] bg-signal-charcoal z-20" style={{ top: '60px', height: 'calc(80px + 32px - 60px)', left: '12.5%' }}></div>
            {/* Vertical line right */}
            <div className="absolute w-[3px] bg-signal-charcoal z-20" style={{ top: '60px', height: 'calc(80px + 32px - 60px)', left: '62.5%' }}></div>

            {/* The package box */}
            <div className="absolute z-30" style={{ top: '60px', left: '37.5%', transform: 'translate(-50%, -50%)' }}>
              <div className="bg-signal-charcoal text-white border border-signal-gold/50 shadow-xl rounded-md px-4 py-2 text-center whitespace-nowrap">
                <p className="text-base text-signal-gold font-semibold">
                  {t('gettingstarted.assessmentPackage.title')}
                </p>
                <p className="text-2xl font-bold text-white">
                  {t('gettingstarted.assessmentPackage.price')}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-start relative">
              {steps.map((step, index) => (
                <div key={step.title} className="relative z-20 flex flex-col items-center text-center flex-1 group px-2">
                  <div className="flex items-center justify-center w-16 h-16 mb-4 bg-signal-gold rounded-full shadow-lg border-4 border-background transition-transform group-hover:scale-105">
                    <span className="text-2xl font-bold text-signal-white">{index + 1}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-signal-charcoal">{step.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2 max-w-[200px]">{step.subtitle}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default GettingStarted;
