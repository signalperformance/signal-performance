
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
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-signal-charcoal">
            {t('gettingstarted.title')}
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            {t('gettingstarted.subtitle')}
          </p>
        </div>

        <div className="flex flex-col md:flex-row md:items-stretch md:justify-between gap-x-8 gap-y-12 relative">
          {/* Connector line for desktop - adjusted for 5 items */}
          <div className="hidden md:block absolute left-0 right-0 top-8 z-0 h-0.5 bg-gradient-to-r from-signal-gold/50 via-gray-300 to-signal-gold/50 mx-10"></div>

          {steps.map((step, index) => <React.Fragment key={step.title}>
              <div className="relative z-10 flex flex-col items-center text-center flex-1 group">
                <div className="flex items-center justify-center w-16 h-16 mb-4 bg-signal-gold rounded-full shadow-lg border-4 border-background transition-transform group-hover:scale-105">
                  <span className="text-2xl font-bold text-signal-white">{index + 1}</span>
                </div>
                <h3 className="text-lg font-semibold text-signal-charcoal px-2">{step.title}</h3>
              </div>

              {index === 2 && <div className="relative z-10 flex flex-col justify-center flex-1 my-8 md:my-0">
                  <Card className="bg-signal-charcoal text-white border-signal-gold/50 shadow-xl w-full max-w-xs mx-auto transform hover:scale-105 transition-transform duration-300">
                    <CardHeader className="pt-4 pb-2">
                      <CardTitle className="flex items-center justify-center gap-2 text-xl text-signal-gold">
                        {t('gettingstarted.assessmentPackage.title')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center text-center p-4 pt-0">
                      <p className="text-4xl font-bold text-white mb-2">
                        {t('gettingstarted.assessmentPackage.price')}
                      </p>
                      <p className="text-sm text-gray-300 px-2">
                        {t('gettingstarted.assessmentPackage.description')}
                      </p>
                    </CardContent>
                  </Card>
                </div>}
            </React.Fragment>)}
        </div>
      </div>
    </section>;
};
export default GettingStarted;
