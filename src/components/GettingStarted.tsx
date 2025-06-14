import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowDown, ArrowRight } from "lucide-react";
const GettingStarted = () => {
  const {
    t
  } = useLanguage();
  const steps = [{
    title: t('gettingStarted.step1.title'),
    description: t('gettingStarted.step1.description')
  }, {
    title: t('gettingStarted.step2.title'),
    description: t('gettingStarted.step2.description')
  }, {
    title: t('gettingStarted.step3.title'),
    description: t('gettingStarted.step3.description')
  }, {
    title: t('gettingStarted.step4.title'),
    description: t('gettingStarted.step4.description')
  }];
  return <section className="section-padding bg-secondary dark:bg-black">
      <div className="container container-padding">
        <div className="mb-14 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-balance">{t('gettingStarted.title')}</h2>
          <p className="mx-auto max-w-xl text-lg text-muted-foreground">{t('gettingStarted.subtitle')}</p>
        </div>

        {/* Steps Grid */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-12 relative">
          {/* Line Connector for Desktop */}
          <div className="hidden md:block absolute left-0 right-0 top-6 z-0 h-0.5 bg-gradient-to-r from-primary/30 via-primary to-primary/30 mx-8"></div>

          {steps.map((step, index) => <div key={index} className="relative z-10 flex flex-col items-center text-center flex-1 group">
              <div className="flex items-center justify-center w-12 h-12 mb-4 bg-gradient-to-br from-primary/80 to-primary rounded-full shadow-lg border-4 border-secondary dark:border-black transition-transform group-hover:scale-105">
                <span className="text-xl font-bold text-primary-foreground">{index + 1}</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm">{step.description}</p>
            </div>)}
        </div>

        {/* Pricing Bracket */}
        <div className="mt-16 pt-8 max-w-5xl mx-auto">
            
        </div>
      </div>
    </section>;
};
export default GettingStarted;