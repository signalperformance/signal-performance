
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { 
  Area,
  XAxis, 
  YAxis, 
  AreaChart,
  ResponsiveContainer
} from 'recharts';

const WhySignalPerformance = () => {
  const { t } = useLanguage();
  const [animated, setAnimated] = useState(false);

  // Generate data points for the signal-to-noise graphic
  const generateData = () => {
    // Create baseline noise
    const data = Array(100).fill(null).map((_, i) => ({
      index: i,
      noise: Math.random() * 0.5 + 0.1,
      signal: 0
    }));
    
    // Add signal spike around index 30
    for (let i = 28; i < 35; i++) {
      if (i === 30) {
        data[i].signal = animated ? 4 : 0; // The peak
      } else if (i === 29 || i === 31) {
        data[i].signal = animated ? 2 : 0; // Build up and down
      } else if (i === 28 || i === 32) {
        data[i].signal = animated ? 1 : 0; // Smaller shoulders
      } else {
        data[i].signal = animated ? 0.5 : 0; // Smallest shoulders
      }
    }
    
    return data;
  };
  
  const [data, setData] = useState(generateData());
  
  // Run animation when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimated(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Update data when animation state changes
  useEffect(() => {
    setData(generateData());
  }, [animated]);
  
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
          {/* Signal-to-Noise Graphic */}
          <div className="w-full lg:w-1/3 h-64 md:h-96">
            <div className="bg-white p-4 rounded-lg shadow-sm h-full">
              <ChartContainer 
                config={{ 
                  signal: { color: "#ff3333" }, 
                  noise: { color: "#cccccc" } 
                }} 
                className="h-full"
              >
                <AreaChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                  <defs>
                    <linearGradient id="signalGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff3333" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ff3333" stopOpacity={0.2}/>
                    </linearGradient>
                    <linearGradient id="noiseGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#cccccc" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#cccccc" stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                  <XAxis hide={true} />
                  <YAxis hide={true} />
                  <ChartTooltip />
                  <Area 
                    type="monotone" 
                    dataKey="noise" 
                    stroke="#cccccc" 
                    fillOpacity={1} 
                    fill="url(#noiseGradient)" 
                    name="Noise"
                    animationDuration={800}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="signal" 
                    stroke="#ff3333" 
                    fillOpacity={1} 
                    fill="url(#signalGradient)" 
                    name="Signal"
                    animationDuration={1500}
                    isAnimationActive={true}
                  />
                </AreaChart>
              </ChartContainer>
              
              {/* Labels */}
              <div className="flex justify-between mt-2">
                <div></div> {/* Empty div to push "SIGNAL" to the middle */}
                <div className="font-bold">SIGNAL</div>
              </div>
              <div className="flex justify-between mt-0">
                <div></div> {/* Empty div to push "NOISE" to the right */}
                <div className="text-gray-500">NOISE</div>
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
