import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from 'react';

const GettingStarted = () => {
  const { t } = useLanguage();

  const steps = [
    {
      title: t('gettingstarted.step1.title'),
      subtitle: t('gettingstarted.step1.subtitle'),
      hours: t('gettingstarted.step1.hours')
    },
    {
      title: t('gettingstarted.step2.title'),
      subtitle: t('gettingstarted.step2.subtitle'),
      hours: t('gettingstarted.step2.hours')
    },
    {
      title: t('gettingstarted.step3.title'),
      subtitle: t('gettingstarted.step3.subtitle'),
      hours: t('gettingstarted.step3.hours')
    },
    {
      title: t('gettingstarted.step4.title'),
      subtitle: t('gettingstarted.step4.subtitle'),
      hours: t('gettingstarted.step4.hours')
    }
  ];

  return (
    <section id="getting-started" className="section-padding bg-signal-light-gray">
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
          {/* Pricing badges row (always visible) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto mb-10">
            <Card className="bg-signal-charcoal text-white border-signal-gold/50 shadow-xl text-center">
              <CardHeader className="p-4">
                <CardTitle className="text-signal-gold text-xl md:text-2xl">
                  {t('gettingstarted.assessmentPackage.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-2xl md:text-3xl font-bold text-white">
                  {t('gettingstarted.assessmentPackage.price')}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-signal-charcoal text-white border-signal-gold/50 shadow-xl text-center">
              <CardHeader className="p-4">
                <CardTitle className="text-signal-gold text-xl md:text-2xl">
                  {t('gettingstarted.step4.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-2xl md:text-3xl font-bold text-white">
                  {t('gettingstarted.monthlyProgram.price')}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Vertical timeline for mobile and tablets */}
          <div className="lg:hidden mx-auto max-w-xl">
            <ol className="relative border-l border-muted pl-6 space-y-8">
              {steps.map((step, index) => (
                <li key={step.title} className="relative">
                  <span className="absolute -left-[11px] flex items-center justify-center w-6 h-6 rounded-full bg-signal-gold text-signal-white text-xs font-bold ring-4 ring-background">
                    {index + 1}
                  </span>
                  <h3 className="text-signal-charcoal font-semibold text-xl md:text-2xl pr-2">{step.title}</h3>
                  <p className="text-signal-gold font-bold mt-1">{step.hours}</p>
                  <p className="text-muted-foreground mt-1 text-base">{step.subtitle}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Horizontal stepper for desktops */}
          <div className="hidden lg:flex items-start gap-4">
            {steps.map((step, index) => (
              <React.Fragment key={step.title}>
                <div className="flex flex-col items-center text-center min-w-[180px] max-w-[220px] px-2">
                  <div className="mb-4">
                    <div className="w-16 h-16 rounded-full bg-signal-gold text-signal-white flex items-center justify-center text-2xl font-bold shadow-lg">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="font-semibold text-signal-charcoal text-xl">{step.title}</h3>
                  <p className="text-signal-gold font-bold mt-1">{step.hours}</p>
                  <p className="text-muted-foreground mt-2 text-sm max-w-[220px]">{step.subtitle}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="h-1 flex-1 bg-muted self-center rounded-full" aria-hidden="true" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GettingStarted;
