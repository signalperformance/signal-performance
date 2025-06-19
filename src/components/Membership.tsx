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
    }
  };
  return <section id="membership" className="section-padding bg-signal-light-gray">
      <div className="container mx-auto container-padding">
        <div className="text-center mb-12"> {/* Increased bottom margin for better spacing */}
          <h2 className="text-3xl md:text-4xl font-bold mb-1 font-lora">{t('membership.title')}</h2>
          <p className="text-xl text-muted-foreground font-medium">{t('membership.price')}</p>
          <p className="text-sm text-muted-foreground italic mt-1">{t('membership.subtitle')}</p>
        </div>

        {/* Unified Grid Layout for all screen sizes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8">
          {Object.entries(categories).map(([key, category]) => {
          const item = category.items[0];
          const styles = categoryStyles[key as keyof typeof categoryStyles];
          return <Card key={key} className={cn("shadow-lg rounded-xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-l-4", styles.bg, styles.border)}>
                <CardContent className="p-6 md:p-8 flex-grow flex flex-col">
                  <div className="flex items-center mb-6">
                     
                    <div className="flex-grow">
                      <h3 className="text-xl md:text-2xl font-lora font-medium text-foreground">
                        {category.title}
                      </h3>
                      <p className={cn("text-sm font-semibold", styles.text)}>{category.frequency}</p>
                    </div>
                  </div>

                  <div className="flex-grow">
                    <h4 className="font-medium text-base md:text-lg">{item.title}</h4>
                    <p className="text-muted-foreground text-sm mt-1">
                      {item.description}
                    </p>
                  </div>
                </CardContent>
              </Card>;
        })}
        </div>

        {/* Performance Report Section */}
        <div className="flex justify-center">
          <div className="w-full md:w-1/3">
            <Card className="shadow-lg rounded-xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-l-4 bg-gray-50 border-gray-400">
              <CardContent className="p-6 md:p-8 flex-grow flex flex-col">
                <div className="flex items-center mb-6">
                  <div className="flex-grow">
                    <h3 className="text-xl md:text-2xl font-lora font-medium text-foreground">
                      {t('membership.report.title')}
                    </h3>
                    <p className="text-sm font-semibold text-gray-600">{t('membership.report.frequency')}</p>
                  </div>
                </div>

                <div className="flex-grow">
                  <p className="text-muted-foreground text-sm">
                    {t('membership.report.description')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>;
};
export default Membership;
