
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const Hero = () => {
  const { t } = useLanguage();
  const signalLineRef = useRef<SVGSVGElement>(null);
  const [animating, setAnimating] = useState(true);

  // Animation for the signal line
  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion || !signalLineRef.current || !animating) return;
    
    let animationFrameId: number;
    let peakTimer: NodeJS.Timeout;
    
    const animate = () => {
      if (!signalLineRef.current) return;
      
      const path = signalLineRef.current.querySelector('path');
      if (!path) return;
      
      // Create baseline path (mostly flat with small variations)
      const generateBasePath = (width: number, height: number) => {
        const midPoint = height / 2;
        const points = 20;
        const stepSize = width / points;
        
        let pathData = `M 0 ${midPoint}`;
        
        for (let i = 1; i <= points; i++) {
          const x = i * stepSize;
          // Very small noise variations
          const variance = Math.random() * 2 - 1;
          const y = midPoint + variance;
          pathData += ` L ${x} ${y}`;
        }
        
        return pathData;
      };
      
      // Create path with sharp peak
      const generatePeakPath = (width: number, height: number, peakPosition: number) => {
        const midPoint = height / 2;
        const points = 20;
        const stepSize = width / points;
        
        let pathData = `M 0 ${midPoint}`;
        
        // Peak height (more dramatic)
        const peakHeight = height * 0.7;
        
        for (let i = 1; i <= points; i++) {
          const x = i * stepSize;
          let y = midPoint;
          
          // Calculate distance from peak (as a ratio from 0 to 1)
          const distFromPeak = Math.abs(i - peakPosition) / 2;
          
          if (distFromPeak < 1) {
            // Create sharp peak using triangular function
            if (i < peakPosition) {
              // Rising edge - sharp incline
              y = midPoint - peakHeight * (1 - distFromPeak);
            } else if (i > peakPosition) {
              // Falling edge - sharp decline
              y = midPoint - peakHeight * (1 - distFromPeak);
            } else {
              // Exact peak point
              y = midPoint - peakHeight;
            }
          } else {
            // Add small noise outside peak area
            const variance = Math.random() * 1.5 - 0.75;
            y = midPoint + variance;
          }
          
          pathData += ` L ${x} ${y}`;
        }
        
        return pathData;
      };
      
      // Animation timing
      const width = signalLineRef.current.width.baseVal.value || 300;
      const height = 20; // Height of SVG
      
      // Initial path (flat with small variations)
      let currentPath = generateBasePath(width, height);
      path.setAttribute('d', currentPath);
      
      // Function to create a peak at random intervals
      const createRandomPeak = () => {
        // Choose a random position for the peak (but not too close to edges)
        const peakPosition = 5 + Math.floor(Math.random() * 10); // Between positions 5 and 15
        
        // Generate and set the path with a peak
        const peakPath = generatePeakPath(width, height, peakPosition);
        path.setAttribute('d', peakPath);
        
        // Reset to baseline after peak duration
        setTimeout(() => {
          if (path && animating) {
            const basePath = generateBasePath(width, height);
            path.setAttribute('d', basePath);
          }
        }, 800); // Duration of peak visibility
        
        // Schedule next peak after random interval
        peakTimer = setTimeout(createRandomPeak, 3000 + Math.random() * 5000); // 3-8 second interval
      };
      
      // Start the peak animation cycle
      peakTimer = setTimeout(createRandomPeak, 2000);
      
      return () => {
        cancelAnimationFrame(animationFrameId);
        clearTimeout(peakTimer);
      };
    };
    
    // Initialize animation
    const cleanup = animate();
    
    return () => {
      setAnimating(false);
      if (cleanup) cleanup();
    };
    
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
              className="text-signal-charcoal/60"
              strokeLinecap="round"
              strokeLinejoin="round"
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
