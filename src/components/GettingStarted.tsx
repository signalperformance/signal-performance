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

  return <section id="getting-started" className="section-padding bg-background">
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
          {/* Mobile view of package card */}
          <div className="md:hidden flex justify-center mb-12">
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

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-x-8 gap-y-12 relative">
            {/* Desktop timeline */}
            <div className="hidden md:block absolute left-0 right-0 top-8 z-0 h-0.5 bg-gradient-to-r from-signal-gold/50 via-gray-300 to-signal-gold/50"></div>

            {/* Desktop package annotation */}
            <div className="hidden md:block absolute -top-20 left-0 w-3/4">
                <div className="relative flex flex-col items-center">
                    {/* The bracket line */}
                    <div className="w-full h-12 border-t-2 border-l-2 border-r-2 border-signal-charcoal rounded-t-xl" />
                    
                    {/* The card, centered and sitting on top of the line */}
                    <div className="absolute top-0 -translate-y-1/2">
                        <Card className="bg-signal-charcoal text-white border-signal-gold/50 shadow-xl w-full max-w-[220px]">
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
                </div>
            </div>

            {steps.map((step, index) => (
              <div key={step.title} className="relative z-10 flex flex-col items-center text-center flex-1 group">
                <div className="flex items-center justify-center w-16 h-16 mb-4 bg-signal-gold rounded-full shadow-lg border-4 border-background transition-transform group-hover:scale-105">
                  <span className="text-2xl font-bold text-signal-white">{index + 1}</span>
                </div>
                <h3 className="text-lg font-semibold text-signal-charcoal px-2">{step.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>;
};
export default GettingStarted;
