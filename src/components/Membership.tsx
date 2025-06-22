import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
const Membership = () => {
  const {
    t
  } = useLanguage();
  const categories = {
    physical: {
      title: t('membership.physical.title'),
      frequency: t('membership.physical.frequency'),
      items: [{
        title: t('membership.physical.coaching'),
        description: t('membership.physical.coaching.description')
      }]
    },
    mental: {
      title: t('membership.mental.title'),
      frequency: t('membership.mental.frequency'),
      items: [{
        title: t('membership.mental.coaching'),
        description: t('membership.mental.coaching.description')
      }]
    },
    golf: {
      title: t('membership.golf.title'),
      frequency: t('membership.golf.frequency'),
      items: [{
        title: t('membership.golf.skillassessment'),
        description: t('membership.golf.skillassessment.description')
      }]
    },
    report: {
      title: t('membership.report.title'),
      frequency: t('membership.report.frequency'),
      items: [{
        title: t('membership.report.performancereport'),
        description: t('membership.report.description')
      }]
    }
  };
  const categoryStyles = {
    physical: {
      bg: 'bg-signal-physical-light',
      border: 'border-signal-physical',
      text: 'text-signal-physical'
    },
    mental: {
      bg: 'bg-signal-mental-light',
      border: 'border-signal-mental',
      text: 'text-signal-mental'
    },
    golf: {
      bg: 'bg-signal-golf-light',
      border: 'border-signal-golf',
      text: 'text-signal-golf'
    },
    report: {
      bg: 'bg-gray-50',
      border: 'border-gray-400',
      text: 'text-gray-600'
    }
  };
  const getGradientBackground = (key: string) => {
    switch (key) {
      case 'physical':
        return 'bg-gradient-to-br from-blue-50 via-white to-blue-50/40';
      case 'mental':
        return 'bg-gradient-to-br from-red-50 via-white to-red-50/40';
      case 'golf':
        return 'bg-gradient-to-br from-green-50 via-white to-green-50/40';
      case 'report':
        return 'bg-gradient-to-br from-gray-50 via-white to-gray-50/40';
      default:
        return 'bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/40';
    }
  };
  return <section id="membership" className="section-padding bg-signal-light-gray">
      <div className="container mx-auto container-padding">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-lora">{t('membership.title')}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Object.entries(categories).map(([key, category]) => {
          const item = category.items[0];
          const styles = categoryStyles[key as keyof typeof categoryStyles];
          return <Card key={key} className={cn("shadow-2xl rounded-xl overflow-hidden flex flex-col border-l-4 border-2 border-slate-200/60 backdrop-blur-sm hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1", getGradientBackground(key), styles.border)}>
                <CardContent className="p-6 md:p-8 flex-grow flex flex-col relative overflow-hidden text-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-slate-50/30 to-blue-50/20 pointer-events-none"></div>
                  
                  <div className="mb-6 relative z-10">
                    <h3 className="md:text-2xl font-lora font-medium text-foreground mb-3 text-2xl">
                      {category.title}
                    </h3>
                    <p className={cn("text-xl md:text-2xl font-bold", styles.text)}>
                      {category.frequency}
                    </p>
                  </div>

                  <div className="flex-grow relative z-10">
                    <h4 className="mb-2 font-bold md:text-lg text-lg">{item.title}</h4>
                    <p className="text-muted-foreground text-base">
                      {item.description}
                    </p>
                  </div>
                </CardContent>
              </Card>;
        })}
        </div>
      </div>
    </section>;
};
export default Membership;