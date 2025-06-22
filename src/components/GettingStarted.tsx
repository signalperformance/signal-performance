import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from 'react';
const GettingStarted = () => {
  const {
    t
  } = useLanguage();
  const steps = [{
    title: t('gettingstarted.step1.title'),
    subtitle: t('gettingstarted.step1.subtitle'),
    hours: t('gettingstarted.step1.hours')
  }, {
    title: t('gettingstarted.step2.title'),
    subtitle: t('gettingstarted.step2.subtitle'),
    hours: t('gettingstarted.step2.hours')
  }, {
    title: t('gettingstarted.step3.title'),
    subtitle: t('gettingstarted.step3.subtitle'),
    hours: t('gettingstarted.step3.hours')
  }, {
    title: t('gettingstarted.step4.title'),
    subtitle: t('gettingstarted.step4.subtitle'),
    hours: t('gettingstarted.step4.hours')
  }];
  return <section id="getting-started" className="section-padding bg-background">
      <div className="container mx-auto container-padding">
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-signal-charcoal">
            {t('gettingstarted.title')}
          </h2>
          <p className="mx-auto text-lg text-muted-foreground">
            {t('gettingstarted.subtitle')}
          </p>
        </div>

        <div className="relative">
          {/* Mobile view */}
          <div className="md:hidden flex flex-col items-center">
            {/* Assessment Package Card */}
            <div className="mb-4">
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
            
            {/* Connector line */}
            <div className="h-8 w-px bg-gray-300" />

            {/* Grouped Steps 1-3 */}
            <div className="w-full max-w-xs bg-muted/50 rounded-xl p-6 border-2 border-dashed border-signal-gold/50">
              <div className="flex flex-col items-center gap-y-10">
                {steps.slice(0, 3).map((step, index) => <div key={step.title} className="flex flex-col items-center text-center w-full">
                    <div className="flex items-center justify-center w-16 h-16 mb-4 bg-signal-gold rounded-full shadow-lg">
                      <span className="text-2xl font-bold text-signal-white">{index + 1}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-signal-charcoal px-2">{step.title}</h3>
                    <p className="text-sm font-medium text-signal-gold mb-1">{step.hours}</p>
                    <p className="text-muted-foreground mt-1 px-4 text-base">{step.subtitle}</p>
                  </div>)}
              </div>
            </div>
            
            {/* Connector line */}
            <div className="h-8 w-px bg-gray-300 my-4" />

            {/* Monthly Program Card */}
            <div className="mb-4">
              <Card className="bg-signal-charcoal text-white border-signal-gold/50 shadow-xl w-full max-w-[280px] sm:max-w-xs text-center">
                  <CardHeader className="p-4">
                      <CardTitle className="text-xl text-signal-gold">
                          {t('gettingstarted.step4.title')}
                      </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                      <p className="text-3xl font-bold text-white mb-2">
                          {t('gettingstarted.monthlyProgram.price')}
                      </p>
                  </CardContent>
              </Card>
            </div>

            {/* Step 4 */}
            {steps[3] && <div className="flex flex-col items-center text-center w-full max-w-xs">
                <div key={steps[3].title} className="w-full">
                  <div className="flex items-center justify-center w-16 h-16 mb-4 bg-signal-gold rounded-full shadow-lg mx-auto">
                    <span className="text-2xl font-bold text-signal-white">{4}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-signal-charcoal px-2">{steps[3].title}</h3>
                  <p className="text-sm font-medium text-signal-gold mb-1">{steps[3].hours}</p>
                  <p className="text-muted-foreground text-sm mt-1 px-4">{steps[3].subtitle}</p>
                </div>
              </div>}
          </div>

          {/* Desktop view */}
          <div className="hidden md:block relative pt-20">
            {/* The gray connecting line for all circles */}
            <div className="absolute h-0.5 bg-gray-300 z-10 top-[105px] left-[12.5%] right-[12.5%]" />

            {/* Assessment package bracket and box */}
            {/* Horizontal line */}
            <div className="absolute h-[3px] bg-signal-charcoal z-20 top-[20px] left-[12.5%] w-1/2" />
            {/* Vertical line left */}
            <div className="absolute w-[3px] bg-signal-charcoal z-20 top-[20px] h-[85px] left-[12.5%]" />
            {/* Vertical line right */}
            <div className="absolute w-[3px] bg-signal-charcoal z-20 top-[20px] h-[85px] left-[62.5%]" />

            {/* The package box */}
            <div className="absolute z-30 top-[20px] left-[37.5%] transform -translate-x-1/2 -translate-y-1/2">
              <div className="bg-signal-charcoal text-white border border-signal-gold/50 shadow-xl rounded-md px-4 py-2 text-center whitespace-nowrap">
                <p className="text-base text-signal-gold font-semibold">
                  {t('gettingstarted.assessmentPackage.title')}
                </p>
                <p className="text-2xl font-bold text-white">
                  {t('gettingstarted.assessmentPackage.price')}
                </p>
              </div>
            </div>

            {/* Monthly Program box */}
            <div className="absolute z-30 top-[20px] left-[87.5%] transform -translate-x-1/2 -translate-y-1/2">
              <div className="bg-signal-charcoal text-white border border-signal-gold/50 shadow-xl rounded-md px-4 py-2 text-center whitespace-nowrap">
                <p className="text-base text-signal-gold font-semibold">
                  {t('gettingstarted.step4.title')}
                </p>
                <p className="text-2xl font-bold text-white">
                  {t('gettingstarted.monthlyProgram.price')}
                </p>
              </div>
            </div>

            {/* Vertical line for Monthly Program */}
            <div className="absolute w-[3px] bg-signal-charcoal z-20 top-[20px] h-[85px] left-[87.5%] transform -translate-x-1/2" />

            <div className="flex justify-between items-start relative">
              {steps.map((step, index) => <div key={step.title} className="relative z-20 flex flex-col items-center text-center flex-1 group px-2">
                  <div className="flex items-center justify-center w-16 h-16 mb-6 bg-background rounded-full shadow-lg border-4 border-background transition-transform group-hover:scale-105">
                    <div className="flex items-center justify-center w-full h-full bg-signal-gold rounded-full text-2xl font-bold text-signal-white">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-signal-charcoal">{step.title}</h3>
                  <p className="text-signal-gold mb-2 font-bold text-sm">{step.hours}</p>
                  <p className="text-sm text-muted-foreground mt-2 max-w-[200px]">{step.subtitle}</p>
                </div>)}
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default GettingStarted;