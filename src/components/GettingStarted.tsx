
import { useLanguage } from "@/contexts/LanguageContext";

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

        {/* Desktop diagram */}
        <div className="hidden md:block relative max-w-4xl mx-auto">
          {/* Onboarding Program bracket and pricing */}
          <div className="relative mb-16">
            {/* Pricing box */}
            <div className="absolute left-1/2 transform -translate-x-1/2 -top-4 z-20">
              <div className="bg-white dark:bg-gray-900 px-6 py-3 rounded-lg shadow-lg border border-primary/20 text-center">
                <h4 className="font-semibold text-primary text-lg">{t('gettingStarted.onboarding.title')}</h4>
                <p className="text-2xl font-bold text-primary">{t('gettingStarted.onboarding.price')}</p>
              </div>
            </div>
            
            {/* Bracket - positioned to connect steps 1-3 */}
            <div className="absolute top-12 left-0 right-0 z-10">
              {/* Main horizontal bracket line */}
              <div 
                className="absolute h-0.5 bg-primary" 
                style={{
                  left: '12.5%',  // Start from center of step 1
                  right: '37.5%', // End at center of step 3
                  top: '0'
                }}
              ></div>
              
              {/* Left vertical connector to step 1 */}
              <div 
                className="absolute w-0.5 h-8 bg-primary" 
                style={{
                  left: '12.5%',
                  top: '0'
                }}
              ></div>
              
              {/* Right vertical connector to step 3 */}
              <div 
                className="absolute w-0.5 h-8 bg-primary" 
                style={{
                  right: '37.5%',
                  top: '0'
                }}
              ></div>
            </div>
          </div>

          {/* Steps container */}
          <div className="flex justify-between items-start relative pt-8">
            {/* Horizontal connecting line under all steps */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/30 via-primary to-primary/30"></div>

            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center flex-1 relative z-10">
                {/* Step circle */}
                <div className="flex items-center justify-center w-16 h-16 mb-6 bg-gradient-to-br from-primary/80 to-primary rounded-full shadow-lg border-4 border-secondary dark:border-black transition-transform hover:scale-105">
                  <span className="text-2xl font-bold text-primary-foreground">{index + 1}</span>
                </div>
                
                {/* Step content */}
                <div className="max-w-48">
                  <h3 className="text-lg font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                </div>
                
                {/* Monthly Program pricing for step 4 */}
                {index === 3 && (
                  <div className="mt-6 bg-white dark:bg-gray-900 px-6 py-3 rounded-lg shadow-lg border border-primary/20">
                    <h4 className="font-semibold text-primary text-lg">{t('gettingStarted.membership.title')}</h4>
                    <p className="text-2xl font-bold text-primary">{t('gettingStarted.membership.price')}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile layout */}
        <div className="md:hidden space-y-8">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary/80 to-primary rounded-full shadow-lg flex-shrink-0">
                <span className="text-xl font-bold text-primary-foreground">{index + 1}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </div>
            </div>
          ))}
          
          {/* Mobile pricing info */}
          <div className="mt-8 flex flex-col gap-4">
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
      </div>
    </section>
  );
};

export default GettingStarted;
