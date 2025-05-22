
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
            {/* Gray sine wave background - smooth with varying amplitude */}
            <path 
              d="M0,100 
                 C50,120 100,80 150,100 
                 C200,120 250,80 300,100 
                 C350,120 400,80 450,100 
                 C500,120 550,80 600,100 
                 C650,120 700,80 750,100 
                 C800,120 850,80 900,100 
                 C950,120 1000,80 1050,100 
                 C1100,120 1150,80 1200,100"
              fill="none"
              stroke="#D1D5DB"
              strokeWidth="1.5"
            />
            
            {/* Red spike in the center - smooth curved spike */}
            <path 
              d="M580,100 Q600,30 620,100"
              fill="none"
              stroke="#EF4444"
              strokeWidth="2"
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
