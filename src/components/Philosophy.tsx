
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from '@/contexts/LanguageContext';

const Philosophy = () => {
  const { t } = useLanguage();
  
  return (
    <section id="philosophy" className="section-padding bg-white">
      <div className="container mx-auto container-padding">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center font-lora">Our Philosophy</h2>
        
        {/* Signal wave graphic */}
        <div className="w-full mb-12 relative h-32 md:h-40 overflow-hidden">
          {/* Gray sine wave background */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 150" preserveAspectRatio="none">
            <path 
              d="M0,50 C50,30 100,70 150,50 C200,30 250,70 300,50 C350,30 400,70 450,50 C500,30 550,70 600,50 C650,30 700,70 750,50 C800,30 850,70 900,50 C950,30 1000,70 1050,50 C1100,30 1150,70 1200,50 V150 H0 Z" 
              fill="none"
              stroke="#D1D5DB"
              strokeWidth="2"
            />
          </svg>
          
          {/* Red peak spike */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 150" preserveAspectRatio="none">
            <path 
              d="M590,50 L600,5 L610,50"
              fill="none"
              stroke="#EF4444"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
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
