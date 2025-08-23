import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const About = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto container-padding">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 data-scroll-anchor className="text-3xl md:text-4xl font-bold mb-4 text-signal-charcoal">{t('about.coach.title')}</h2>
            <Separator className="mx-auto w-24 bg-signal-gold h-0.5" />
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
            {/* Profile Section */}
            <div className="w-full lg:w-1/3">
              <div className="mb-4 flex justify-center">
                <div className="w-full max-w-xs">
                  <div className="rounded-lg overflow-hidden bg-signal-gold/20 relative">
                    <div className="aspect-ratio-1/1">
                      <img src="/lovable-uploads/9cd6f4c9-9cfc-435a-8ebb-2bbe20537915.png" alt="Dr. Noah Sachs" className="object-cover w-full h-full" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-signal-charcoal">{t('about.coach.name')}</h3>
                <p className="text-signal-gold mt-1 text-base font-semibold">{t('about.coach.position')}</p>
              </div>
            </div>
            
            {/* Bio & Certification Section */}
            <div className="w-full lg:w-2/3">
              {/* Academic & Experience Card */}
              <Card className="mb-4 shadow-xl border-2 border-gray-100">
                <CardContent className="pt-6">
                  <div className="mb-4">
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
              
              {/* Certifications Card */}
              <Card className="shadow-xl border-2 border-gray-100">
                <CardContent className="pt-6">
                  <h4 className="text-xl font-bold mb-4 text-signal-charcoal">{t('about.coach.certifications')}</h4>
                  
                  {/* Mobile layout - stacked */}
                  <div className="flex flex-col space-y-4 md:hidden">
                    {/* First row - 3 certifications: PGA, CSCS, CMPC */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16">
                          <img src="/lovable-uploads/1d022755-a8e7-481a-91db-13f7db87b26a.png" alt="PGA of America Member" className="w-full h-full object-contain" />
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16">
                          <img src="/lovable-uploads/1dc02882-2327-403c-9e82-8b8207c618ff.png" alt="CSCS Certification" className="w-full h-full object-contain" />
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16">
                          <img src="/lovable-uploads/09961efd-a840-417f-a93a-2e2990b91489.png" alt="CMPC Certification" className="w-full h-full object-contain" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Second row - 3 BCIA certifications */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex justify-center">
                        <div className="w-16 h-16">
                          <img alt="BCIA Biofeedback Certification" className="w-full h-full object-contain" src="/lovable-uploads/b8e8e7d5-5980-475f-9534-3660f734bccf.png" />
                        </div>
                      </div>
                      <div className="flex justify-center">
                        <div className="w-16 h-16">
                          <img alt="TPI Certified Fitness 3" className="w-full h-full object-contain" src="/lovable-uploads/80663943-a684-4747-88d6-29d27b58e790.png" />
                        </div>
                      </div>
                      <div className="flex justify-center">
                        <div className="w-16 h-16">
                          <img alt="BCIA Neurofeedback Certification" className="w-full h-full object-contain" src="/lovable-uploads/650394e1-2bf5-4354-b912-86a81648eaaa.png" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Third row - 3 additional certifications */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex justify-center">
                        <div className="w-16 h-16">
                          <img alt="FRC Certification" className="w-full h-full object-contain" src="/lovable-uploads/05754402-e6c2-4ca2-98e3-9ba6aad7a5ea.png" />
                        </div>
                      </div>
                      <div className="flex justify-center">
                        <div className="w-16 h-16">
                          <img alt="FRA Certification" className="w-full h-full object-contain" src="/lovable-uploads/ea936717-eb96-4705-98af-8513f4b6c976.png" />
                        </div>
                      </div>
                      <div className="flex justify-center">
                        <div className="w-16 h-16">
                          <img alt="FMS Certified 2" className="w-full h-full object-contain" src="/lovable-uploads/385d07dd-80d6-44cb-b2ef-9cbc80e9c887.png" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Desktop layout - staggered */}
                  <div className="hidden md:block">
                    <div className="relative">
                      {/* Top row - 3 certifications */}
                      <div className="flex justify-between mb-6">
                        <div className="flex flex-col items-center">
                          <div className="w-20 h-20">
                            <img src="/lovable-uploads/1d022755-a8e7-481a-91db-13f7db87b26a.png" alt="PGA of America Member" className="w-full h-full object-contain" />
                          </div>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-20 h-20">
                            <img src="/lovable-uploads/1dc02882-2327-403c-9e82-8b8207c618ff.png" alt="CSCS Certification" className="w-full h-full object-contain" />
                          </div>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-20 h-20">
                            <img src="/lovable-uploads/09961efd-a840-417f-a93a-2e2990b91489.png" alt="CMPC Certification" className="w-full h-full object-contain" />
                          </div>
                        </div>
                      </div>
                      
                      {/* Bottom row - 3 certifications */}
                      <div className="flex justify-between mb-6">
                        <div className="flex flex-col items-center">
                          <div className="w-20 h-20">
                            <img alt="BCIA Biofeedback Certification" className="w-full h-full object-contain" src="/lovable-uploads/b8e8e7d5-5980-475f-9534-3660f734bccf.png" />
                          </div>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-20 h-20">
                            <img alt="TPI Certified Fitness 3" className="w-full h-full object-contain" src="/lovable-uploads/80663943-a684-4747-88d6-29d27b58e790.png" />
                          </div>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-20 h-20">
                            <img alt="BCIA Neurofeedback Certification" className="w-full h-full object-contain" src="/lovable-uploads/650394e1-2bf5-4354-b912-86a81648eaaa.png" />
                          </div>
                        </div>
                      </div>
                      
                      {/* Third row - 3 additional certifications */}
                      <div className="flex justify-between">
                        <div className="flex flex-col items-center">
                          <div className="w-20 h-20">
                            <img alt="FRC Certification" className="w-full h-full object-contain" src="/lovable-uploads/05754402-e6c2-4ca2-98e3-9ba6aad7a5ea.png" />
                          </div>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-20 h-20">
                            <img alt="FRA Certification" className="w-full h-full object-contain" src="/lovable-uploads/ea936717-eb96-4705-98af-8513f4b6c976.png" />
                          </div>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-20 h-20">
                            <img alt="FMS Certified 2" className="w-full h-full object-contain" src="/lovable-uploads/385d07dd-80d6-44cb-b2ef-9cbc80e9c887.png" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
