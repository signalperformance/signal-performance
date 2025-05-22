
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from '@/contexts/LanguageContext';

const Philosophy = () => {
  const { t } = useLanguage();
  
  return (
    <section id="philosophy" className="section-padding bg-white">
      <div className="container mx-auto container-padding">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center font-lora">Our Philosophy</h2>
        
        <div className="flex flex-col lg:flex-row gap-8 items-center">
          {/* Left side - Signal Graphic */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md aspect-square">
              {/* The base/ground part - light gray noise texture */}
              <div className="absolute bottom-0 w-full h-1/4 bg-gray-200 bg-opacity-80" 
                   style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />
              
              {/* The signal/spike part - in signal-gold */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/5 h-full bg-red-600" 
                   style={{ 
                     clipPath: 'polygon(0% 100%, 100% 100%, 50% 0%)'
                   }} />
            </div>
          </div>
          
          {/* Right side - Philosophy Cards */}
          <div className="w-full lg:w-1/2 space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-lora text-signal-charcoal">Signal Over Noise</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our name comes from the concept of the signal-to-noise ratio—a principle in data science and engineering. 
                  The "signal" is meaningful, actionable information. The "noise" is everything that gets in the way. 
                  We apply this mindset to golf performance by identifying what matters most and cutting the rest.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-lora text-signal-charcoal">Measure, Don't Guess</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We take a data-informed, evidence-based approach to golf performance. 
                  Not chasing trends. Not relying on guesswork. Just smart, effective programming 
                  that respects your time and delivers real results.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-lora text-signal-charcoal">Integrated Training</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Performance isn't driven by one thing—it's the result of many things working together. 
                  We treat mind, body, and skill as a single, interconnected system. 
                  That's why our training is truly integrated: it reflects the way performance actually works.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Philosophy;
