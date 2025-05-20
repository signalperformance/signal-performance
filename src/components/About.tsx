
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const About = () => {
  const {
    t
  } = useLanguage();
  
  return <section id="about" className="section-padding bg-white">
      <div className="container mx-auto container-padding">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-lora text-signal-charcoal">{t('about.coach.title')}</h2>
            <Separator className="mx-auto w-24 bg-signal-gold h-0.5" />
          </div>
          
          <div className="flex flex-col lg:flex-row gap-10 items-center lg:items-start">
            {/* Profile Section */}
            <div className="w-full lg:w-1/3">
              <div className="mb-6 flex justify-center">
                <div className="w-full max-w-xs">
                  <div className="rounded-lg overflow-hidden bg-signal-gold/20 relative">
                    <div className="aspect-ratio-1/1">
                      <img src="/lovable-uploads/9cd6f4c9-9cfc-435a-8ebb-2bbe20537915.png" alt="Dr. Noah Sachs" className="object-cover w-full h-full" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold font-lora text-signal-charcoal">{t('about.coach.name')}</h3>
                <p className="text-signal-gold mt-1 font-medium">{t('about.coach.position')}</p>
              </div>
            </div>
            
            {/* Bio & Certification Section */}
            <div className="w-full lg:w-2/3">
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <div className="mb-6">
                    <h4 className="text-xl font-bold mb-3 text-signal-charcoal">{t('about.coach.academic')}</h4>
                    <p className="text-sm leading-relaxed text-signal-charcoal/90">
                      {t('about.coach.academic.degree')}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-bold mb-3 text-signal-charcoal">{t('about.coach.experience')}</h4>
                    <ul className="text-sm leading-relaxed text-signal-charcoal/90 space-y-2">
                      <li>{t('about.coach.experience.img')}</li>
                      <li>{t('about.coach.experience.usaf')}</li>
                      <li>{t('about.coach.experience.pga')}</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              <h4 className="text-xl font-bold mb-4 text-signal-charcoal">{t('about.coach.certifications')}</h4>
              <div className="grid grid-cols-5 gap-4">
                {/* First row - 5 certifications in the new order: PGA, CSCS, CMPC, Biofeedback, Neurofeedback */}
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 mb-2">
                    <img src="/lovable-uploads/1d022755-a8e7-481a-91db-13f7db87b26a.png" alt="PGA of America Member" className="w-full h-full object-contain" />
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 mb-2">
                    <img src="/lovable-uploads/1dc02882-2327-403c-9e82-8b8207c618ff.png" alt="CSCS Certification" className="w-full h-full object-contain" />
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 mb-2">
                    <img src="/lovable-uploads/09961efd-a840-417f-a93a-2e2990b91489.png" alt="CMPC Certification" className="w-full h-full object-contain" />
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 mb-2">
                    <img src="/lovable-uploads/81b45c03-40d4-4cab-b7ad-893125dff714.png" alt="BCIA Biofeedback Certification" className="w-full h-full object-contain" />
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 mb-2">
                    <img alt="Golf Channel Academy" className="w-full h-full object-contain" src="/lovable-uploads/7386a216-356d-4d52-8c2f-60bfc9a85397.png" />
                  </div>
                </div>
                
                {/* Second row - 2 larger certifications with improved centering, shifted to the left */}
                <div className="flex justify-end col-span-2 mt-1 col-start-1">
                  <div className="w-36 h-36 pr-4">
                    <img src="/lovable-uploads/beb7975b-c02a-42bc-be92-0c3da1a9f81c.png" alt="FRA Certification" className="w-full h-full object-contain" />
                  </div>
                </div>
                <div className="flex justify-start col-span-2 mt-1">
                  <div className="w-36 h-36 pl-4">
                    <img src="/lovable-uploads/bb4a1533-7785-47f6-a0fa-6a037df47902.png" alt="FRC Certification" className="w-full h-full object-contain" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};

export default About;
