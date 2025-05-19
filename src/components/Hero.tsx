
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight } from 'lucide-react';
import { useEffect, useRef } from 'react';

const Hero = () => {
  const { t } = useLanguage();
  const signalLineRef = useRef<SVGSVGElement>(null);

  // Animation for the signal line
  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion || !signalLineRef.current) return;
    
    const animate = () => {
      if (!signalLineRef.current) return;
      
      const path = signalLineRef.current.querySelector('path');
      if (!path) return;
      
      // Create a new path string with subtle variations
      const generatePath = () => {
        const width = signalLineRef.current?.width.baseVal.value || 300;
        const height = 20; // Height of SVG
        const midPoint = height / 2;
        
        let pathData = `M 0 ${midPoint}`;
        
        // Generate points for the path
        const points = 10;
        const stepSize = width / points;
        
        for (let i = 1; i <= points; i++) {
          const x = i * stepSize;
          // Create a gentle wave pattern with occasional peaks
          const variance = Math.random() < 0.2 ? Math.random() * 6 - 3 : Math.random() * 2 - 1;
          const y = midPoint + variance;
          pathData += ` L ${x} ${y}`;
        }
        
        return pathData;
      };
      
      // Animation timing
      const duration = 5000; // 5 seconds per animation cycle
      const startTime = Date.now();
      const initialPath = path.getAttribute('d') || '';
      const targetPath = generatePath();
      
      const updatePath = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        if (progress < 1) {
          requestAnimationFrame(updatePath);
        } else {
          // Start a new animation cycle
          setTimeout(() => animate(), 2000); // Wait 2 seconds before the next animation
        }
      };
      
      // Start the animation
      updatePath();
    };
    
    // Initial animation
    animate();
    
  }, []);

  return (
    <section id="home" className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background - using a clean white background */}
      <div className="absolute inset-0 z-0 bg-white"></div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 text-signal-charcoal max-w-5xl mx-auto leading-tight">
          Holistic Training Facility for Professional Golfers
        </h1>
        <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-signal-charcoal/80">
          Where elite golfers prepare to perform at their highest level.
        </p>
        
        {/* Signal Line Animation */}
        <div className="mb-8 w-full max-w-md mx-auto">
          <svg
            ref={signalLineRef}
            width="100%"
            height="20"
            viewBox="0 0 300 20"
            preserveAspectRatio="none"
            className="w-full"
            aria-hidden="true"
          >
            <path
              d="M 0 10 L 30 11 L 60 9 L 90 10 L 120 12 L 150 8 L 180 11 L 210 9 L 240 10 L 270 11 L 300 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-signal-charcoal/40"
            />
          </svg>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
          <Button 
            className="bg-signal-charcoal hover:bg-signal-charcoal/90 text-white font-medium px-8 py-6 text-lg flex items-center gap-2" 
            size="lg" 
            onClick={() => document.getElementById('waitlist')?.scrollIntoView({
              behavior: 'smooth'
            })}
          >
            Join the Waitlist <ArrowRight size={18} />
          </Button>
          <Button 
            className="bg-white hover:bg-gray-100 text-signal-charcoal font-medium border border-gray-200 px-8 py-6 text-lg" 
            variant="outline" 
            size="lg" 
            onClick={() => document.getElementById('membership')?.scrollIntoView({
              behavior: 'smooth'
            })}
          >
            Explore Membership
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
