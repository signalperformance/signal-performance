
import { useLanguage } from "@/contexts/LanguageContext";

const GettingStarted = () => {
  const { t } = useLanguage();

  const steps = [
    { id: 1, titleKey: 'gettingStarted.step1.title' },
    { id: 2, titleKey: 'gettingStarted.step2.title' },
    { id: 3, titleKey: 'gettingStarted.step3.title' },
    { id: 4, titleKey: 'gettingStarted.step4.title' },
  ];

  return (
    <section id="getting-started" className="section-padding bg-signal-light-gray">
      <div className="container mx-auto text-center container-padding">
        <h2 className="text-4xl font-lora font-bold mb-20 text-signal-charcoal">{t('gettingStarted.title')}</h2>
        
        {/* Desktop View */}
        <div className="hidden md:block relative w-full max-w-5xl mx-auto">
          {/* The main horizontal line connecting all steps */}
          <div className="absolute top-10 left-20 right-20 h-1 bg-signal-charcoal" />
          
          <div className="relative flex justify-between items-start">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center text-center w-40">
                <div className="relative bg-signal-light-gray p-2 z-10">
                  <div className="flex items-center justify-center w-20 h-20 bg-signal-charcoal rounded-full text-white text-3xl font-bold font-lora">
                    {step.id}
                  </div>
                </div>
                <h3 className="mt-4 text-lg font-montserrat font-semibold text-signal-charcoal w-full">{t(step.titleKey)}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-12">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center w-20 h-20 bg-signal-charcoal rounded-full text-white text-3xl font-bold font-lora">
                {step.id}
              </div>
              <h3 className="mt-4 text-lg font-montserrat font-semibold text-signal-charcoal">{t(step.titleKey)}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GettingStarted;
