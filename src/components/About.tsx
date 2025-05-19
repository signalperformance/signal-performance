
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-lora text-signal-charcoal">About Me</h2>
            <Separator className="mx-auto w-24 bg-signal-gold h-0.5" />
          </div>
          
          <div className="flex flex-col lg:flex-row gap-10 items-center lg:items-start">
            {/* Profile Section */}
            <div className="w-full lg:w-1/3">
              <div className="mb-6 flex justify-center">
                <div className="w-full max-w-xs">
                  <div className="rounded-lg overflow-hidden bg-[#67A3F0] relative">
                    <div className="aspect-ratio-1/1">
                      <img src="/lovable-uploads/9cd6f4c9-9cfc-435a-8ebb-2bbe20537915.png" alt="Dr. Noah Sachs" className="object-cover w-full h-full" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold font-lora text-signal-charcoal">Dr. Noah Sachs</h3>
                <p className="text-signal-gold mt-1 font-medium">Performance Coach</p>
              </div>
            </div>
            
            {/* Bio & Certification Section */}
            <div className="w-full lg:w-2/3">
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <div className="mb-6">
                    <h4 className="text-xl font-bold mb-3 text-signal-charcoal">Academic Background</h4>
                    <p className="text-lg leading-relaxed text-signal-charcoal/90">
                      Doctorate in Sport & Performance Psychology
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-bold mb-3 text-signal-charcoal">Professional Experience</h4>
                    <ul className="text-lg leading-relaxed text-signal-charcoal/90 space-y-2">
                      <li>Mental Performance Coach at IMG Academy</li>
                      <li>Cognitive Enhancement Practitioner for U.S. Air Force Special Operations</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              <h4 className="text-xl font-bold mb-4 text-signal-charcoal">Certifications</h4>
              <div className="grid grid-cols-4 gap-6">
                {/* First row - 4 certifications */}
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 mb-2">
                    <img src="/lovable-uploads/1d022755-a8e7-481a-91db-13f7db87b26a.png" alt="PGA of America Member" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-xs text-center text-signal-charcoal/80">PGA Member</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 mb-2">
                    <img src="/lovable-uploads/28f89c93-391d-4f91-bc76-be4af64ab42b.png" alt="Golf Channel Academy" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-xs text-center text-signal-charcoal/80">GCIA Coach</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 mb-2">
                    <img src="/lovable-uploads/1dc02882-2327-403c-9e82-8b8207c618ff.png" alt="CSCS Certification" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-xs text-center text-signal-charcoal/80">CSCS</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 mb-2">
                    <img src="/lovable-uploads/09961efd-a840-417f-a93a-2e2990b91489.png" alt="CMPC Certification" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-xs text-center text-signal-charcoal/80">CMPC</span>
                </div>
                
                {/* Second row - 2 larger certifications */}
                <div className="flex flex-col items-center col-span-2">
                  <div className="w-40 h-40 mb-2">
                    <img src="/lovable-uploads/beb7975b-c02a-42bc-be92-0c3da1a9f81c.png" alt="FRA Certification" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-xs text-center text-signal-charcoal/80">FRA</span>
                </div>
                <div className="flex flex-col items-center col-span-2">
                  <div className="w-40 h-40 mb-2">
                    <img src="/lovable-uploads/bb4a1533-7785-47f6-a0fa-6a037df47902.png" alt="FRC Certification" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-xs text-center text-signal-charcoal/80">FRC</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};

export default About;
