import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from '@/contexts/LanguageContext';
const Philosophy = () => {
  const {
    t
  } = useLanguage();
  return <section id="philosophy" className="section-padding bg-white">
      <div className="container mx-auto container-padding">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center font-lora">Our Philosophy</h2>
        
        {/* Signal wave graphic - responsive images for different screen sizes */}
        <div className="w-full mb-12 relative h-36 md:h-32 flex items-center justify-center">
          {/* Mobile image (visible on smaller screens) */}
          <img alt="Signal wave with red spike" className="w-full max-w-5xl h-auto object-contain md:hidden" src="/lovable-uploads/43c83554-cc61-4cc0-9dfd-783d9edd9801.png" />
          
          {/* Desktop image (hidden on mobile, visible on md screens and up) */}
          <img src="/lovable-uploads/9823eeb3-9e86-4736-b87b-ec93c5b38202.png" alt="Signal wave with red spike" className="w-full max-w-5xl h-auto object-contain hidden md:block" />
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
    </section>;
};
export default Philosophy;