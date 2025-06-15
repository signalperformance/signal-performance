
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from '@/contexts/LanguageContext';
import { Check } from 'lucide-react';

const WhoItsFor = () => {
  const { t } = useLanguage();

  const checklistItems = [
    'whoitsfor.item1',
    'whoitsfor.item2',
    'whoitsfor.item3',
    'whoitsfor.item4',
    'whoitsfor.item5',
    'whoitsfor.item6',
  ];

  return (
    <section id="who-its-for" className="section-padding bg-background">
      <div className="container mx-auto container-padding text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 font-lora text-signal-charcoal">{t('whoitsfor.title')}</h2>
        <p className="max-w-3xl mx-auto text-lg text-muted-foreground mb-12">{t('whoitsfor.subtitle')}</p>
        
        <div className="max-w-4xl mx-auto">
          <Card className="text-left shadow-lg bg-card">
            <CardContent className="p-6 md:p-8">
              <ul className="space-y-4">
                {checklistItems.map((itemKey) => (
                  <li key={itemKey} className="flex items-start">
                    <Check className="h-6 w-6 text-green-500 mr-4 mt-1 flex-shrink-0" />
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
