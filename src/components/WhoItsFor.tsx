
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from '@/contexts/LanguageContext';
import { Check, X } from 'lucide-react';

const WhoItsFor = () => {
  const { t } = useLanguage();
  
  const forItems = [
    'whoitsfor.for.item1',
    'whoitsfor.for.item2', 
    'whoitsfor.for.item3',
    'whoitsfor.for.item4'
  ];
  
  const notForItems = [
    'whoitsfor.notfor.item1',
    'whoitsfor.notfor.item2',
    'whoitsfor.notfor.item3', 
    'whoitsfor.notfor.item4'
  ];

  return (
    <section id="who-its-for" className="section-padding bg-white">
      <div className="container mx-auto container-padding text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 font-lora text-signal-charcoal animate-fade-in">
          {t('whoitsfor.title')}
        </h2>
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* "For You" Column */}
          <Card className="text-left shadow-xl bg-gradient-to-br from-emerald-50 via-white to-green-50 hover:shadow-2xl transition-all duration-500 hover:scale-105 h-full border-2 border-green-100 group animate-scale-in">
            <CardContent className="p-8 md:p-10">
              <div className="flex items-center mb-8">
                <h3 className="text-lg md:text-2xl lg:text-3xl font-bold font-lora text-signal-charcoal group-hover:text-green-700 transition-colors duration-300">
                  {t('whoitsfor.for.title')}
                </h3>
              </div>
              <ul className="space-y-6">
                {forItems.map((itemKey, index) => (
                  <li 
                    key={itemKey} 
                    className="flex items-start group-hover:translate-x-2 transition-transform duration-300"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <Check className="h-7 w-7 text-green-500 mr-5 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-lg md:text-xl text-signal-charcoal leading-relaxed">
                      {t(itemKey)}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* "Not For You" Column */}
          <Card className="text-left shadow-xl bg-gradient-to-br from-red-50 via-white to-rose-50 hover:shadow-2xl transition-all duration-500 hover:scale-105 h-full border-2 border-red-100 group animate-scale-in">
            <CardContent className="p-8 md:p-10">
              <div className="flex items-center mb-8">
                <h3 className="text-lg md:text-2xl lg:text-3xl font-bold font-lora text-signal-charcoal group-hover:text-red-700 transition-colors duration-300">
                  {t('whoitsfor.notfor.title')}
                </h3>
              </div>
              <ul className="space-y-6">
                {notForItems.map((itemKey, index) => (
                  <li 
                    key={itemKey} 
                    className="flex items-start group-hover:translate-x-2 transition-transform duration-300"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <X className="h-7 w-7 text-red-500 mr-5 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-lg md:text-xl text-signal-charcoal leading-relaxed">
                      {t(itemKey)}
                    </span>
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
