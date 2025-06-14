
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowDown, ArrowRight } from "lucide-react";

const GettingStarted = () => {
  const { t } = useLanguage();

  const steps = [
    {
      title: t('gettingStarted.step1.title'),
      description: t('gettingStarted.step1.description')
    },
    {
      title: t('gettingStarted.step2.title'),
      description: t('gettingStarted.step2.description')
    },
    {
      title: t('gettingStarted.step3.title'),
      description: t('gettingStarted.step3.description')
    },
    {
      title: t('gettingStarted.step4.title'),
      description: t('gettingStarted.step4.description')
    }
  ];

  return (
    <section className="section-padding bg-secondary dark:bg-black">
      <div className="container container-padding">
        <div className="mb-20 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-balance">{t('gettingStarted.title')}</h2>
          <p className="mx-auto max-w-xl text-lg text-muted-foreground">{t('gettingStarted.subtitle')}</p>
        </div>

        {/* Steps Grid */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-12 relative">
          {/* Onboarding Program Bracket - positioned to connect step 1 and 3 circles */}
          <div className="hidden md:block absolute z-10" style={{
            left: '12.5%', // Center of first step
            right: '37.5%', // Center of third step (100% - 62.5%)
            top: '24px' // At the level of the numbered circles
          }}>
            <div className="relative">
              {/* Horizontal bracket line connecting step 1 to step 3 */}
              <div className="absolute left-0 right-0 top-0 h-0.5 bg-primary/60"></div>
              {/* Left vertical line down from step 1 circle */}
              <div className="absolute left-0 top-0 w-0.5 h-4 bg-primary/60"></div>
              {/* Right vertical line down from step 3 circle */}
              <div className="absolute right-0 top-0 w-0.5 h-4 bg-primary/60"></div>
              
              {/* Onboarding Program pricing box above bracket */}
              <div className="absolute left-1/2 -top-16 transform -translate-x-1/2 text-center whitespace-nowrap">
                <div className="bg-white dark:bg-gray-900 px-4 py-2 rounded-lg shadow-lg border border-primary/20">
                  <h4 className="font-semibold text-sm text-primary">{t('gettingStarted.onboarding.title')}</h4>
                  <p className="text-lg font-bold">{t('gettingStarted.onboarding.price')}</p>
                  <p className="text-xs text-muted-foreground">{t('gettingStarted.onboarding.type')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main connecting line for all steps */}
          <div className="hidden md:block absolute left-0 right-0 top-6 z-0 h-0.5 bg-gradient-to-r from-primary/30 via-primary to-primary/30 mx-8"></div>

          {steps.map((step, index) => (
            <div key={index} className="relative z-10 flex flex-col items-center text-center flex-1 group">
              <div className="flex items-center justify-center w-12 h-12 mb-4 bg-gradient-to-br from-primary/80 to-primary rounded-full shadow-lg border-4 border-secondary dark:border-black transition-transform group-hover:scale-105">
                <span className="text-xl font-bold text-primary-foreground">{index + 1}</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm">{step.description}</p>
              
              {/* Monthly Program pricing for step 4 */}
              {index === 3 && (
                <div className="mt-4 bg-white dark:bg-gray-900 px-4 py-2 rounded-lg shadow-lg border border-primary/20">
                  <h4 className="font-semibold text-sm text-primary">{t('gettingStarted.membership.title')}</h4>
                  <p className="text-lg font-bold">{t('gettingStarted.membership.price')}</p>
                  <p className="text-xs text-muted-foreground">{t('gettingStarted.membership.type')}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile pricing info */}
        <div className="md:hidden mt-8 flex flex-col gap-4">
          <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg shadow-lg border border-primary/20 text-center">
            <h4 className="font-semibold text-primary">{t('gettingStarted.onboarding.title')}</h4>
            <p className="text-sm text-muted-foreground">{t('gettingStarted.onboarding.includes')}</p>
            <p className="text-xl font-bold">{t('gettingStarted.onboarding.price')}</p>
            <p className="text-sm text-muted-foreground">{t('gettingStarted.onboarding.type')}</p>
          </div>
          <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg shadow-lg border border-primary/20 text-center">
            <h4 className="font-semibold text-primary">{t('gettingStarted.membership.title')}</h4>
            <p className="text-sm text-muted-foreground">{t('gettingStarted.membership.includes')}</p>
            <p className="text-xl font-bold">{t('gettingStarted.membership.price')}</p>
            <p className="text-sm text-muted-foreground">{t('gettingStarted.membership.type')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GettingStarted;
