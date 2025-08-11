import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import React from 'react';
// Compact monthly plan card used in mobile and desktop
const PlanMiniCard: React.FC<{ title: string; description: string; price: string; badgeLabel?: string }> = ({ title, description, price, badgeLabel }) => (
  <Card className="w-full rounded-xl border border-border bg-card p-4 shadow-sm overflow-hidden">
    <div className="flex items-start justify-between gap-3">
      <h4 className="font-semibold text-foreground text-lg leading-tight">{title}</h4>
      {badgeLabel ? <Badge className="whitespace-nowrap">{badgeLabel}</Badge> : null}
    </div>
    <p className="text-primary font-bold mt-1">{price}</p>
    <p className="text-muted-foreground mt-1 text-sm">{description}</p>
  </Card>
);

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
  return <section id="getting-started" className="section-padding bg-card overflow-x-hidden">
      <div className="container mx-auto container-padding">
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-foreground">
            {t('gettingstarted.title')}
          </h2>
          <p className="mx-auto text-lg text-muted-foreground">
            {t('gettingstarted.subtitle')}
          </p>
        </div>

        <div className="relative">
          {/* Mobile/Tablet: Vertical timeline with group headers */}
          <div className="lg:hidden mx-auto max-w-xl">
            <ol className="relative border-l border-muted pl-6 space-y-8">
              {/* Group: Assessment Package covers steps 1–3 */}
              <li className="relative">
                <div className="pl-4 border-l-4 border-primary">
                  <div className="bg-card text-card-foreground rounded-md p-3 shadow border border-border">
                    <div className="flex items-baseline justify-between gap-2">
                      <h4 className="font-semibold text-signal-charcoal text-lg leading-tight tracking-tight">{t('gettingstarted.assessmentPackage.title')}</h4>
                      <span className="text-sm font-semibold text-signal-charcoal whitespace-nowrap">{t('gettingstarted.assessmentPackage.price')}</span>
                    </div>
                    
                  </div>
                </div>
              </li>

              {steps.slice(0, 3).map((step, index) => <li key={step.title} className="relative">
                  
                  <div className="w-full rounded-xl border border-border bg-card p-4 shadow-sm overflow-hidden">
                    <h3 className="text-foreground font-semibold text-xl md:text-2xl pr-2">{step.title}</h3>
                    <p className="text-primary font-bold mt-1">{step.hours}</p>
                    <p className="text-muted-foreground mt-1 text-base">{step.subtitle}</p>
                  </div>
                </li>)}

              {/* Group: Monthly Program covers step 4 */}
              <li className="relative">
                <div className="pl-4 border-l-4 border-primary">
                  <div className="bg-primary text-primary-foreground rounded-md p-3 shadow">
                    <div className="flex items-baseline justify-between gap-2">
                      <h4 className="text-primary-foreground font-semibold text-lg leading-tight tracking-tight">{t('gettingstarted.step4.title')}</h4>
                      <span className="text-sm font-bold text-primary-foreground whitespace-nowrap">{t('gettingstarted.monthlyProgram.price')}</span>
                    </div>
                    
                  </div>
                </div>
              </li>

              {/* Monthly Program Packages */}
              <li className="relative">
                <PlanMiniCard
                  title={t('pricing.plus.name')}
                  description={t('pricing.plus.description')}
                  price={t('gettingstarted.monthlyProgram.price')}
                  badgeLabel={t('pricing.mostPopular')}
                />
              </li>
              <li className="relative">
                <PlanMiniCard
                  title={t('pricing.foundations.name')}
                  description={t('pricing.foundations.description')}
                  price="NT$10,000/month"
                />
              </li>

              {/* Step 4 */}
              <li className="relative">
                
                <div className="w-full rounded-xl border border-primary/30 bg-primary/5 p-4 shadow-sm overflow-hidden">
                  <h3 className="text-foreground font-semibold text-xl md:text-2xl pr-2">{steps[3].title}</h3>
                  <p className="text-primary font-bold mt-1">{steps[3].hours}</p>
                  <p className="text-muted-foreground mt-1 text-base">{steps[3].subtitle}</p>
                </div>
              </li>
            </ol>
          </div>

          {/* Desktop: Aligned badges above their covered steps */}
          <div className="hidden lg:grid grid-cols-4 gap-4">
            {/* Assessment Package above steps 1–3 */}
            <div className="col-span-2">
              <Card className="bg-signal-charcoal text-signal-white border border-border shadow-xl text-center">
                <CardHeader className="p-4">
                  <CardTitle className="text-2xl md:text-3xl leading-tight tracking-tight text-signal-white">
                    {t('gettingstarted.assessmentPackage.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-base md:text-lg font-medium text-signal-white whitespace-nowrap">
                    {t('gettingstarted.assessmentPackage.price')}
                  </p>
                </CardContent>
              </Card>
              
              <div className="mx-auto mt-2 w-0 h-0 border-l-8 border-r-8 border-transparent border-t-primary" aria-hidden="true" />
              <div className="mt-4 flex items-start gap-4">
                {steps.slice(0, 3).map((step, index) => (
                  <React.Fragment key={step.title}>
                    <div className="flex flex-col items-center text-center min-w-[180px] max-w-[220px] rounded-xl border border-signal-charcoal/30 bg-signal-charcoal/5 p-5 shadow-sm overflow-hidden">
                      <div className="mb-4">
                        
                      </div>
                      <h3 className="font-semibold text-foreground text-xl">{step.title}</h3>
                      <p className="text-primary font-bold mt-1">{step.hours}</p>
                      <p className="text-muted-foreground mt-2 text-sm max-w-[220px]">{step.subtitle}</p>
                    </div>
                    {index < 2 && <div className="h-1 flex-1 bg-muted self-center rounded-full" aria-hidden="true" />}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Monthly Program above step 4 */}
            <div className="col-span-2">
              <Card className="bg-primary text-primary-foreground border border-primary/40 shadow-xl text-center">
                <CardHeader className="p-4">
                  <CardTitle className="text-2xl md:text-3xl leading-tight tracking-tight text-primary-foreground">
                    {t('gettingstarted.step4.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-base md:text-lg font-semibold text-primary-foreground whitespace-nowrap">
                    {t('gettingstarted.monthlyProgram.price')}
                  </p>
                </CardContent>
              </Card>
              
              <div className="mx-auto mt-2 w-0 h-0 border-l-8 border-r-8 border-transparent border-t-primary" aria-hidden="true" />
              <div className="mt-4 space-y-3">
                <PlanMiniCard
                  title={t('pricing.plus.name')}
                  description={t('pricing.plus.description')}
                  price={t('gettingstarted.monthlyProgram.price')}
                  badgeLabel={t('pricing.mostPopular')}
                />
                <PlanMiniCard
                  title={t('pricing.foundations.name')}
                  description={t('pricing.foundations.description')}
                  price="NT$10,000/month"
                />
              </div>
            </div>

            {/* Steps 1–3 moved next to Assessment Package for alignment */}

          </div>
        </div>
      </div>
    </section>;
};
export default GettingStarted;