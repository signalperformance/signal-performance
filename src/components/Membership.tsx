
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '@/components/ui/table';
import { Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Membership = () => {
  const { t } = useLanguage();
  
  const features = [
    {
      title: t('membership.fitness.title'),
      description: t('membership.fitness.description'),
    },
    {
      title: t('membership.mental.title'),
      description: t('membership.mental.description'),
    },
    {
      title: t('membership.simulator.title'),
      description: t('membership.simulator.description'),
    },
    {
      title: t('membership.training.title'),
      description: t('membership.training.description'),
    },
  ];

  return (
    <section id="membership" className="section-padding bg-signal-light-gray">
      <div className="container mx-auto container-padding">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-lora">{t('membership.title')}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t('membership.subtitle')}</p>
        </div>
        
        <div className="overflow-hidden rounded-lg shadow-lg bg-white">
          <Table>
            <TableHeader>
              <TableRow className="bg-signal-charcoal hover:bg-signal-charcoal">
                <TableHead className="text-white font-lora text-xl p-6 w-1/3">Feature</TableHead>
                <TableHead className="text-white font-lora text-xl p-6 w-2/3">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {features.map((feature, index) => (
                <TableRow key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <TableCell className="p-6 align-top border-b">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="bg-signal-gold bg-opacity-10 text-signal-charcoal border-signal-gold px-3 py-1.5">
                        {index + 1}
                      </Badge>
                      <span className="font-medium text-lg font-lora">{feature.title}</span>
                    </div>
                  </TableCell>
                  <TableCell className="p-6 border-b">
                    <div className="flex items-center gap-2">
                      <Check className="text-signal-gold h-5 w-5 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature.description}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
};

export default Membership;
