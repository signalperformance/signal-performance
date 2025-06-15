
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from '@/contexts/LanguageContext';
import { Check, X } from 'lucide-react';

const WhoItsFor = () => {
  const { t } = useLanguage();

  const forItems = [
    'whoitsfor.for.item1',
    'whoitsfor.for.item2',
    'whoitsfor.for.item3',
    'whoitsfor.for.item4',
    'whoitsfor.for.item5',
    'whoitsfor.for.item6',
  ];

  const notForItems = [
    'whoitsfor.notfor.item1',
    'whoitsfor.notfor.item2',
    'whoitsfor.notfor.item3',
    'whoitsfor.notfor.item4',
    'whoitsfor.notfor.item5',
    'whoitsfor.notfor.item6',
  ];

  return (
    <section id="who-its-for" className="section-padding bg-background">
      <div className="container mx-auto container-padding text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 font-lora text-signal-charcoal">{t('whoitsfor.title')}</h2>
        <p className="max-w-4xl mx-auto text-lg text-muted-foreground mb-12">{t('whoitsfor.subtitle')}</p>
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* "For You" Column */}
          <Card className="text-left shadow-lg bg-card h-full">
            <CardContent className="p-6 md:p-8">
              <h3 className="text-2xl font-bold mb-6 font-lora text-signal-charcoal">{t('whoitsfor.for.title')}</h3>
              <ul className="space-y-4">
                {forItems.map((itemKey) => (
                  <li key={itemKey} className="flex items-start">
                    <Check className="h-6 w-6 text-green-500 mr-4 mt-1 flex-shrink-0" />
                    <span className="text-lg text-signal-charcoal">{t(itemKey)}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* "Not For You" Column */}
          <Card className="text-left shadow-lg bg-card h-full">
            <CardContent className="p-6 md:p-8">
              <h3 className="text-2xl font-bold mb-6 font-lora text-signal-charcoal">{t('whoitsfor.notfor.title')}</h3>
              <ul className="space-y-4">
                {notForItems.map((itemKey) => (
                  <li key={itemKey} className="flex items-start">
                    <X className="h-6 w-6 text-red-500 mr-4 mt-1 flex-shrink-0" />
                    <span className="text-lg text-signal-charcoal">{t(itemKey)}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default WhoItsFor;
