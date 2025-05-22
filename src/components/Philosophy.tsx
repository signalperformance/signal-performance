
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from '@/contexts/LanguageContext';

const Philosophy = () => {
  const { t } = useLanguage();
  
  return (
    <section id="philosophy" className="section-padding bg-white">
      <div className="container mx-auto container-padding">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center font-lora">Our Philosophy</h2>
        
        {/* Signal wave graphic */}
        <div className="w-full mb-12 relative h-40 md:h-48 overflow-hidden">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 200" preserveAspectRatio="none">
            {/* Gray sine wave background - more smooth and continuous */}
            <path 
              d="M0,100 
                 C20,110 40,90 60,100 
                 C80,110 100,90 120,100 
                 C140,110 160,90 180,100
                 C200,110 220,90 240,100
                 C260,110 280,90 300,100
                 C320,110 340,90 360,100
                 C380,110 400,90 420,100
                 C440,110 460,90 480,100
                 C500,110 520,90 540,100
                 C560,110 580,90 600,100
                 C620,110 640,90 660,100
                 C680,110 700,90 720,100
                 C740,110 760,90 780,100
                 C800,110 820,90 840,100
                 C860,110 880,90 900,100
                 C920,110 940,90 960,100
                 C980,110 1000,90 1020,100
                 C1040,110 1060,90 1080,100
                 C1100,110 1120,90 1140,100
                 C1160,110 1180,90 1200,100"
              fill="none"
              stroke="#D1D5DB"
              strokeWidth="2"
            />
            
            {/* Red spike in the center - taller and more prominent */}
            <path 
              d="M590,100 L600,20 L610,100"
              fill="none"
              stroke="#EF4444"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
        
        {/* Philosophy cards - horizontal layout on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border rounded-lg p-6">
            <CardTitle className="text-xl md:text-2xl font-lora mb-4 text-signal-charcoal">Signal Over Noise</CardTitle>
            <p className="text-muted-foreground">
              Our name comes from the concept of the signal-to-noise ratio—a principle in data science and engineering. 
              The "signal" is meaningful, actionable information. The "noise" is everything that gets in the way. 
              We apply this mindset to golf performance by identifying what matters most and cutting the rest.
            </p>
          </Card>
          
          <Card className="border rounded-lg p-6">
            <CardTitle className="text-xl md:text-2xl font-lora mb-4 text-signal-charcoal">Measure, Don't Guess</CardTitle>
            <p className="text-muted-foreground">
              We take a data-informed, evidence-based approach to golf performance. 
              Not chasing trends. Not relying on guesswork. Just smart, effective programming 
              that respects your time and delivers real results.
            </p>
          </Card>
          
          <Card className="border rounded-lg p-6">
            <CardTitle className="text-xl md:text-2xl font-lora mb-4 text-signal-charcoal">Integrated Training</CardTitle>
            <p className="text-muted-foreground">
              Performance isn't driven by one thing—it's the result of many things working together. 
              We treat mind, body, and skill as a single, interconnected system. 
              That's why our training is truly integrated: it reflects the way performance actually works.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Philosophy;
