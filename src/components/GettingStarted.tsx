
import { useLanguage } from "@/contexts/LanguageContext";

const GettingStarted = () => {
  const { t } = useLanguage();

  const steps = [
    {
      title: t('gettingstarted.step1.title'),
    },
    {
      title: t('gettingstarted.step2.title'),
    },
    {
      title: t('gettingstarted.step3.title'),
    },
    {
      title: t('gettingstarted.step4.title'),
    },
  ];

  return (
    <section id="getting-started" className="section-padding bg-background">
      <div className="container mx-auto container-padding">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-signal-charcoal">
            {t('gettingstarted.title')}
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            {t('gettingstarted.subtitle')}
          </p>
        </div>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-12 relative">
          {/* Connector line for desktop */}
          <div className="hidden md:block absolute left-0 right-0 top-8 z-0 h-0.5 bg-gradient-to-r from-signal-gold/50 via-gray-300 to-signal-gold/50 mx-16"></div>

          {steps.map((step, index) => (
            <div key={index} className="relative z-10 flex flex-col items-center text-center flex-1 group">
              <div className="flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-br from-signal-charcoal to-signal-black rounded-full shadow-lg border-4 border-background transition-transform group-hover:scale-105">
                <span className="text-2xl font-bold text-white">{index + 1}</span>
              </div>
              <h3 className="text-lg font-semibold text-signal-charcoal px-2">{step.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GettingStarted;
