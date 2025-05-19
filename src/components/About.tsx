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
                  <p className="text-lg leading-relaxed text-signal-charcoal/90 mb-4">
                    Welcome to Signal Performance! As a dedicated golf performance specialist, I focus on helping professional 
                    golfers achieve their highest potential through holistic training methods that integrate physical conditioning, 
                    technical skill development, and mental performance strategies.
                  </p>
                  <p className="text-lg leading-relaxed text-signal-charcoal/90">
                    With expertise in biomechanics, strength conditioning, and performance psychology, I provide comprehensive 
                    training programs tailored to each golfer's unique needs. My evidence-based approach helps golfers not only improve 
                    their game but also prevent injuries and extend their careers.
                  </p>
                </CardContent>
              </Card>
              
              <h4 className="text-xl font-bold mb-4 text-signal-charcoal">Certifications</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default About;