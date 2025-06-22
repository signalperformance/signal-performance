
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Users, User, FileText } from "lucide-react";

const Membership = () => {
  const { t } = useLanguage();

  const membershipFeatures = [
    {
      icon: <Users className="w-8 h-8 text-signal-gold" />,
      title: t('membership.physical.title'),
      frequency: t('membership.physical.frequency'),
      service: t('membership.physical.coaching'),
      description: t('membership.physical.coaching.description')
    },
    {
      icon: <User className="w-8 h-8 text-signal-gold" />,
      title: t('membership.mental.title'),
      frequency: t('membership.mental.frequency'),
      service: t('membership.mental.coaching'),
      description: t('membership.mental.coaching.description')
    },
    {
      icon: <Clock className="w-8 h-8 text-signal-gold" />,
      title: t('membership.golf.title'),
      frequency: t('membership.golf.frequency'),
      service: t('membership.golf.skillassessment'),
      description: t('membership.golf.skillassessment.description')
    },
    {
      icon: <FileText className="w-8 h-8 text-signal-gold" />,
      title: t('membership.report.title'),
      frequency: t('membership.report.frequency'),
      service: "",
      description: t('membership.report.description')
    }
  ];

  return (
    <section id="membership" className="section-padding bg-muted/30">
      <div className="container mx-auto container-padding">
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-signal-charcoal">
            {t('membership.title')}
          </h2>
          <div className="mb-6">
            <p className="text-4xl md:text-5xl font-bold text-signal-gold mb-2">
              {t('membership.price')}
            </p>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('membership.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {membershipFeatures.map((feature, index) => (
            <Card key={index} className="bg-background border-signal-gold/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl text-signal-charcoal mb-2">
                  {feature.title}
                </CardTitle>
                <p className="text-signal-gold font-semibold text-lg">
                  {feature.frequency}
                </p>
              </CardHeader>
              <CardContent className="text-center pt-0">
                {feature.service && (
                  <h4 className="font-semibold text-signal-charcoal mb-2">
                    {feature.service}
                  </h4>
                )}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Membership;
