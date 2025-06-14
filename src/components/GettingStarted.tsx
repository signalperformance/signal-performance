
import { useLanguage } from "@/contexts/LanguageContext";

const GettingStarted = () => {
  const { t } = useLanguage();

  const steps = [
    { id: 1, titleKey: 'gettingStarted.step1.title' },
    { id: 2, titleKey: 'gettingStarted.step2.title' },
    { id: 3, titleKey: 'gettingStarted.step3.title' },
    { id: 4, titleKey: 'gettingStarted.step4.title' },
  ];

  // Coordinates are based on a 1024px wide container (max-w-5xl)
  // for calculating SVG path data. This allows the SVG to scale responsively.
  const itemWidth = 160;
  const gapWidth = 128;
  const stepCenters = {
    1: itemWidth / 2,
    2: itemWidth / 2 + itemWidth + gapWidth,
    3: itemWidth / 2 + (itemWidth + gapWidth) * 2,
    4: itemWidth / 2 + (itemWidth + gapWidth) * 3,
  };
  const yPos = 1; // 1px from top to ensure the line is visible
  const tickHeight = 12;

  return (
    <section id="getting-started" className="section-padding bg-signal-light-gray">
      <div className="container mx-auto text-center container-padding">
        <h2 className="text-4xl font-lora font-bold mb-20 text-signal-charcoal">{t('gettingStarted.title')}</h2>
        
        {/* Desktop View */}
        <div className="hidden md:block relative w-full max-w-5xl mx-auto">
          {/* SVG for drawing the connecting lines and bracket */}
          <div className="absolute top-10 left-0 right-0 h-10">
            <svg
              className="w-full h-full"
              viewBox="0 0 1024 20"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {/* Horizontal line for bracket 1-3 */}
              <line x1={stepCenters[1]} y1={yPos} x2={stepCenters[3]} y2={yPos} stroke="#425563" strokeWidth="2" />
              {/* Ticks for bracket */}
              <line x1={stepCenters[1]} y1={yPos} x2={stepCenters[1]} y2={yPos + tickHeight} stroke="#425563" strokeWidth="2" />
              <line x1={stepCenters[2]} y1={yPos} x2={stepCenters[2]} y2={yPos + tickHeight} stroke="#425563" strokeWidth="2" />
              <line x1={stepCenters[3]} y1={yPos} x2={stepCenters[3]} y2={yPos + tickHeight} stroke="#425563" strokeWidth="2" />
              {/* Connecting line from 3 to 4 */}
              <line x1={stepCenters[3]} y1={yPos} x2={stepCenters[4]} y2={yPos} stroke="#425563" strokeWidth="2" />
            </svg>
          </div>
          
          <div className="relative flex justify-between items-start pt-12">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center text-center w-40">
                <div className="relative bg-signal-light-gray p-2 z-10">
                  <div className="flex items-center justify-center w-20 h-20 bg-signal-charcoal rounded-full text-white text-3xl font-bold font-lora">
                    {step.id}
                  </div>
                </div>
                <h3 className="mt-4 text-lg font-montserrat font-semibold text-signal-charcoal w-full">{t(step.titleKey)}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-12">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center w-20 h-20 bg-signal-charcoal rounded-full text-white text-3xl font-bold font-lora">
                {step.id}
              </div>
              <h3 className="mt-4 text-lg font-montserrat font-semibold text-signal-charcoal">{t(step.titleKey)}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GettingStarted;
