
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from "@/components/ui/card";

const Membership = () => {
  const { t } = useLanguage();

  const categories = {
    physical: {
      title: t('membership.physical.title'),
      frequency: t('membership.physical.frequency'),
      items: [
        {
          title: t('membership.physical.coaching'),
          description: t('membership.physical.coaching.description')
        }
      ]
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
  
  const getCategoryColor = (key: string) => {
    switch (key) {
      case 'physical':
        return '#3b82f6'; // blue-500
      case 'mental':
        return '#ef4444'; // red-500
      case 'golf':
        return '#22c55e'; // green-500
      case 'other':
        return '#a855f7'; // purple-500
      default:
        return '#6b7280'; // gray-500
    }
  };
  
  return (
    <section id="membership" className="section-padding bg-signal-light-gray">
      <div className="container mx-auto container-padding">
        <div className="text-center mb-12"> {/* Increased bottom margin for better spacing */}
          <h2 className="text-3xl md:text-4xl font-bold mb-1 font-lora">{t('membership.title')}</h2>
          <p className="text-xl text-muted-foreground font-medium">{t('membership.price')}</p>
          <p className="text-sm text-muted-foreground italic mt-1">{t('membership.subtitle')}</p>
        </div>

        {/* Unified Grid Layout for all screen sizes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {Object.entries(categories).map(([key, category]) => {
            const item = category.items[0];
            return (
              <Card key={key} className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col">
                <CardContent className="p-6 md:p-8 flex-grow"> {/* Use p-6 for mobile, p-8 for desktop */}
                  <div className="flex items-center mb-6">
                     <div
                      className="w-3 h-3 rounded-full mr-3 flex-shrink-0"
                      style={{ backgroundColor: getCategoryColor(key) }}
                    ></div>
                    <div className="flex-grow">
                      <h3 className="text-xl md:text-2xl font-lora font-medium text-foreground">
                        {category.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{category.frequency}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-base md:text-lg">{item.title}</h4>
                    <p className="text-muted-foreground text-sm mt-1">
                      {item.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
export default Membership;
