
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const WhySignalPerformance = () => {
  const { t } = useLanguage();
  
  const cards = [
    {
      title: "More Isn't Always Better",
      text: "In golf and in life, we're bombarded with information—swing tips, training hacks, tech data, opinions. Most of it is noise. The real challenge is knowing what's worth your time and what's just distraction."
    },
    {
      title: "Signal Over Noise",
      text: "Our name comes from the signal-to-noise ratio—a core idea from data science. The \"signal\" is the meaningful data. The \"noise\" is everything that gets in the way. At Signal Performance, we're focused on finding what truly matters."
    },
    {
      title: "Data-Informed. Time-Efficient.",
      text: "We take a data-informed, evidence-based approach to golf performance. Not chasing trends. Not relying on guesswork. Just smart, effective programming that respects your time and delivers real results."
    },
    {
      title: "There's No One Thing",
      text: "Golfers love to credit wins or losses to one cause—but performance doesn't work that way. Human performance is complex. It's never just one variable. It's the combination, interaction, and accumulation of many."
    },
    {
      title: "Mind. Body. Skill. One System.",
      text: "We don't train parts of the golfer—we train the whole. Mind, body, and skill are deeply connected. You can't separate them, so we don't. Our training is integrated because performance is integrated."
    },
    {
      title: "The Signal That Moves the Needle",
      text: "Our goal is simple: Help you improve faster, more efficiently, and more meaningfully. We help you cut through the noise and focus on the elements that actually drive performance—nothing extra."
    }
  ];

  return (
    <section id="why-signal" className="py-16 md:py-24 bg-signal-light-gray">
      <div className="container mx-auto container-padding">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-lora text-signal-charcoal">
            Why Signal Performance
          </h2>
          <Separator className="mx-auto w-24 bg-signal-gold h-0.5" />
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8 items-center">
          {/* Static Signal-to-Noise Graphic */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white p-4 rounded-lg shadow-sm h-full overflow-hidden">
              <div className="relative h-64 md:h-80">
                {/* Gray background noise */}
                <div className="absolute inset-0 flex items-center">
                  <svg viewBox="0 0 400 200" className="w-full h-full" preserveAspectRatio="none">
                    <path 
                      d="M0,100 Q10,110 20,95 T40,105 T60,90 T80,100 T100,85 T120,95 T140,90 T160,100 T180,95 T200,105 T220,90 T240,100 T260,95 T280,85 T300,100 T320,90 T340,105 T360,95 T380,100 T400,90" 
                      fill="none" 
                      stroke="#cccccc" 
                      strokeWidth="2" 
                    />
                    <path 
                      d="M0,100 Q10,90 20,105 T40,95 T60,110 T80,100 T100,115 T120,105 T140,110 T160,100 T180,105 T200,95 T220,110 T240,100 T260,105 T280,115 T300,100 T320,110 T340,95 T360,105 T380,100 T400,110" 
                      fill="none" 
                      stroke="#cccccc" 
                      strokeWidth="2" 
                    />
                    <path 
                      d="M0,100 Q20,105 40,95 T80,105 T120,90 T160,105 T200,95 T240,105 T280,90 T320,105 T360,95 T400,100" 
                      fill="rgba(204,204,204,0.2)" 
                      strokeWidth="0" 
                    />
                  </svg>
                </div>
                
                {/* Red signal peak */}
                <div className="absolute inset-0 flex items-center">
                  <svg viewBox="0 0 400 200" className="w-full h-full" preserveAspectRatio="none">
                    <path 
                      d="M180,100 L190,100 L195,90 L200,50 L205,90 L210,100 L220,100" 
                      fill="none" 
                      stroke="#ff3333" 
                      strokeWidth="2" 
                    />
                    <path 
                      d="M180,100 L190,100 L195,90 L200,50 L205,90 L210,100 L220,100 L220,100 L210,100 L195,100 L180,100" 
                      fill="rgba(255,51,51,0.2)" 
                      strokeWidth="0" 
                    />
                  </svg>
                </div>
              </div>
              
              {/* Labels */}
              <div className="flex justify-between mt-2">
                <div></div> {/* Empty div to push "SIGNAL" to the middle */}
                <div className="font-bold text-center">SIGNAL</div>
                <div></div>
              </div>
              <div className="flex justify-end mt-0">
                <div className="text-gray-500 mr-4">NOISE</div>
              </div>
            </div>
          </div>
          
          {/* Text Cards */}
          <div className="w-full lg:w-2/3">
            <div className="grid md:grid-cols-2 gap-6">
              {cards.map((card, index) => (
                <Card key={index} className="shadow-sm">
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-bold mb-3 text-signal-charcoal">{card.title}</h3>
                    <p className="text-sm leading-relaxed text-signal-charcoal/80">{card.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhySignalPerformance;
