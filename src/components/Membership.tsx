
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const MembershipFeature = ({ 
  icon, 
  title, 
  description 
}: { 
  icon: string; 
  title: string; 
  description: string; 
}) => (
  <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
    <CardContent className="p-6 flex flex-col items-center text-center h-full">
      <div className="text-signal-gold mb-4 text-4xl">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 font-playfair">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const Membership = () => {
  const { t } = useLanguage();
  
  const features = [
    {
      icon: '💪',
      title: t('membership.fitness.title'),
      description: t('membership.fitness.description'),
    },
    {
      icon: '🧠',
      title: t('membership.mental.title'),
      description: t('membership.mental.description'),
    },
    {
      icon: '🏌️',
      title: t('membership.simulator.title'),
      description: t('membership.simulator.description'),
    },
    {
      icon: '🔄',
      title: t('membership.training.title'),
      description: t('membership.training.description'),
    },
  ];

  return (
    <section id="membership" className="section-padding bg-signal-light-gray">
      <div className="container mx-auto container-padding">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-playfair">{t('membership.title')}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t('membership.subtitle')}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <MembershipFeature 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Membership;
